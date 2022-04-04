const express = require('express');

// Init App and Database
var app = express();

// Setup User Store
const sqlite = require('knex')({
  client: 'better-sqlite3',
  connection: {
    filename: "/mnt/c/users/mmark/documents/github/hasurakit/console/api/database.db"
  }, useNullAsDefault: true
});
sqlite.schema.hasTable('user').then(function (exists) {
  if(!exists){
    return sqlite.schema.createTable('user', function (table) {
      table.increments();
      table.string('username');
      table.string('salt');
      table.string('hash');
      table.string('attribute');
      table.string('role');
      table.timestamps();
    }).then(console.log("User table created..."));  
  }
});

// Auth Routes
app.get("*", (req, res) => {
  res.send("Hello World...")
});

app.get("/login", (req, res) => {
  res.send("Login...")
});

app.get("/register", (req, res) => {
  res.send("Register...")
});

app.post("/login", (req, res) => {
  res.send("Login...")
});

app.post("/register", (req, res) => {
  res.send("Register...")
});

app.post("/logout", (req, res) => {
  res.send("Logout...")
});

app.get("/protected", (req, res) => {
  res.send("Protected Route...")
});


app.listen(5000, (req, res) => {
  console.log("Listening on port 5000")
});