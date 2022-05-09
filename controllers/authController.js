const { validationResult } = require("express-validator");
const User = require("../models/User");
const Playlist = require("../models/Playlist");

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400)
                .json({
                    message: "Ошибка при регистрации",
                    errors
                });

            const { email, password, name } = req.body;
            const candidate = await User.findOne({ email });
            if (candidate) return res.status(400)
                .json({ message: `Пользователь с почтовым адрессом ${email} уже существует.` });

            const user = new User({ email, password, name });
            await user.save();
            return res.json({ message: "Пользователь создан" });
        } catch (e) {
            console.log(e);
            res.send({ message: "Ошибка сервера при регистрации" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(403)
                .json({ message: `Пользователя с таким почтовым адресом не существует.` });

            if (user.password !== password) return res.status(403)
                .json({ message: "Неверный пароль" });

            const token = user._id + "_" + user.admin;

            let playlists = [];
            let likedPlaylists = [];

            await Playlist.find()
                .then(data => {
                    playlists.push(...data.filter(p => user.playlists.indexOf(p._id) > -1));
                    likedPlaylists.push(...data.filter(p => user.likedPlaylists.indexOf(p._id) > -1));
                });

            return res.json({
                token,
                userId: user._id,
                userName: user.name,
                isAdmin: user.admin,
                playlists,
                likedPlaylists,
                likedAlbums: user.likedAlbums,
            });
        } catch (e) {
            console.log(e);
            res.send({ message: "Ошибка сервера при логине" });
        }
    }

    async auth(req, res) {
        try {
            const user = await User.findOne({ _id: req.user });
            const token = user._id + "_" + user.admin;

            let playlists = [];
            let likedPlaylists = [];
            await Playlist.find()
                .then(data => {
                    playlists.push(...data.filter(p => user.playlists.indexOf(p._id) > -1));
                    likedPlaylists.push(...data.filter(p => user.likedPlaylists.indexOf(p._id) > -1));
                });

            return res.json({
                token,
                userId: user._id,
                userName: user.name,
                isAdmin: user.admin,
                playlists,
                likedPlaylists,
                likedSongs: user.likedSongs,
                likedAlbums: user.likedAlbums,
            });
        } catch (e) {
            console.log(e);
            res.send({ message: "Ошибка сервера при авторизации" });
        }
    }
}

module.exports = new authController();
