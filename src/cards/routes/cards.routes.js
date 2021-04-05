const express = require("express");
const drawCard = require("../controllers/draw-card.controller");
const generateCards = require("../controllers/generate-cards.controller");
const getURIfile = require("../controllers/getDatafile.controller");
const listCards = require("../controllers/list-cards.controller");
const router = express.Router();

router.post('/generate', generateCards);
router.post('/draw', drawCard);
router.get('/', listCards)
router.post('/get-file', getURIfile)

module.exports = router;