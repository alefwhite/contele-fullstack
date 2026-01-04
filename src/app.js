'use strict';
require('dotenv').config();

const cors = require('cors');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-ui-express');
const express = require('express');
const { buildHandlers } = require('./modules');
const { handlers } = buildHandlers();
const createRoutes = require('./routes');
const port = Number(process.env.PORT || 8089)

const app = express();

// Middleware para parsear JSON e URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = [
  'http://localhost:8080',
  'http://localhost:8081',
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = whitelist.indexOf(origin) !== -1

    if (allowed) return callback(null, true);

    callback(new Error('Not allowed by CORS'))
  }
}))

const swaggerConfig = {
  appRoot: __dirname,
  swaggerFile: `${__dirname}/config/swagger.yaml`,
};

const onSwaggerCreated = (error, swaggerExpress) => {
  if (error) throw error;

  const swaggerDocument = swaggerExpress.runner.swagger;
  app.use('/api/v1/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

  //  rotas manualmente
  const routes = createRoutes(handlers);
  app.use('/api/v1', routes);

  app.listen(port, () => console.info('onAppStart', { port }));
};

SwaggerExpress.create(swaggerConfig, onSwaggerCreated);

module.exports = {
  app,
  ...handlers
};
