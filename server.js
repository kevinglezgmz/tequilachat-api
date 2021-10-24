/** Getting enviroment variables */
const dotenv = require('dotenv');
const config = dotenv.config();
/** Express */
const express = require('express');
/** Swagger jsdoc and swagger ui */
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
/** MongoClient to connect to the database and set the singleton instance */
const MongoClient = require('mongodb').MongoClient;
const Database = require('./src/models/database');

/** Constants and env variables */
const PORT = process.env.PORT || 3000;

/** Express and routers */
const app = express();
const mainRouter = require('./src/routes/index');

/** Swagger configuration */
const swaggerOptions = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'Tequilachat',
      description: 'Tequilachat api documentation',
      version: '1.0.0',
      servers: ['http://localhost:' + PORT],
    },
  },
  apis: ['./server.js', './src/routes/users.js', './src/routes/sessions.js', './src/routes/chatRooms.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/** Additional express middlewares */
app.use(express.json());

/** Use of routers */
app.use('/api', mainRouter);

/** Start application only if we can connect to the database */
MongoClient.connect(
  process.env.DB_URL,
  {
    useUnifiedTopology: true,
  },
  function (err, client) {
    if (err) {
      console.log('Failed to connect to MongoDB');
    } else {
      console.log('Succesfully connected to MongoDB');
      database = client.db();
      Database.setDatabase(database);

      app.listen(PORT, () => {
        console.log('Server listening on port:', PORT, 'http://localhost:' + PORT);
      });
    }
  }
);
