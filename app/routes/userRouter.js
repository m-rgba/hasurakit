const express = require("express");
const dayjs = require('dayjs');
const bcrypt = require("bcryptjs");
const router = express.Router();
const fetch = require("node-fetch");
const hashPassword = require('../utils/common');
const dotenv = require("dotenv");
const knexConfig = require('../db/knexfile');
const HttpException = require('../utils/HttpException');
const fs = require('fs');
dotenv.config();
//initialize knex
const knex = require('knex')(knexConfig[process.env.NODE_ENV]);
//allowed user middleware
const {isAllowedUser, isAllowedGrphql, isAllowedMetadata, isAllowedMigrations} = require('../middleware/authUser');

/************* routers ************/

//test router
router.get("/test", (req, res) => res.json({ msg: "Users works!!" }));

//set cookie using name and password
router.post('/auth/login', async (req, res) => {
    const name = req.body.name ? req.body.name : '';
    const password = req.body.password ? req.body.password : '';
    
    if (!req.body.name) {
        return res.json({success: false, message: 'Name is required'});
    }

    if (!req.body.password) {
       return res.json({success: false, message: 'Password is required'});
    }    
    knex('users')
    .select()
    .where({name})
    .then( async (user) => {
        if(user.length !== 0)  {
            console.log(user[0].password)

            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
                throw new HttpException(401, "Incorrect account or password");
            }
            console.log(user)
            res.cookie("secureCookie", JSON.stringify(process.env.WATCHTOWER_SECRET + user[0].name), {
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                expires: dayjs().add(30, "days").toDate(),
            });
        }
        return res.send(user);
    })
    .catch((err) => {
        console.error(err);
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    });
});
  
// get users have the permission allowed_users
router.get('/users', isAllowedUser(), (req, res) => {
    knex('users')
    .select('name', 'allow_users', 'allow_graphql', 'allow_metadata', 'allow_migrations')
    .then((user) => {
        return res.send(user);
    })
    .catch((err) => {
        console.error(err);
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    });
});

// create new user
router.post('/user/create', isAllowedUser(), async (req, res) => {

    if (!req.body.name) {
        return res.json({success: false, message: 'Name is required'});
    }

    if (!req.body.password) {
        return res.json({success: false, message: 'Password is required'});
    }

    await hashPassword(req);

    const name = req.body.name ? req.body.name : '';
    const password = req.body.password ? req.body.password : '';
    const allow_users = req.body.allow_users ? req.body.allow_users : false;
    const allow_graphql = req.body.allow_graphql ? req.body.allow_graphql : false;
    const allow_metadata = req.body.allow_metadata ? req.body.allow_metadata : false;
    const allow_migrations = req.body.allow_migrations ? req.body.allow_migrations : false;

    knex('users')
      .insert({name, password, allow_users, allow_graphql, allow_metadata, allow_migrations})
      .then((id) => {
        //get user by id
        knex('users')
          .select({
            id: 'id',
            name: 'name'
          })
          .where({id})
          .then((user) => {
                console.log(user)
                return res.json({'200' : 'User Created'});
          })
      })
      .catch((err) => {
        console.error(err);
        return res.json({success: false, message: 'An error occurred, please try again later.'});
      });
  
})

// Get user By Id
router.get('/user/:id', isAllowedUser(), (req, res) => {
    knex('users')
    .select('name', 'allow_users', 'allow_graphql', 'allow_metadata', 'allow_migrations')
    .where({'id': req.params.id})
    .then((user) => {
        return res.send(user);
    })
    .catch((err) => {
        console.error(err);
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    });
});

// Put user by Id
router.put('/user/:id', isAllowedUser(), async (req, res) => {

    if (!req.body.name) {
        return res.json({success: false, message: 'Name is required'});
    }

    if (req.body.password) {
        await hashPassword(req);
    }

    const name = req.body.name ? req.body.name : '';
    const password = req.body.password ? req.body.password : '';
    const allow_users = req.body.allow_users ? req.body.allow_users : false;
    const allow_graphql = req.body.allow_graphql ? req.body.allow_graphql : false;
    const allow_metadata = req.body.allow_metadata ? req.body.allow_metadata : false;
    const allow_migrations = req.body.allow_migrations ? req.body.allow_migrations : false;

    if(password) {
        knex('users')
        .where({'id': req.params.id})
        .update({'name': name, 'password': password, 'allow_users': allow_users, 'allow_graphql': allow_graphql, 'allow_metadata': allow_metadata, 'allow_migrations': allow_migrations})
        .then((user) => {
            console.log(user);
            return res.json({success: true, message: '200: User Updated'});
        })
        .catch((err) => {
            console.error(err);
            return res.json({success: false, message: 'An error occurred, please try again later.'});
        });
    } else {
        knex('users')
        .where({'id': req.params.id})
        .update({'name': name, 'allow_users': allow_users, 'allow_graphql': allow_graphql, 'allow_metadata': allow_metadata, 'allow_migrations': allow_migrations})
        .then((user) => {
            console.log(user);
            return res.json({success: true, message: '200: User Updated'});
        })
        .catch((err) => {
            console.error(err);
            return res.json({success: false, message: 'An error occurred, please try again later.'});
        });
    }
});


