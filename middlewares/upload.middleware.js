const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if(file.fieldname === 'song') {
            cb(null, './uploads/songs/')
        }
        else if(file.fieldname === 'cover' || file.fieldname === 'image') {
            cb(null, './uploads/images/')
        }
    },
    filename(req, file, cb) {
        const date = new Date().toLocaleTimeString().replace(/:/g, "-");
        cb(null, `${date}-${file.originalname}`)
    }
})

module.exports = multer({
    storage
})
