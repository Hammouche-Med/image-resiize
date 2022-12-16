const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split("/");
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

router.post("/", upload.single("pic"), async (req, res) => {
  const height = parseInt(req.body.height);
  const width = parseInt(req.body.width);

  const { filename: image } = req.file;
  try {
    await sharp(req.file.path)
      .resize({
        width: width,
        height: height,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .jpeg({ quality: 90 })

      .toFile(path.resolve(req.file.destination, "resized/", image));
    fs.unlinkSync(req.file.path);
    return res.json({
      success: true,
      message: "/resize-image",
      code: 200,
      data: {
        pic: req.file,
        height: height,
        width: width,
        link: `${process.env.URL}/uploads/resized/${req.file.filename}`,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
      code: 500,
    });
  }
});

module.exports = router;
