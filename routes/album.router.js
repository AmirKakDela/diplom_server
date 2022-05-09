const Router = require("express");
const router = new Router();
const controller = require("../controllers/AlbumController");
const authMiddleware = require("../middlewares/auth.middleware");
const { check } = require("express-validator");
const adminMiddleware = require("../middlewares/admin.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

router.get("/allAlbums", controller.getAllAlbums);
router.get("/albumsWithSongs", controller.getAllAlbumsWithSongs);
router.get("/artist/:artistId", controller.getAllArtistAlbum);
router.get("/:albumId", controller.getAlbum);
router.post("/create", adminMiddleware,
    check("name", "Обязательное поле не заполнено")
        .notEmpty(),
    check("artist", "Обязательное поле не заполнено")
        .notEmpty(),
    check("songs", "Обязательное поле не заполнено")
        .notEmpty(),
    check("cover", "Обязательное поле не заполнено")
        .notEmpty(),
    uploadMiddleware.fields([
        {name: 'cover', maxCount: 1},
    ]),
    controller.createArtistAlbum);

router.delete("/delete/:id",adminMiddleware, controller.deleteAlbum);
router.put("/update/:id", adminMiddleware, controller.updateAlbum);
router.put('/user/like/:id', authMiddleware, controller.toggleLikeAlbum);
router.get('/user/liked-albums', authMiddleware, controller.userLikedAlbums);

module.exports = router;
