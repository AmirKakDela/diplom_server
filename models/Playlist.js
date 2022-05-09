const {Schema, model} = require('mongoose');

const Playlist = new Schema({
    name: {type: String, required: true},
    user: {
        id: {type: String, required: true},
        name: {type: String, required: true}
    },
    cover: {type: String},
    songs: [{type: Schema.Types.ObjectId, ref: "Song"}],
    description: {type: String}
})

module.exports = model('Playlist', Playlist);