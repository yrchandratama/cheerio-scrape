const express = require('express');
const router = express.Router();

const MerchantsController = require('../controllers/merchants');

router.get('/', MerchantsController.getMerchants);

module.exports = router;