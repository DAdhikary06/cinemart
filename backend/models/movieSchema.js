const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  cover: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  genre: [{
    type: String,
    required: true,
    trim: true,
  }],
  director: {
    type: String,
    required: true,
    trim: true,
  },
  cast: {
    type: [String],
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return value.length > 1;
      },
      message: 'Cast should have at least two member',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;