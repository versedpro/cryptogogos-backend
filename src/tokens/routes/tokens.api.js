const express = require("express");
const generateTokens = require("../controllers/generate-tokens.controller");

const router = express.Router();

router.post('/generate', generateTokens);

module.exports = router;