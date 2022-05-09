const {Schema, model} = require('mongoose');

const Artist = new Schema({
    name: {type: String, unique: true, required: true},
    image: {type: String},
})

module.exports = model('Artist', Artist);
