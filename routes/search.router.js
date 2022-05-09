const Router = require('express');
const router = new Router();
const controller = require('../controllers/searchController');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, controller.getSearchResult)

module.exports = router;