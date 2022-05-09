const {validationResult} = require("express-validator");

const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song")

class playlistController {
    async createPlaylist(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res
                    .status(412)
                    .json({message: "Ошибка при создании плейлиста", errors});

            const {name} = req.body;
            const candidatePlaylist = await Playlist.findOne({name, user: {id: req.user}});

            if (candidatePlaylist)
                return res
                    .status(412)
                    .json({
                        message:
                            "Плейлист с таким названиием от данного пользователя уже существует.",
                        candidatePlaylist,
                    });

            const playlist = new Playlist(req.body);
            await playlist.save();

            const userToAdd = await User.findById(req.user);

            if (userToAdd) {
                console.log(playlist._id)
                userToAdd.playlists.unshift(playlist._id);
                await userToAdd.save();
            }
            return res.json({playlist})
        } catch (e) {
            console.log(e);
            res.send({message: "Ошибка сервера при создании плейлиста"});
        }
    }

    async getAllPlaylists(req, res) {
        try {
            const playlists = await Playlist.find();
            if (!playlists)
                return res
                    .status(412)
                    .json({
                        message: "Ошибка сервера при получении списка всех плейлистов.",
                    });

            return res.json({playlists});
        } catch (e) {
            console.log(e);
            return res.send({
                message: "Ошибка сервера при получении списка всех плейлистов.",
            });
        }
    }

    async getPlaylistById(req, res) {
        try {
            const playlist = await Playlist.findById(req.params.id);
            if (!playlist)
                return res
                    .status(412)
                    .json({message: "Ошибка сервера при получении плейлиста."});

            const songs = await Song.find({_id: playlist.songs})

            return res.json({playlist, songs});
        } catch (e) {
            console.log(e);
            return res.send({
                message: "Ошибка сервера при получении плейлиста по Id.",
            });
        }
    }

    async addSongToPlaylist(req, res) {
        try {
            const {song} = req.body;

            const updatedPlaylist = await Playlist.findById(req.params.id)
                .then(playlist => {
                    if (playlist.songs.indexOf(song) < 0) {
                        playlist.songs.push(song);
                        playlist.save()
                    }
                    return playlist
                })

            const songs = await Song.find({_id: updatedPlaylist.songs})

            return res.json({updatedPlaylist, songs});
        } catch (e) {
            console.log(e);
            return res.send({message: "Ошибка сервера при обновлении плейлиста."});
        }
    }

    async deleteSongFromPlaylist(req, res) {
        try {
            const {song} = req.body;
            const updatedPlaylist = await Playlist.findById(req.params.id)
                .then(playlist => {
                    const index = playlist.songs.indexOf(song);
                    if (index !== -1) {
                        playlist.songs.splice(index, 1);
                        playlist.save();
                    }
                })

            const songs = await Song.find({_id: updatedPlaylist.songs})

            return res.json({updatedPlaylist, songs});
        } catch (e) {
            console.log(e);
            return res.send({message: "Ошибка сервера при обновлении плейлиста."});
        }
    }

    async editPlaylist(req, res) {
        try {
            if (Object.keys(req.body).length === 0 || !req.params.id)
                return res
                    .status(412)
                    .json({message: "Недостаточно данных для обновления плейлиста."});

            let cover = undefined
            if (req.files.cover) cover = `/${req.files.cover[0].path}`

            const updatedPlaylist = await Playlist.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    cover
                }
            );
            return updatedPlaylist
                ? res.json(updatedPlaylist)
                : res.status(412)
                    .json({message: "Плейлиста с таким id не существует"});
        } catch (e) {
            console.log(e);
            return res.send({message: "Ошибка сервера при обновлении плейлиста."});
        }
    }

    async deletePlaylist(req, res) {
        try {
            const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
            if (!deletedPlaylist)
                return res
                    .status(412)
                    .json({message: "Ошибка сервера при удалении плейлиста."});

            const users = await User.find({playlists: deletedPlaylist._id, likedPlaylists: deletedPlaylist._id});

            deletePlaylistOnUser(users, deletedPlaylist._id);
            return res.json({message: "Плейлист успешно удален", deletedPlaylist});
        } catch (e) {
            console.log(e);
            return res.send({message: "Ошибка сервера при удалении плейлиста"});
        }
    }

    async getUserPlaylists(req, res) {
        try {
            const user = await User.findById(req.params.id)

            const playlists = await Playlist.find({_id: user.playlists})

            return res.json({playlists});
        } catch (e) {
            console.log(e);
            return res.send({
                message: "Ошибка сервера при получении списка всех плейлистов.",
            });
        }
    }

    async userLikedPlaylists(req, res) {
        try {
            const user = await User.findById(req.params.id);

            if (!user) return res.status(403).json({message: 'Пользователь не найден'});

            const playlists = await Playlist.find({_id: user.likedPlaylists});
            if (!playlists) return res.json({message: "Любимых плейлистов нет"})

            return res.json({playlists});
        } catch (e) {
            console.log('Ошибка сервера при userLikedPlaylists', e);
            return res.send({message: "Ошибка сервера при сохранении понравившейся песни."});
        }
    }

    async toggleLikePlaylist(req, res) {
        try {
            const playlist = await Playlist.findById(req.params.id);
            if (!playlist) return res.status(412).json({message: 'Плейлиста с таким id не существует.'});

            let message = ""
            await User.findById(req.user).then(user => {
                    const playlistIndexInArray = user.likedPlaylists.indexOf(playlist._id);

                    if (playlistIndexInArray === -1) {
                        user.likedPlaylists.unshift(playlist._id);
                        user.save();
                        message = 'Добавлено в список любимых плейлистов.'
                    } else {
                        user.likedPlaylists.splice(playlistIndexInArray, 1);
                        user.save();
                        message = 'Удалено из списка любимых плейлистов.'
                    }
                }
            )
            return res.json({message});
        } catch
            (e) {
            console.log('Ошибка сервера при toggleLikePlaylist', e);
            return res.send({message: "Ошибка сервера добавлении плейлиста в список любимых плейлистов."});
        }
    }
}

function deletePlaylistOnUser(users, deletedPlaylistId) {
    users.map((user) => {
        const index = user.playlists.indexOf(deletedPlaylistId);
        const likeIndex = user.likedPlaylists.indexOf(deletedPlaylistId)
        if (index > -1) user.playlists.splice(index, 1);
        if (likeIndex > -1) user.likedPlaylists.splice(likeIndex, 1);
        user.save();
    });
}

module.exports = new playlistController();
