'use strict';

const express = require('express');

const createRoutes = (handlers) => {
  const router = express.Router();

  // User routes
  router.get('/user', handlers.listUserHandler);
  router.post('/user', handlers.createUserHandler);
  router.put('/user/:user_id', handlers.updateUserHandler);
  router.delete('/user', handlers.deleteUserHandler);

  // Post routes
  router.get('/post', handlers.listPostHandler);
  router.post('/post', handlers.createPostHandler);
  router.put('/post', handlers.updatePostHandler);
  router.delete('/post', handlers.deletePostHandler);

  return router;
};

module.exports = createRoutes;

