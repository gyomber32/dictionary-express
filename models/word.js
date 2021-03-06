const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    english: {
        type: String,
        required: true
    },
    details: [
        {
            partsOfSpeech: {
                type: String,
                enum: ['noun', 'pronoun', 'adjective', 'verb', 'adverb', 'preposition', 'conjunction', 'interjection'],
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
},
    { timestamps: true }
);

module.exports = mongoose.model('Word', wordSchema);