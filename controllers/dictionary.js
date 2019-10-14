const Word = require('../models/word');
const mongoose = require('mongoose');

exports.getWords = (req, res, next) => {
    Word.find().lean().then(words => {
        if (!words) {
            const error = new Error('Couldn\'t fetch words!');
            error.statusCode = 404;
            throw error;
        }
        words.forEach((word, i) => {
            words[i].createdAt = dateFormat(word.createdAt);
        });
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
        let formattedWord = word.toObject();
        formattedWord.createdAt = dateFormat(word.createdAt);
        res.status(200).json({
            message: 'Word fetched successfully!',
            data: formattedWord
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createWord = (req, res, next) => {
    const word = req.body.word;
    const details = req.body.details;
    Word.findOne({ english: word }).then(existingWord => {
        if (!existingWord) {
            const newWord = new Word({
                _id: mongoose.Types.ObjectId(),
                english: word,
                details: details
            });
            newWord.save().then(result => {
                let formattedResult = result.toObject();
                formattedResult.createdAt = dateFormat(result.createdAt);
                res.status(201).json({
                    message: 'Word created successfully!',
                    data: formattedResult
                });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } else {
            if (existingWord.word === word) {
                const found = existingWord.details.find(element => {
                    return element.partsOfSpeech === detail.partsOfSpeech;
                });
                if (!found) {
                    existingWord.details.push(detail);
                    existingWord.save().then(result => {
                        let formattedResult = result.toObject();
                        formattedResult.createdAt = dateFormat(result.createdAt);
                        res.status(200).json({
                            message: 'Word details updated successfully!',
                            data: formattedResult
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
        word.english = wordUpdate.word;
        word.details = wordUpdate.details;
        return word.save();
    }).then(result => {
        let formattedResult = result.toObject();
        formattedResult.createdAt = dateFormat(result.createdAt);
        res.status(200).json({
            message: 'Word updated successfully!',
            data: formattedResult
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

function dateFormat(date) {
    return new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
