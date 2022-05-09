const Router = require('express');
const router = new Router();
const controller = require('../controllers/songController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const {check} = require("express-validator");

router.post('/create', adminMiddleware,
    check('name', 'Обязательное поле не заполнено').notEmpty(),
    check('artist', 'Обязательное поле не заполнено').notEmpty(),
    check('song', 'Обязательное поле не заполнено').notEmpty(),
    check('cover', 'Обязательное поле не заполнено').notEmpty(),
    check('artistId', 'Обязательное поле не заполнено').notEmpty(),
    // check('duration', 'Обязательное поле не заполнено').notEmpty(),
    check('genre', 'Обязательное поле не заполнено').notEmpty(),
    uploadMiddleware.fields([
        {name: 'cover', maxCount: 1},
        {name: 'song', maxCount: 1}
    ]),
    controller.createSong);

router.get('/all', controller.getAllSongs);

router.get('/:id', controller.getSong);

router.get('/user/liked-songs', authMiddleware, controller.userLikedSongs);

router.put('/user/like/:id', authMiddleware, controller.toggleLikeSong);

router.delete('/delete/:id', adminMiddleware, controller.deleteSong);

router.put('/update/:id', adminMiddleware, controller.updateSong);

module.exports = router;
