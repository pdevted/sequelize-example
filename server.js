const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');

const app = express();
const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false
})

const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true
    }
  }
})

connection
  .sync({
    // logging: console.log,
    force: true
  })
  .then (() => {
    User.bulkCreate(_USERS)
      .then(users => {
        console.log('Success adding users');
      })
      .catch(error => {
        console.log(error);
      })
  })
  .then(() => {
    console.log('Connection to database established successfully');
  })
  .catch(err => {
    console.error(err);
  })

app.listen(port, () => {
  console.log('Running server on port ' + port);
})
