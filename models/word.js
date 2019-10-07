const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word: {
        type: String,
        required: true
    },
    details: [
        {
            partsOfSpeech: {
                type: String,
                enum: ['noun', 'pronoun', 'adjective', 'verb', 'adverb', 'preposition', 'conjunction', 'interjenction'],
                required: true
            },
            hungarian: {
                type: String,
                required: true
            },
            example: {
                type: String,
                required: false
            },
            synonym: {
                type: String,
                required: false
            }
        }
    ]
});

module.exports = mongoose.model('Word', wordSchema);