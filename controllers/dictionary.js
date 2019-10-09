const Word = require('../models/word');
const mongoose = require('mongoose');

exports.getWords = (req, res, next) => {
    Word.find().then(words => {
        if (!words) {
            const error = new Error('Couldn\'t fetch words!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Words fetched successfully!',
            data: words
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getWord = (req, res, next) => {
    const wordId = req.params.wordId;
    Word.findById(wordId).then(word => {
        if (!word) {
            const error = new Error('Couldn\'t find word!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Word fetched successfully!',
            data: word
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createWord = (req, res, next) => {
    /* OPTIONAL: if the word contains more then one detail, so the details is an array */
    const vocable = req.body.word;
    const detail = {
        partsOfSpeech: req.body.partsOfSpeech,
        hungarian: req.body.hungarian,
        example: req.body.example,
        synonym: req.body.synonym
    }
    /* check existing word */
    Word.findOne({ word: vocable }).then(existingWord => {
        if (!existingWord) {
            const word = new Word({
                _id: mongoose.Types.ObjectId(),
                word: vocable,
                details: detail
            });
            word.save().then(result => {
                res.status(201).json({
                    message: 'Word created successfully!',
                    data: result
                });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } else {
            if (existingWord.word === vocable) {
                const found = existingWord.details.find(element => {
                    return element.partsOfSpeech === detail.partsOfSpeech;
                });
                if (!found) {
                    existingWord.details.push(detail);
                    existingWord.save().then(result => {
                        res.status(200).json({
                            message: 'Word details updated successfully!',
                            data: result
                        });
                    }).catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                    });
                } else {
                    const error = new Error('Already in database.');
                    error.statusCode = 422;
                    throw error;
                }
            }
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateWord = (req, res, next) => {
    const wordId = mongoose.mongo.ObjectId(req.params.wordId);
    const wordUpdate = req.body;
    Word.findById(wordId).then(word => {
        if (!word) {
            const error = new Error('Word couldn\'t be found!');
            error.statusCode = 404;
            throw error;
        }
        word.word = wordUpdate.word;
        word.details = wordUpdate.details;
        return word.save();
    }).then(result => {
        res.status(200).json({
            message: 'Word updated successfully!',
            data: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deleteWord = (req, res, next) => {
    const wordId = mongoose.mongo.ObjectId(req.params.wordId);
    Word.findById(wordId)
        .then(word => {
            if (!word) {
                const error = new Error('Word couldn\'t be found!');
                error.statusCode = 404;
                throw error;
            }
            return Word.findByIdAndRemove(wordId);
        })
        .then(result => {
            res.status(200).json({
                message: 'Word deleted successfully!',
                data: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
