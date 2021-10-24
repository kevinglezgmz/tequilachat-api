const indexRouter = require('express').Router();

const userRoutes = require('./users');
const sessionsRoutes = require('./sessions');

indexRouter.use('/users', userRoutes);
indexRouter.use('/sessions', sessionsRoutes);

module.exports = indexRouter;
