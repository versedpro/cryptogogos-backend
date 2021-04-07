const express = require("express");
const mintController = require("../controllers/mint.controller");
const generateCards = require("../controllers/generate-cards.controller");
const router = express.Router();

router.post('/generate', generateCards);
router.post('/startMint', mintController.startMint);
router.post('/draw', mintController.singleMint);
router.post('/packDraw', mintController.packMint);

module.exports = router;