const { Schema, model } = require("mongoose");

const Genre = new Schema({
        name: { type: String, required: true },
        color: { type: String,  required: true }
    }
);
module.exports = model('Genre', Genre);
