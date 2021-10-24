const { getObjectId } = require('./utils');
const Database = require('../models/database');
const bcrypt = require('bcrypt');

/**
 * @typedef { import('./dataTypes').User } User
 */

class UsersController {
  static getAllUsers(req, res) {
    const usersDb = new Database('Users');
    usersDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results === null) {
          res.status(500).send({ msg: 'An unexpected error ocurred, try again' });
        } else if (results.length === 0) {
          res.status(400).send({ msg: 'No users found!' });
        } else {
          res.status(200).send({ data: results });
        }
      });
  }

  static getUserById(req, res) {
    // Verify user is authenticated
    const usersDb = new Database('Users');
    const userId = getObjectId(req.params.userId);
    usersDb
      .findOne({ _id: userId }, {})
      .then((result) => {
        if (result) {
          delete result.password;
          res.status(200).send({ data: result });
        } else {
          res.status(500).send({ msg: 'An unexpected error ocurred, please try again' });
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: 'An unexpected error ocurred, please try again' });
      });
  }

  static createUser(req, res) {
    const usersDb = new Database('Users');
    /** @type { User } */
    const userData = req.body;
    if (userData.password1 === userData.password2) {
      userData.password = userData.password1;
      delete userData.password1;
      delete userData.password2;
    }
    let hash = bcrypt.hashSync(userData.password, 10);
    userData.password = hash;
    usersDb
      .insertOne(userData)
      .then((result) => {
        // This should be changed to "If the email is not registered, the account was created successfuly"
        res.status(201).send({ status: result });
      })
      .catch((err) => {
        res.status(500).send({ msg: 'An unexpected error ocurred, please try again' });
      });
  }
}

module.exports = UsersController;
