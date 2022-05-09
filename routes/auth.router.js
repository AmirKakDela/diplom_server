const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const {check} = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.post('/register',
    [
        check('email', 'Некорректный Email').isEmail(),
        check('password', 'Пароль должен быть не менее 4 и не более 20 символов')
            .isLength({min: 4, max: 20}),
        check('name', 'Имя пользователя не может быть пустым').notEmpty().isLength({min: 2, max: 40})
    ],
    controller.register
)

router.post('/login', controller.login);
router.get('/auth', authMiddleware, controller.auth);


// TODO: эти функции для теста, их потом удалить
router.get('/user-test', authMiddleware, (req, res) => {
    return res.json({hello: 'hello, user'})
})

router.get('/admin-test', adminMiddleware, (req, res) => {
    return res.json({hello: 'hello, admin'})
})

module.exports = router
