const Artist = require("../models/Artist");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");

class searchController {

    async getSearchResult(req, res) {
        try {
            const {query} = req.query;
            if (query === '') return res.json({songs: [], artists: [], playlists: []});

            const songs = await Song.find({name: {$regex: query, $options: "i"}}).limit(5);
            const artists = await Artist.find({name: {$regex: query, $options: "i"}}).limit(5);
            const playlists = await Playlist.find({name: {$regex: query, $options: "i"}}).limit(5);



            res.json({songs, artists, playlists});
        } catch (e) {
            res.status(412).send({message: 'Возникла ошибка при поиске на стороне сервера'});
            console.log('ошибка getSearchResult', e)
        }
    }

}

module.exports = new searchController();