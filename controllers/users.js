/* eslint-disable consistent-return */
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.getRegister = async (req, res) => {
  res.render('users/register');
};

module.exports.postRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const registeredUser = await User.register({ username, email }, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

module.exports.getLoginPage = async (req, res) => {
  res.render('users/login');
};

module.exports.postLogin = catchAsync(async (req, res) => {
  req.flash('success', 'Welcome back!');
  const url = req.session.returnTo || '/campgrounds';
  res.redirect(url);
});

module.exports.getLogout = (req, res, next) => {
  req.logout((err) => next(err));
  res.redirect('/');
};
