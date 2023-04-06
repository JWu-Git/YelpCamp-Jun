/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
const express = require('express');
const passport = require('passport');
const userController = require('../controllers/users');

const router = express.Router();

router
  .route('/register')
  .get(userController.getRegister)
  .post(userController.postRegister);

router
  .route('/login')
  .get(userController.getLoginPage)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    userController.postLogin
  );

router.get('/logout', userController.getLogout);

module.exports = router;
