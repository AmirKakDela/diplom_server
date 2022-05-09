const Artist = require("../models/Artist");
const Song = require("../models/Song");
const Album = require("../models/Album");

class artistController {
    async createArtist(req, res) {
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) return res.status(412).json({message: 'Ошибка при создании артиста', errors});

            const candidateArtist = await Artist.findOne({name: req.body.name});
            if (candidateArtist) return res.status(412).json({
                message: 'Такой исполнитель уже существует',
                candidateArtist
            });

            const artist = new Artist({
                ...req.body,
                image: '/' + req.files.image[0].path
            });
            artist.save();
            return res.json({message: 'Исполнитель успешно создан.', artist});
        } catch (e) {
            console.log('Ошибка сервера при createArtist', e);
            return res.send({message: "Ошибка сервера при добавлении артиста."});
        }
    }

    async updateArtist(req, res) {
        try {
            //if (!Object.keys(req.body).includes('image') || Object.keys(req.body).length !== 1)
            if (!req.body?.image || Object.keys(req.body).length !== 1)
                return res.status(412).json({message: 'Поменять можно только изображение исполнителя'});
            const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body);
            if (!updatedArtist)
                return res.status(412).json({message: "Артиста с таким id не существует"});
            updatedArtist.save();
            return res.json({message: 'Изображение артиста успешно изменено'});
        } catch (e) {
            console.log('Ошибка сервера при updateArtist', e);
            return res.send({message: "Ошибка сервера при обновлении артиста."});
        }
    }

    async getAllArtists(req, res) {
        try {
            const artists = await Artist.find();
            if (!artists)
                return res.status(412).json({message: "Ошибка сервера при получении списка всех треков."});
            return res.json(artists);
        } catch (e) {
            console.log('Ошибка сервера при getAllArtists', e);
            return res.send({message: "Ошибка сервера при получении списка всех артистов."});
        }
    }

    async getArtist(req, res) {
        try {
            const artistId = req.params.id;
            const artist = await Artist.findById(artistId);
            if (!artist)
                return res.status(412).json({message: "Ошибка сервера при получении артиста."});
            const songs = await Song.find({artistId: artist._id});
            const albums = await Album.find({artist: artist.name});
            return res.json({artist, songs, albums})
        } catch (e) {
            console.log('Ошибка сервера при getArtist', e);
            return res.send({message: "Ошибка сервера при получении артиста."});
        }
    }

    async getAllArtistSongs(req, res) {
        try {
            const artist = await Artist.findById(req.params.id);
            if (!artist) return res.status(412).json({message: 'Артиста с таким id не найдено.'});

            const songs = await Song.find({artistId: artist._id});
            return res.json(songs);
        } catch (e) {
            console.log('Ошибка сервера при getArtist', e);
            return res.send({message: "Ошибка сервера при получении всех песен."});
        }
    }

    async deleteArtist(req, res) {
        try {
            const deletedArtist = await Artist.findById(req.params.id);
            if (!deletedArtist)
                return res.status(412).json({message: 'Артиста с таким id не найдено.'});
            const deletedArtistAlbum = await Album.deleteMany({artist: deletedArtist.name});
            const deleteSongs = await Song.deleteMany({artistId: req.params.id});
            const deleteArtist = await Artist.findByIdAndDelete(req.params.id);
            return res.json({ message: "Артист успешно удален" });
        } catch (e) {
            console.log('Ошибка сервера при getArtist', e);
            return res.send({message: "Ошибка сервера при получении всех песен."});
        }
    }
}

module.exports = new artistController();
