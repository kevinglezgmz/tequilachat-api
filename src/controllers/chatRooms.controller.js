const Database = require('../models/database.js');
const { getObjectId, getRoomInviteLink } = require('./utils.js');

/**
 * @typedef { import('./dataTypes').ChatHistory } ChatHistory
 */

class ChatRoomsController {
  static getAllChatRooms(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    chatRoomsDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'The are no chatrooms in the database yet' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: 'An unexpected error ocurred, please try again' });
      });
  }

  static getAllUserChatRooms(req, res) {
    const chatRoomsUsersDb = new Database('ChatRoomsUsers');
    chatRoomsUsersDb
      .find({ userId: getObjectId(req.userId) }, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'The user has not joined or created any chatrooms yet' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: 'An unexpected error ocurred, please try again' });
      });
  }

  static createNewChatRoom(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    const { roomName, description } = req.body;
    if (!roomName || !description) {
      res.status(400).send({ msg: 'Please set both a room name and a description' });
      return;
    }
    const inviteId = getRoomInviteLink(req.userId, roomName);
    chatRoomsDb
      .insertOne({
        roomName,
        description,
        userId: getObjectId(req.userId),
        createdAt: new Date(),
        inviteLink: req.protocol + '://' + req.get('host') + '/api/chatrooms/invite/' + inviteId,
        inviteId,
      })
      .then((status) => {
        if (status.acknowledged) {
          const chatRoomsUsersDb = new Database('ChatRoomsUsers');
          chatRoomsUsersDb
            .insertOne({ roomId: getObjectId(status.insertedId), userId: getObjectId(req.userId), joinedAt: new Date() })
            .then((insertedChatRoomAndUser) => {
              res.status(201).send({ msg: 'Room ' + roomName + ' created successfuly' });
            })
            .catch((err) => {
              chatRoomsDb
                .deleteOne({ roomName, description, userId: getObjectId(req.userId) })
                .then((deletedStatus) => {
                  res.status(500).send({ msg: 'An un expected error ocurred, please try again' });
                })
                .catch((err) => {
                  res.status(500).send({ msg: 'An un expected error ocurred, please try again' });
                });
            });
        }
      })
      .catch((err) => {
        res.status(400).send({ msg: 'You have already created a room with the name: ' + roomName });
      });
  }

  static joinRoomWithInviteLink(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    const chatRoomsUsersDb = new Database('ChatRoomsUsers');
    chatRoomsDb
      .findOne({ inviteId: req.params.inviteId })
      .then((result) => {
        if (!result) {
          res.status(400).send({ msg: 'This invite link does not exist' });
          return;
        }
        chatRoomsUsersDb
          .insertOne({ roomId: getObjectId(result._id), userId: getObjectId(req.userId), joinedAt: new Date() })
          .then((insertedChatRoomAndUser) => {
            res.status(200).send({ msg: 'Joined the room ' + result.roomName + ' successfuly' });
          })
          .catch((err) => {
            res.status(400).send({ msg: 'You have already joined this chat room!' });
          });
      })
      .catch((err) => {
        res.status(500).send({ msg: 'An un expected error ocurred, please try again' });
      });
  }
}

module.exports = ChatRoomsController;
