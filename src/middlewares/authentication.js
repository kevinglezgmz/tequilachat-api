const jwt = require('jsonwebtoken');
const Database = require('../models/database');
const { getObjectId } = require('../controllers/utils');
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

function authentication(req, res, next) {
  const authHeader = req.get('Authorization');
  const authHeaderToken = authHeader ? authHeader.split(' ')[1] : undefined;
  if (!authHeaderToken) {
    res.status(401).send({ message: 'Not authorized' });
    return;
  }
  let token = jwt.verify(authHeaderToken, SECRET_JWT);
  const sessionsDb = new Database('Sessions');
  sessionsDb
    .findOne({ userId: getObjectId(token._id) }, {})
    .then((session) => {
      if (!session || session.token !== authHeaderToken) {
        res.status(401).send({ message: 'Not authorized' });
        return;
      }
      req.userId = token._id;
      next();
    })
    .catch(({ statusCode, msg }) => {
      res.status(statusCode).send({ msg });
    });
}

module.exports = authentication;
