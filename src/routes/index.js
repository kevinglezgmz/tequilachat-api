const indexRouter = require('express').Router();

const userRoutes = require('./users');
const sessionsRoutes = require('./sessions');
const chatRoomsRoutes = require('./chatRooms');

indexRouter.use('/users', userRoutes);
indexRouter.use('/sessions', sessionsRoutes);
indexRouter.use('/chatrooms', chatRoomsRoutes);

module.exports = indexRouter;
