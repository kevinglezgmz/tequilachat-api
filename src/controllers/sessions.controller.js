const { getObjectId } = require('./utils');
const Database = require('../models/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

class SessionsController {
  static loginUser(req, res) {
    const usersDb = new Database('Users');
    const sessionsDb = new Database('Sessions');
    if (!req.body.email && !req.body.password) {
      res.status(400).send({ msg: 'Missing email or password' });
      return;
    }
    usersDb
      .findOne({ email: req.body.email })
      .then((user) => {
        return new Promise((success, reject) => {
          if (user === null) {
            reject({ statusCode: 400, msg: 'Could not find an user with that email and password combination' });
          }
          if (!user.email || !bcrypt.compareSync(req.body.password, user.password)) {
            reject({ statusCode: 400, msg: 'Could not find an user with that email and password combination' });
          }
          const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, SECRET_JWT);
          success({ user, token });
        });
      })
      .then(({ user, token }) => {
        return new Promise((success, reject) => {
          sessionsDb
            .insertOrUpdateOne(
              { userId: user._id },
              {
                $set: {
                  token,
                  userId: user._id,
                  lastLogin: new Date(),
                },
              },
              { upsert: true }
            )
            .then((status) => {
              status.acknowledged
                ? success({ statusInsert: status, token })
                : reject({ statusCode: 500, msg: 'An unexpected error ocurred, please try again' });
            });
        });
      })
      .then(({ statusInsert, token }) => {
        res.status(200).send({ statusInsert, token });
      })
      .catch(({ statusCode, msg }) => {
        res.status(statusCode).send({ msg });
      });
  }

  static logoutUser(req, res) {
    const sessionsDb = new Database('Sessions');
    sessionsDb
      .deleteOne({ userId: getObjectId(req.userId) })
      .then((result) => {
        res.send({ msg: 'Logged out successfuly' });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

module.exports = SessionsController;
