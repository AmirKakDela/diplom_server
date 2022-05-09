const Router = require('express');
const router = new Router();
const controller = require('../controllers/GenreController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {check} = require("express-validator");

router.post('/create-genre', authMiddleware, adminMiddleware,
    check('name', 'Обязательное поле не заполнено').notEmpty(),
    check('color', 'Обязательное поле не заполнено').notEmpty(),
    check('color', 'Цвет должен быть в формате HEX').isHexColor(),
    controller.createGenre
);

router.get('/all-genres', authMiddleware, controller.getAllGenres);

router.get('/genre/:id', authMiddleware, controller.getGenre);

router.put('/update-genre/:id', authMiddleware, adminMiddleware, controller.updateGenre)

module.exports = router;