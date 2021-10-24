const router = require('express').Router();
const usersController = require('../controllers/users.controller');

/**
 * @swagger
 *   /api/users/:
 *     get:
 *       tags:
 *       - Users
 *       description: Endpoint to get the info of all current users (for now this endpoint is open but will require a special access token to see the users)
 *       responses:
 *         200:
 *           description: Success response with the data of the users
 *         400:
 *           description: No users were found
 *         500:
 *           description: An un expected error ocurred
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 *   /api/users/{userId}:
 *     get:
 *       tags:
 *       - Users
 *       description: Endpoint to get the user's details of an authenticated users
 *       produces:
 *       - application/json
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           schema:
 *             type: string
 *           description: The bearer's token
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The user's unique id
 *       responses:
 *         200:
 *           description: Success response with the data of the specified user if it is authorized
 *         401:
 *           description: Not authorized to see the contents of the user
 *         500:
 *           description: An un expected error ocurred while retrieving the user's details
 */
router.get('/:userId', usersController.getUserById);

/**
 * @swagger
 *   /api/users/:
 *     post:
 *       tags:
 *         - Users
 *       description: Endpoint to register a new user
 *       parameters:
 *         - in: body
 *           name: userDetails
 *           type: object
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password1
 *               - password2
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password1:
 *                 type: string
 *               password2:
 *                 type: string
 *       responses:
 *         201:
 *           description: Success response with the new user's confirmation (subject to change for 200 and "If the email is not registered, the account was created successfuly")
 *         500:
 *           description: An un expected error ocurred while trying to create the user
 */
router.post('/', usersController.createUser);

module.exports = router;
