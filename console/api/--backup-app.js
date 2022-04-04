const sqlite = require("better-sqlite3");
const SqliteStore = require("better-sqlite3-session-store")(session);
var crypto = require('crypto');
const express = require('express');
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Init App and Database
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Setup Session Store
const db = new sqlite("/home/node/api/store/localUsers.db", { verbose: console.log });
app.use(
  session({
    store: new SqliteStore({
      client: db, 
      expired: {
        clear: true,
        intervalMs: 900000
      }
    }),
    secret: "supersecurepassphrase",
    resave: false,
  })
)

// Setup User Store
var createTableUser = `
  CREATE TABLE IF NOT EXISTS user(
    'id' INTEGER AUTOINCREMENT PRIMARY KEY, 
    'username' VARCHAR UNIQUE, 
    'salt' VARCHAR, 
    'hash' VARCHAR, 
    'attribute' VARCHAR,
    'role' VARCHAR,
    'created_on' DATE DEFAULT
  );
`
try { 
  db.exec(createTableUser) 
} catch (err) { 
  console.error(err) 
};

// Auth
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return {
    salt: salt,
    hash: genHash
  };
}
function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

// Passport Settings
passport.use(new LocalStrategy(function(username, password, cb) {
  const user = db.prepare('SELECT * FROM user WHERE username = ?').get(username);
  if (user){ 
    const isValid = validPassword(password, user.hash, user.salt);
    if (isValid) {
      // User found
      return cb(null, user);
    } else {
      // User not found
      console.error('Username or password is incorrect...');
      return cb(null, false);
    }
  } else {
    // No user found
    console.error('Username or password is incorrect...');
    return cb(null, false) 
  }
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  const user = db.prepare('SELECT * FROM user WHERE id = ?').get(id);
  if (user){ 
    return cb(null, user);
  } else {
    return cb('Error loading user...')
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Auth
app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }), (err, req, res, next) => {
  if (err) next(err);
});

app.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt
  });
  newUser.save()
      .then((user) => {
          console.log(user);
      });

  res.redirect('/login');
});

app.get('/logout', (req, res, next) => {
  req.logout();
});

// Start Server
app.listen(3000);