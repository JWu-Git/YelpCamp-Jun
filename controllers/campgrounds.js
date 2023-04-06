/* eslint-disable arrow-body-style */
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.showCampgrounds = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {
    campgrounds,
  });
});

module.exports.showFilteredCampgrounds = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {
    campgrounds,
  });
});

module.exports.getNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.getEditForm = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'No such campground exists. Redirected.');
    res.redirect('/campgrounds');
    return;
  }
  res.render('campgrounds/edit', { campground });
});

module.exports.getCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'No such campground exists. Redirected.');
    res.redirect('/campgrounds');
    return;
  }
  res.render('campgrounds/show', { campground });
});

async function getpointGeoJSON(location) {
  const mapboxToken = process.env.MAPBOX_TOKEN;
  const geocodeUrl = `https://boiling-stream-67780.herokuapp.com/campgrounds/https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxToken}`;
  const response = await axios.get(geocodeUrl);
  return response.data.features[0].geometry;
}
module.exports.postCreateCampground = catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user.id;
  const urlMap = req.files.map((f) => {
    return { url: f.path, name: f.filename };
  });
  campground.images = urlMap;
  // eslint-disable-next-line prefer-destructuring
  const location = campground.location;
  const pointGeoJSON = await getpointGeoJSON(location);
  campground.geometry = pointGeoJSON;
  await campground.save();
  req.flash('success', 'Successfully made new campground');
  res.redirect(`/campgrounds/${campground.id}`);
});

module.exports.putEditCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground);
  const campground = await Campground.findById(id);
  // eslint-disable-next-line prefer-destructuring
  const location = campground.location;
  const pointGeoJSON = getpointGeoJSON(location);
  campground.geometry = pointGeoJSON;
  await campground.save();
  req.flash('success', 'Successfully edited campground');
  res.redirect(`/campgrounds/${id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'No such campground exists. Redirected.');
    res.redirect('/campgrounds');
    return;
  }
  await Review.deleteMany({ _id: { $in: campground.reviews } });
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground');
  res.redirect('/campgrounds');
});

module.exports.campgroundSearchTerm = catchAsync(async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const searchTerm = req.query.searchTerm.toLowerCase(); // convert searchTerm to lowercase
  const regex = new RegExp(searchTerm, 'i'); // create regex with ignore case flag
  const campgrounds = await Campground.find({ title: regex });
  res.render('campgrounds/index', {
    campgrounds,
  });
});