// Delete user by Id
router.delete('/user/:id', isAllowedUser(), async (req, res) => {
    knex('users')
    .where({'id': req.params.id})
    .del()
    .then((user) => {
        console.log(user);
        return res.json({success: true, message: '200: User deleted'});
    })
    .catch((err) => {
        console.error(err);
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    });
});

const execute = async (URL, HASURA_OPERATION, reqHeaders) => {
    const fetchResponse = await fetch(
      URL,
      {
        method: 'POST',
        headers: reqHeaders || {},
        body: JSON.stringify({
          query: HASURA_OPERATION
        })
      }
    );
    return await fetchResponse.json();
};

//graphql
router.post('/graphql', isAllowedGrphql(), async (req, res) => {
    const HASURA_OPERATION = req.body.query;
    const { data } = await execute(`${process.env.HASURA_URL}/v1/graphql`, {}, HASURA_OPERATION, req.headers);
    res.json({ success: true, message: data});
})

//metadata

router.get('/metadata/get', isAllowedMetadata(), async (req, res) => {

    const reqBody = {
        "type": "export_metadata",
        "version": 2,
        "args": {}
    }
    const options = {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqBody)
    }

    const fetchResponse = await fetch(`${process.env.HASURA_URL}/v1/metadata`, options);
    const responseJson = await fetchResponse.json();
    
    const jsonObj = JSON.parse(JSON.stringify(responseJson));

    const username = req.headers.authorization;

    const date_ob = new Date();
    const day = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();      
    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
    const dateTime = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;


    fs.writeFileSync(`../project/metadata/${username}_${dateTime}__metadata_get.json`, JSON.stringify(jsonObj), 'utf8', function (err) {
        if (err) {
            return res.json({success: false, message: 'An error occurred, please try again later.'});
        }
    });
    res.json({success: true, message: 'successfully saved as json file'});
})

router.put('/metadata/set', isAllowedMetadata(), async (req, res) => {
    const reqExport = {
        "type": "export_metadata",
        "version": 2,
        "args": {}
    }
    const options = {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqExport)
    }

    const fetchResponse = await fetch(`${process.env.HASURA_URL}/v1/metadata`, options);
    const responseJson = await fetchResponse.json();

    const jsonObj = JSON.parse(JSON.stringify(responseJson));

    const username = req.headers.authorization;

    const date_ob = new Date();
    const day = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();      
    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
    const dateTime = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;

    fs.writeFileSync(`../project/metadata/${username}_${dateTime}__metadata_backup.json`, JSON.stringify(jsonObj), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return res.json({success: false, message: 'An error occurred, please try again later.'});
        }
    });


    const reqReplace = {
        "type" : "replace_metadata",
        "version": 2,
        "args": {
            "allow_inconsistent_metadata": true,
            "metadata": req.body.metadata
        }
    }

    const rep_options = {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqReplace)
    }

    const rep_fetchResponse = await fetch(`${process.env.HASURA_URL}/v1/metadata`, rep_options);
    const rep_responseJson = await rep_fetchResponse.json();

    const rep_jsonObj = JSON.parse(JSON.stringify(rep_responseJson));

    const rep_date_ob = new Date();
    const rep_day = ("0" + rep_date_ob.getDate()).slice(-2);
    const rep_month = ("0" + (rep_date_ob.getMonth() + 1)).slice(-2);
    const rep_year = rep_date_ob.getFullYear();      
    const rep_hours = rep_date_ob.getHours();
    const rep_minutes = rep_date_ob.getMinutes();
    const rep_seconds = rep_date_ob.getSeconds();
    const rep_dateTime = rep_year + "-" + rep_month + "-" + rep_day + "-" + rep_hours + "-" + rep_minutes + "-" + rep_seconds;

    fs.writeFileSync(`../project/metadata/${username}_${rep_dateTime}__metadata_set.json`, JSON.stringify(rep_jsonObj), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return res.json({success: false, message: 'An error occurred, please try again later.'});
        }
        
    });
    return res.json({success: true, message: 'successfully write and replaced as json files'});
})

