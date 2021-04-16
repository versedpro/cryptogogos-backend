const express = require("express");
const getLeaderboardController = require('../controllers/getLeaderboard.controller')

const router = express.Router();

router.get('/', getLeaderboardController);

module.exports = router;
