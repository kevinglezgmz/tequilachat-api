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

/** ROUTES TO LOGIN WITH GOOGLE (VALIDATION AND SESSION STORAGE STILL REQUIRED) */
const passport = require('passport');

/**
 * @swagger
 *   /api/sessions/login/google/failed:
 *     get:
 *       tags:
 *         - Sessions - Google
 *       description: Endpoint to log in with a Google account (VALIDATIONS STILL REQUIRED)
 *       responses:
 *         400:
 *           description: Failed to login with Google
 */
router.get('/login/google/failed', (req, res) => {
  res.status(400).send({ err: 'Failed to login with google' });
});

/**
 * @swagger
 *   /api/sessions/login/google:
 *     get:
 *       tags:
 *         - Sessions - Google
 *       description: Endpoint to log in with a Google account (VALIDATIONS STILL REQUIRED)
 *       responses:
 *         403:
 *           description: Redirected to Google's authentication website
 */
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

/**
 * @swagger
 *   /api/sessions/login/google/callback:
 *     get:
 *       tags:
 *         - Sessions - Google
 *       description: Callback sent by Google's authentication site (VALIDATIONS STILL REQUIRED)
 *       responses:
 *         403:
 *           description: Succesfuly logged in and redirected to a success route
 */
router.get(
  '/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/sessions/login/google/failed',
  }),
  function (req, res) {
    res.redirect('/api/sessions/login/google/success');
  }
);

/**
 * @swagger
 *   /api/sessions/login/google/success:
 *     get:
 *       tags:
 *         - Sessions - Google
 *       description: Endpoint for user authenticated users (VALIDATIONS STILL REQUIRED)
 *       responses:
 *         200:
 *           description: User is logged in and the user email is sent
 *         400:
 *           description: User is not logged in and an error is sent
 */
router.get('/login/google/success', (req, res) => {
  if (req.user) {
    res.send({ msg: `Currently signed in as ${req.user.email}` });
  } else {
    res.status(400).send({ msg: 'Log in with your Google account first' });
  }
});

/**
 * @swagger
 *   /api/sessions/login/google/success:
 *     get:
 *       tags:
 *         - Sessions - Google
 *       description: Endpoint for user authenticated users (VALIDATIONS STILL REQUIRED)
 *       responses:
 *         200:
 *           description: User logged out successfuly
 */
router.get('/logout/google', (req, res) => {
  req.session = null;
  req.logout();
  res.send({ msg: 'Successfuly logged out of your Google account' });
});

module.exports = router;
