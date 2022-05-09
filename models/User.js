const {Schema, model} = require('mongoose');

const User = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    likedSongs: {type: [String], default: []},
    playlists: {type: [String], default: []},
    likedPlaylists: {type: [String], default: []},
    likedAlbums: {type: [String], default: []},
    admin: {type: Boolean, default: false}
})

module.exports = model('User', User);
