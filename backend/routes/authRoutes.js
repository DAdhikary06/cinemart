const express = require('express');
const router = express.Router();
const { googleAuth } = require('../controllers/authController');

router.get("/google", googleAuth);

module.exports = router;