/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
const express = require('express');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, reviewController.postReview);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