router.get('/metadata/history', isAllowedMetadata(), async (req, res) => {
    let fileLists = [];
    let jsonLists = [];
    fileLists = fs.readdirSync('../project/metadata');
    fileLists.forEach(filename => {
        const ext = filename.split('.').pop();
        if (ext === 'json') {
            jsonLists.push(filename)
        }
    });

    let responseValue = [];

    jsonLists.forEach(jsonfile => {
        let username = jsonfile.split('_')[0];
        let datetime = jsonfile.split('_')[1];
        let filename = jsonfile;

        let jsonObj = {
            User: username,
            Datetime: datetime,
            Filename: filename
        }
        responseValue.push(jsonObj)
    });

    res.json({success: true, message: 'successfully got json files', value: responseValue});

})
router.get('/metadata/history/:filename', isAllowedMetadata(), async (req, res) => {
    const filename = req.params.filename + '.json';
    let fileLists = [];
    fileLists = fs.readdirSync('../project/metadata');
    if (!fileLists.includes(filename)) {
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    }

    let rawdata = fs.readFileSync(`../project/metadata/${filename}`);
    let resVal = JSON.parse(rawdata);
    return res.json({success: false, message: 'successfully get the contnet of the json file.', value: resVal});
})


//migrations
router.post('/migration/set', isAllowedMigrations(), async (req, res) => {

    const source = req.headers.source ? req.headers.source : 'default';
    const reqBody = {
        "type": "run_sql",
        "args": {
            "source": source,
            "sql": req.body.sql
        }
    }
    const options = {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqBody)
    }

    const fetchResponse = await fetch(`${process.env.HASURA_URL}/v2/query`, options);
    const status = fetchResponse.status;
    const responseJson = await fetchResponse.json();

    const jsonObj = JSON.parse(JSON.stringify(responseJson));

    const username = req.headers.authorization;

    const date_ob = new Date();
    const day = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();      
    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
    const dateTime = year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds;
    if (status == 200) {
        fs.writeFileSync(`../project/migration/${username}_${dateTime}__${source}_sucess.json`, JSON.stringify(jsonObj), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return res.json({success: false, message: 'An error occurred, please try again later.'});
            }
            return res.json({success: true, message: 'successfully saved as json file'});
        });
    } else {
        fs.writeFileSync(`../project/failure/${username}_${dateTime}__${source}_sucess.json`, JSON.stringify(jsonObj), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return res.json({success: false, message: 'An error occurred, please try again later.'});
            }
            return res.json({success: true, message: 'successfully saved as json file'});
        });
    }
})

router.get('/migration/history', isAllowedMigrations(), async (req, res) => {
    let fileLists = [];
    let jsonLists = [];
    fileLists = fs.readdirSync('../project/migration');
    fileLists.forEach(filename => {
        const ext = filename.split('.').pop();
        if (ext === 'json') {
            jsonLists.push(filename)
        }
    });

    let responseValue = [];

    jsonLists.forEach(jsonfile => {
        let username = jsonfile.split('_')[0];
        let datetime = jsonfile.split('_')[1];
        let source = jsonfile.split('_')[2];
        let state = jsonfile.split('_')[3];
        let filename = jsonfile;

        let jsonObj = {
            User: username,
            Datetime: datetime,
            Source: source,
            State: state,
            Filename: filename
        }
        responseValue.push(jsonObj)
    });

    res.json({success: true, message: 'successfully got json files', value: responseValue});
});


router.get('/migration/history/:filename', isAllowedMigrations(), async (req, res) => {
    const filename = req.params.filename + '.json';
    let fileLists = [];
    fileLists = fs.readdirSync('../project/migration');
    if (!fileLists.includes(filename)) {
        return res.json({success: false, message: 'An error occurred, please try again later.'});
    }

    let rawdata = fs.readFileSync('../project/metadata/${filename}');
    let resVal = JSON.parse(rawdata);
    res.json({success: false, message: 'successfully get the contnet of the json file.', value: resVal});
})

module.exports = router;