const Router = require('express');
const router = new Router();
const controller = require('../controllers/artistController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {check} = require("express-validator");
const uploadMiddleware = require("../middlewares/upload.middleware");

router.post('/create',
    check('name', 'Обязательное поле не заполнено').notEmpty(),
    check('image', 'Обязательное поле не заполнено').notEmpty(),
    uploadMiddleware.fields([
        {name: 'image', maxCount: 1},
    ]),
    controller.createArtist);

router.put('/update/:id', adminMiddleware, controller.updateArtist);
router.get('/all', authMiddleware, controller.getAllArtists);
router.get('/artist/:id', authMiddleware, controller.getArtist)
router.get('/all-songs/:id', authMiddleware, controller.getAllArtistSongs);
router.delete('/delete/:id', adminMiddleware, controller.deleteArtist);

module.exports = router;
