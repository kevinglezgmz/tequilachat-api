const indexRouter = require('express').Router();

const userRoutes = require('./users');

indexRouter.use('/users', userRoutes);

module.exports = indexRouter;
