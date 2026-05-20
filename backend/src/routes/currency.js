const { Router } = require('express');
const { getRates } = require('../controllers/currencyController');

const router = Router();

router.get('/rates', getRates);

module.exports = router;
