const express = require('express');
const getPackPrice = require('../controllers/getPackPrice.controller');
const registerUser = require('../controllers/register-user.controller');
const addPurchase = require('../purchases/controllers/add-purchase.controller');
const addTransactions = require("../transactions/add-transaction.controller")
const router = express.Router();


router.post('/register', registerUser);
router.post('/purchases', addPurchase)
router.post('/transactions', addTransactions)
router.get('/pack-price', getPackPrice)

// router.get("/", listUser)


module.exports = router;