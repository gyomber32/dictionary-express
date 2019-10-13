const express = require('express');

const translateController = require('../controllers/translate');

const router = express.Router();

router.get('/sl=:sl&tl=:tl&word=:word', translateController.getTranslation);

module.exports = router;