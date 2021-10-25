const router = require('express').Router();
const ChatRoomsController = require('../controllers/chatRooms.controller');
const MessagesController = require('../controllers/messages.controller');
const authentication = require('../middlewares/authentication');

router.use(authentication);

/**
 * @swagger
 *   /api/chatrooms/:
 *     get:
 *       tags:
 *         - ChatRooms
 *       description: Gets all the chatrooms in the database. For security reasons you need to login first before having access to all the rooms.
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *           required:
 *             - Authorization
 *       responses:
 *         200:
 *           description: Chatrooms that have been created in the database
 *         400:
 *           description: Bad request, no chatrooms have been created
 *         500:
 *           description: An un expected error ocurred while trying to list the chatrooms
 */
router.get('/', ChatRoomsController.getAllChatRooms);

/**
 * @swagger
 *   /api/chatrooms/:
 *     post:
 *       tags:
 *         - ChatRooms
 *       description: Create a new chatroom
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *           required:
 *             - Authorization
 *         - in: body
 *           name: roomDetails
 *           type: object
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *               - description
 *             properties:
 *               roomName:
 *                 type: string
 *               description:
 *                 type: string
 *           required:
 *             - roomDetails
 *       responses:
 *         201:
 *           description: The room was created succesfuly
 *         400:
 *           description: Bad request, missing room name, description or the user has already created a chatroom with that name
 *         500:
 *           description: An un expected error ocurred while trying to create the chatroom
 */
router.post('/', ChatRoomsController.createNewChatRoom);

/**
 * @swagger
 *   /api/chatrooms/invite/{inviteId}:
 *     get:
 *       tags:
 *         - ChatRooms
 *       description: Joins the user to the specified chatroom
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *           required:
 *             - Authorization
 *       responses:
 *         200:
 *           description: Succesfuly joined to the chatroom associated with that invite link
 *         400:
 *           description: Bad request, the link does not exist or user is already in the chatroom
 *         500:
 *           description: An un expected error ocurred while trying to find the specified chatroom
 */
router.get('/invite/:inviteId', ChatRoomsController.joinRoomWithInviteLink);

/** Messages Routes */
/**
 * @swagger
 *   /api/chatrooms/{roomId}/messages:
 *     get:
 *       tags:
 *         - ChatRooms - Messages
 *       description: Gets all the messages in a chatroom that the user is currently in
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *           required:
 *             - Authorization
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The room that you want the messages from
 *       responses:
 *         200:
 *           description: Messages in the specified room
 *         400:
 *           description: Bad request, no messages on that room
 *         403:
 *           description: Unauthorized, you dont have access to see the messages in that room
 *         500:
 *           description: An un expected error ocurred while trying to find messages in the specified chat room
 */
router.get('/:roomId/messages', MessagesController.getAllMessagesInChatRoom);

/**
 * @swagger
 *   /api/chatrooms/{roomId}/messages:
 *     post:
 *       tags:
 *         - ChatRooms - Messages
 *       description: Creates a new message in the specified chatroom if user is currently in the chatroom
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *           required:
 *             - Authorization
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: string
 *           description: The room that you want to send a message to
 *         - in: body
 *           name: message
 *           type: object
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *           required:
 *             - message
 *       responses:
 *         201:
 *           description: The message was created succesfuly
 *         400:
 *           description: Bad request, no message content specified
 *         403:
 *           description: Unauthorized, you cant send messages in that room
 *         500:
 *           description: An un expected error ocurred while trying to create the message in the specified chatroom
 */
router.post('/:roomId/messages', MessagesController.createNewMessageInChatRoom);

module.exports = router;
