const Database = require('../models/database.js');
const { getObjectId } = require('./utils.js');

/**
 * @typedef { import('./dataTypes').ChatHistory } ChatHistory
 */

class MessagesController {
  static getAllMessagesInChatRoom(req, res) {
    const chatsDb = new Database('ChatRoomsMessages');
    const chatRoomsUsersDb = new Database('ChatRoomsUsers');
    chatRoomsUsersDb
      .findOne({ userId: getObjectId(req.userId), roomId: getObjectId(req.params.roomId) }, {})
      .then((result) => {
        if (!result) {
          res.status(403).send({ msg: 'You can not see the messages in this room because you are not in it' });
          return;
        }
        chatsDb
          .find({ roomId: getObjectId(req.params.roomId) }, {})
          .toArray()
          .then((results) => {
            if (results.length === 0) {
              res.status(400).send({ msg: 'There are no messages in this chatroom yet' });
            } else {
              res.status(200).send({ data: results });
            }
          })
          .catch((err) => {
            res.status(500).send({ err });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(403).send({ msg: 'You can not see the messages in this room because you are not in it' });
      });
  }

  static createNewMessageInChatRoom(req, res) {
    const chatsDb = new Database('ChatRoomsMessages');
    const chatRoomsUsersDb = new Database('ChatRoomsUsers');
    chatRoomsUsersDb
      .findOne({ userId: getObjectId(req.userId), roomId: getObjectId(req.params.roomId) }, {})
      .then((result) => {
        if (!result) {
          res.status(403).send({ msg: 'You can not send messages to this room because you are not in it' });
          return;
        }
        chatsDb
          .insertOne({
            message: req.body.message,
            userId: getObjectId(req.userId),
            roomId: getObjectId(req.params.roomId),
            sentAt: new Date(),
          })
          .then((status) => {
            res.status(201).send({ status });
          })
          .catch((err) => {
            res.status(500).send({ msg: 'Error trying to send the message, please try again' });
          });
      })
      .catch((err) => {
        res.status(403).send({ msg: 'You can not send messages to this chatroom' });
      });
  }
}

module.exports = MessagesController;
