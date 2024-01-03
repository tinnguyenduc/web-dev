const S3 = require("../aws/S3config");
const logger = require("../middleware/winston");

const S3Upload = (path, file, callback) => {
  if (file) {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${path}${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      //   ACL: "public-read"
    };

    S3.upload(params, function (err, data) {
      if (err) {
        logger.error(err.message);
        return callback({
          Location: null,
        });
      } else {
        return callback({
          Location: data.Location,
        });
      }
    });
  } else {
    return callback({
      Location: null,
    });
  }
};

module.exports = { S3Upload };
