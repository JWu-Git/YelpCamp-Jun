const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postReview = catchAsync(async (req, res) => {
  const review = new Review(req.body.review);
  review.author = req.user.id;
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'No such campground exists. Redirected.');
    res.redirect('/campgrounds');
    return;
  }
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash('success', 'Successfully made new review.');
  res.redirect(`/campgrounds/${campground.id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash('success', 'Successfully deleted review.');
  res.redirect(`/campgrounds/${id}`);
});
