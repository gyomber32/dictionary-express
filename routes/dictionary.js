const express = require('express');

const dictionaryController = require('../controllers/dictionary');

const router = express.Router();

router.get('/word', dictionaryController.getWords);

router.get('/word/:wordId', dictionaryController.getWord);

router.post('/word', dictionaryController.createWord);

router.put('/word/:wordId', dictionaryController.updateWord);

router.delete('/word/:wordId', dictionaryController.deleteWord);

module.exports = router;