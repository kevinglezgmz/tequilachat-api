const router = require('express').Router();
const chatRoomsController = require('../controllers/chatRooms.controller');
const authentication = require('../middlewares/authentication');

router.use(authentication);

/**
 * @swagger
 *   /api/chatrooms/:
 *     get:
 *       tags:
 *         - ChatRooms
 *       description: Gets all the chatrooms in the database
 *       responses:
 *         200:
 *           description: Chatrooms that have been created in the database
 *         400:
 *           description: Bad request, no chatrooms have been created
 *         500:
 *           description: An un expected error ocurred while trying to list the chatrooms
 */
router.get('/', chatRoomsController.getAllChatRooms);

/**
 * @swagger
 *   /api/chatrooms/:
 *     post:
 *       tags:
 *         - ChatRooms
 *       description: Create a new chatroom
 *       parameters:
 *         - in: header
 *           name: Authentication
 *           type: string
 *           required:
 *             - Authentication
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
router.post('/', chatRoomsController.createNewChatRoom);

/**
 * @swagger
 *   /api/chatrooms/invite/{inviteId}:
 *     get:
 *       tags:
 *         - ChatRooms
 *       description: Joins the user to the specified chatroom
 *       parameters:
 *         - in: header
 *           name: Authentication
 *           type: string
 *           required:
 *             - Authentication
 *       responses:
 *         200:
 *           description: Succesfuly joined to the chatroom associated with that invite link
 *         400:
 *           description: Bad request, the link does not exist or user is already in the chatroom
 *         500:
 *           description: An un expected error ocurred while trying to find the specified chatroom
 */
router.get('/invite/:inviteId', chatRoomsController.joinRoomWithInviteLink);

module.exports = router;
