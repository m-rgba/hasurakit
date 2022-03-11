const HttpException = require('../utils/HttpException');
const dotenv = require("dotenv");
const knexConfig = require('../db/knexfile');
dotenv.config();
//initialize knex
const knex = require('knex')(knexConfig[process.env.NODE_ENV])
// middleware
const isAllowedUser = () => {
  return function (req, res, next) {
    try {
      const name = req.headers.authorization ? req.headers.authorization : '';
      
      knex('users')
      .select()
      .where({name})
      .then( (user) => {
          if(user.length !== 0)  {
            console.log(user)
            if (!user[0].allow_users ) {
                throw new HttpException(401, "Access denied. No allowed user!");
            }
            next();
          } else {
            throw new HttpException(401, "User is not allowed");
          }
      })
      .catch((e) => {
          e.status = 401;
          next(e);
      });
      
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
}; 

const isAllowedGrphql = () => {
  return function (req, res, next) {
    try {
      const name = req.headers.authorization ? req.headers.authorization : '';
      
      knex('users')
      .select()
      .where({name})
      .then( (user) => {
          if(user.length !== 0)  {
            console.log(user)
            if (!user[0].allow_graphql ) {
                throw new HttpException(401, "Access denied. No allowed user!");
            }
            res.setHeader('x-hasura-admin-secret', `${process.env.HASURA_ADMIN_SECRET}`);
            next();
          } else {
            throw new HttpException(401, "User is not allowed");
          }
      })
      .catch((e) => {
          e.status = 401;
          next(e);
      });
      
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};


const isAllowedMetadata = () => {
  return function (req, res, next) {
    try {
      const name = req.headers.authorization ? req.headers.authorization : '';
      
      knex('users')
      .select()
      .where({name})
      .then( (user) => {
          if(user.length !== 0)  {
            console.log(user)
            if (!user[0].allow_metadata ) {
                throw new HttpException(401, "Access denied. No allowed user!");
            }
            res.setHeader('x-hasura-admin-secret', `${process.env.HASURA_ADMIN_SECRET}`);
            res.setHeader('x-hasura-role', 'admin');
            next();
          } else {
            throw new HttpException(401, "User is not allowed");
          }
      })
      .catch((e) => {
          e.status = 401;
          next(e);
      });
      
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};


const isAllowedMigrations = () => {
  return function (req, res, next) {
    try {
      const name = req.headers.authorization ? req.headers.authorization : '';
      
      knex('users')
      .select()
      .where({name})
      .then( (user) => {
          if(user.length !== 0)  {
            console.log(user)
            if (!user[0].allow_migrations ) {
                throw new HttpException(401, "Access denied. No allowed user!");
            }
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('x-hasura-admin-secret', `${process.env.HASURA_ADMIN_SECRET}`);
            res.setHeader('x-hasura-role', 'admin');
            next();
          } else {
            throw new HttpException(401, "User is not allowed");
          }
      })
      .catch((e) => {
          e.status = 401;
          next(e);
      });
      
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

module.exports = {isAllowedUser, isAllowedGrphql, isAllowedMetadata, isAllowedMigrations};