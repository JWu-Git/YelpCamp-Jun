/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const engine = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// eslint-disable-next-line import/no-extraneous-dependencies
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');
const ExpressError = require('./utils/ExpressError');

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  saveUninitialized: false, // don't create session until something stored
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 3600, // time period in seconds
  }),
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.engine('ejs', engine);

mongoose.connect(process.env.DB_URL);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
app.use(session(sess));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  return next();
});

app.use('/', usersRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get('/', (req, res) => res.render('home'));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page does not exist.', 404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = 'Oh no, something went wrong!';
  }
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serving port ${port}`));
