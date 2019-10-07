const Word = require('../models/word');
const mongoose = require('mongoose');

exports.getWords = (req, res, next) => {
    // TO DO
};

exports.getWord = (req, res, next) => {
    // TO DO
};

exports.createWord = (req, res, next) => {
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
    const wordId = req.params.postId;
    const vocable = req.body.word;
    const detail = {
        partsOfSpeech: req.body.partsOfSpeech,
        hungarian: req.body.hungarian,
        example: req.body.example,
        synonym: req.body.synonym
    }
    Word.findById(wordId).then(word => {
        if (!word) {
            const error = new Error('Word couldn\'t be found!');
            error.statusCode = 404;
            throw error;
        }
        word.word = vocable;
        //if a word has more than one detail object, every object should be capable of updating
        word.detail = detail;
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
    const wordId = req.params.postId;
    Word.findById(wordId)
        .then(word => {
            if (!word) {
                const error = new Error('Word couldn\'t be found!');
                error.statusCode = 404;
                throw error;
            }
            return Post.findByIdAndRemove(wordId);
        })
        .then(result => {
            console.log(result);
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