require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const passport = require("passport");
// require("./middlewares/passport");
const cors = require("cors");
const throttler = require('./utils/throttleMiddleware')

// Routes
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const showtimeRouter = require('./routes/showtimes');
const screenRouter = require('./routes/screens');
const authRouter = require('./routes/authRoutes');

const app = express();
app.disable('x-powered-by');
const port = 5000

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(cors({
  origin: process.env.REACT_URL,
  methods: "GET,POST,PUT,DELETE",
}));
app.use(express.json());
// Initialize Passport
// app.use(passport.initialize());

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
  );

  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // Pass to next layer of middleware
  next();
});



// comment this out to disable throttling
// app.use(throttler);
app.use("/auth/", authRouter);
app.use(userRouter)
app.use(movieRouter);
app.use(showtimeRouter);
app.use(screenRouter);

app.listen(port, () => console.log(`app is running in PORT: ${port}`));