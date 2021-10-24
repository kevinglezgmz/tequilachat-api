const router = require('express').Router();
const sessionsController = require('../controllers/sessions.controller');

const authentication = require('../middlewares/authentication');

/**
 * @swagger
 *   /api/sessions/login:
 *     post:
 *       tags:
 *         - Sessions
 *       description: Endpoint to log in an user
 *       parameters:
 *         - in: body
 *           name: messageBody
 *           type: object
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *       responses:
 *         200:
 *           description: Success response with the bearer's token for authentication
 *         400:
 *           description: No user account was found with that email and password combination
 *         500:
 *           description: An un expected error ocurred while trying to login the user in
 */
router.post('/login', sessionsController.loginUser);

/**
 * @swagger
 *   /api/sessions/logout:
 *     get:
 *       tags:
 *         - Sessions
 *       description: Endpoint to log out an user
 *       responses:
 *         200:
 *           description: Successfuly logged out the user
 *         400:
 *           description: You can not log out if you are not logged in
 *         500:
 *           description: An un expected error ocurred while trying to log out the user
 */
router.get('/logout', authentication, sessionsController.logoutUser);
module.exports = router;
