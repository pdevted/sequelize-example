const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

app.post('/post', (req, res) => {
  const newUser = req.body.user;
  User.create({
    name: newUser.name,
    email: newUser.email
  })
  .then(user => {
    res.json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
})

app.get('/findall', (req, res) => {
  User.findAll({
    where: {
      name: {
        [Op.like]: 'a%'
      }
    }
  })
  .then(user => {
    res.json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
})

app.get('/findOne', (req, res) => {
  User.findByPk('55')
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

app.put('/update', (req, res) => {
  User.update({
    name: 'ted Kim', password: 'password'
  }, { where: { id: 55 } })
    .then(rows => {
      res.json(rows);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(error);
    })
})

app.delete('/remove', (req, res) => {
  User.destroy({
    where: { id: 50 }
  })
  .then(() => {
    res.send('User successfully deleted');
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
})

connection
  .sync({
    // logging: console.log,
    // force: true
  })
  // .then (() => {
  //   User.bulkCreate(_USERS)
  //     .then(users => {
  //       console.log('Success adding users');
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })
  // })
  .then(() => {
    console.log('Connection to database established successfully');
  })
  .catch(err => {
    console.error(err);
  })

app.listen(port, () => {
  console.log('Running server on port ' + port);
})
