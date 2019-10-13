const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const api_url = process.env.API_URL;
const api_key = process.env.API_KEY;

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    url: api_url
});

exports.getTranslation = (req, res, next) => {
    const sourceLanguage = req.params.sl;
    const targetLanguage = req.params.tl
    const word = req.params.word;

    const parameters = {
        text: word,
        modelId: `${sourceLanguage}-${targetLanguage}`
    };

    languageTranslator.translate(parameters).then(translationResult => {
        const word = (translationResult.result.translations[0].translation).toLowerCase();
        res.status(200).json({
            message: 'Word translated successfully!',
            data: word
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
