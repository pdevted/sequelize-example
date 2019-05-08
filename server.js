const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false,
  define: {
    freezeTableName: true
  }
})

const User = connection.define('User', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      len: [3]
    }
  },
  first: Sequelize.STRING,
  last: Sequelize.STRING,
  full_name: Sequelize.STRING,
  bio: {
    type: Sequelize.TEXT,
    validate: {
      contains: {
        args: ['foo'],
        msg: 'Error: Field must contain foo'
      }
    }
  }
}, {
  timestamps: false,
  hooks: {
    beforeValidate: () => {
      console.log('before validate');
    },
    afterValidate: () => {
      console.log('after validate');
    },
    beforeCreate: (user) => {
      user.full_name = `${user.first} ${user.last}`;
      console.log('before create');
    },
    afterCreate: () => {
      console.log('after create');
    }
  }
})

app.get('/', (req, res) => {
  User.create({
    name: 'Jo',
    bio: 'New bio entry 2'
  })
  .then(user => {
    res.json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(404).send(error);
  })
})

connection
  .sync( {
    logging: console.log,
    force: true
  })
  .then (() => {
    User.create({
      first: 'Joe',
      last: 'Smith',
      bio: 'New bio here'
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
