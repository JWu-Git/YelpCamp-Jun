/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelpers');
const cities = require('./cities');

const dotenvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: dotenvPath });

mongoose.connect(process.env.DB_URL);

const url = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_KEY}`;

async function getPics() {
  const resp = await axios.get(url, {
    params: { count: 30, collections: 4651015, orientation: 'landscape' },
  });
  const resp_data = resp.data;
  const urls_array = resp_data.map((el) => el.urls.regular);
  return urls_array;
}

function sampleArray(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}
function getPrice() {
  return Math.floor(Math.random() * 200 + 50);
}

async function cleanDB() {
  await Campground.deleteMany({});
}

async function seedDB() {
  const urls_array = await getPics();
  for (let i = 0; i < 14; i++) {
    const randomIndex = Math.floor(Math.random() * 1000);
    const location = `${cities[randomIndex].city}, ${cities[randomIndex].state}`;
    const mapboxToken = process.env.MAPBOX_TOKEN;
    const geocode_url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxToken}`;
    const response = await axios.get(geocode_url);
    // eslint-disable-next-line prefer-destructuring
    const pointGeoJSON = response.data.features[0].geometry;
    const campground = new Campground({
      author: '64059873a58acb4e90ba4917',
      // eslint-disable-next-line object-shorthand
      location: location,
      title: `${sampleArray(descriptors)} ${sampleArray(places)}`,
      price: `${getPrice()}`,
      description:
        'Eleifend habitasse platea lacus gravida suspendisse feugiat auctor curabitur porttitor laoreet. Conubia nulla justo molestie eros ultrices. Potenti natoque, lacinia metus congue felis vel? Mus euismod phasellus molestie condimentum faucibus elementum! Mattis habitant potenti sapien orci magna maecenas eros bibendum consectetur. Congue diam etiam eu quis adipiscing malesuada, natoque hendrerit. Iaculis ligula duis tortor aenean volutpat iaculis sociis eros. Quam aliquam mi magnis curae; donec.',
      images: [
        { url: urls_array[2 * i], name: 'mine' },
        { url: urls_array[2 * i + 1], name: 'mine' },
      ],
      geometry: pointGeoJSON,
    });
    await campground.save();
  }
}

async function completeSeeding() {
  await cleanDB();
  await seedDB();
  await seedDB();
  await seedDB();
  await seedDB();
  await seedDB();

  mongoose.connection.close();
  console.log('MongoDB connection closed');
}

completeSeeding();
