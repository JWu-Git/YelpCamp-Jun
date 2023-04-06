/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
const express = require('express');
const multer = require('multer');
const cloudinaryStorage = require('../cloudinary');

const upload = multer({ storage: cloudinaryStorage });
const campgroundController = require('../controllers/campgrounds');

const {
  isLoggedIn,
  isCampgroundAuthor,
  validateCampground,
} = require('../middleware');

const router = express.Router();

router.route('/').get(campgroundController.showCampgrounds).post(
  // eslint-disable-next-line no-unused-vars
  upload.array('image'),
  isLoggedIn,
  validateCampground,
  campgroundController.postCreateCampground
);

router.get('/new', isLoggedIn, campgroundController.getNewForm);

router.get('/search', campgroundController.campgroundSearchTerm);

router
  .route('/:id')
  .get(campgroundController.getCampground)
  .put(
    isLoggedIn,
    isCampgroundAuthor,
    validateCampground,
    campgroundController.putEditCampground
  )
  .delete(
    isLoggedIn,
    isCampgroundAuthor,
    campgroundController.deleteCampground
  );

router.get(
  '/:id/edit',
  isLoggedIn,
  isCampgroundAuthor,
  campgroundController.getEditForm
);

module.exports = router;
