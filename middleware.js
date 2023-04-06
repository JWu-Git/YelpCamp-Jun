/* eslint-disable prefer-arrow-callback */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line consistent-return

const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const reviewJoiSchema = require('./joiSchema/reviewSchema');
const campgroundJoiSchema = require('./joiSchema/campgroundSchema');
const Review = require('./models/review');

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to view this page.');
    return res.redirect('/login');
  }
  next();
};

const isCampgroundAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'No campground found.');
    return res.redirect('/campgrounds');
  }

  if (!campground.author.equals(req.user.id)) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
});

const isReviewAuthor = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash('error', 'No review found.');
    return res.redirect(`/campgrounds/${id}`);
  }

  if (!review.author.equals(req.user.id)) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
});

const validateReview = catchAsync(async function validateReview(
  req,
  res,
  next
) {
  const { review } = req.body;
  await reviewJoiSchema.validateAsync(review);
  next();
});
const validateCampground = catchAsync(async function validateCampground(
  req,
  res,
  next
) {
  const { campground } = req.body;
  await campgroundJoiSchema.validateAsync(campground);
  next();
});

module.exports = {
  isLoggedIn,
  isCampgroundAuthor,
  isReviewAuthor,
  validateReview,
  validateCampground,
};
