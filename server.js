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

const Post = connection.define('Post', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT
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

app.get('/allposts', (req, res) => {
  Post.findAll({
    include: [{
      model: User, as: 'UserRef'
    }]
  })
  .then(posts => {
    res.json(posts);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
})

Post.belongsTo(User, { as: 'UserRef', foreignKey: 'userId' }); // puts freignKey userId in Post table

connection
  .sync({
    // logging: console.log,
    force: true
  })
  .then(() => {
    User.bulkCreate(_USERS)
      .then(users => {
        console.log('Success adding users');
      })
      .catch(error => {
        console.log(error);
      })
  })
  .then (() => {
    Post.create({
      userId: 1,
      title: 'First post',
      content: 'post content 1'  
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
