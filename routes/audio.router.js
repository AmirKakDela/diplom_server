const Router = require("express");
const router = new Router();
require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const uploadAudio = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "audio/mpeg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type, only MP3 is allowed!"), false);
        }
    },
    storage: multerS3({
        s3: s3,
        bucket: `${BUCKET}/audio`,
        acl: 'public-read',
        key: (req, file, cb) => {
            console.log(file);
            cb(null, file.originalname);
        },
    })
});

router.post("/audio-upload", uploadAudio.single("audio"),
    async (req, res) => {
    try{
        console.log("Successfully uploaded!");
        res.send(`https://d1u5py1azrnpf.cloudfront.net/audio/${req.file.originalname}`);
    } catch (e) {
        res.status(500)
            .json({ message: e.message });
        }
    });

router.get("/all-audio", async (req, res) => {
    try {
        let listObjects = await s3.listObjectsV2({
            Bucket: BUCKET,
            Prefix: "audio/"
        }).promise();
        let keyObjects = listObjects.Contents.map(item => item.Key);
        res.send(keyObjects);
    } catch (e) {
        res.status(500)
            .json({ message: e.message });
    }
});

router.get("/download-audio/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        let objectAudio = await s3.getObject({
            Bucket: `${BUCKET}/audio`,
            Key: filename,
        })
            .promise();
        res.send(objectAudio.Body);
    }catch (e){
        res.status(500)
            .json({ message: e.message });
    }
});

router.delete("/delete-audio/:filename", async (req, res) => {
    try{
        const filename = req.params.filename;
        await s3.deleteObject({
            Bucket: `${BUCKET}/audio`,
            Key: filename
        })
            .promise();
        res.send("File Deleted Successfully");
    }
    catch(e){
        res.status(500)
            .json({ message: e.message });
    }
});

module.exports = router;
