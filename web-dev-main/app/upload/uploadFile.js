const { S3Upload } = require("./S3Controller");
const pool = require("../boot/database/db_connect");
const logger = require("../middleware/winston");

const uploadFile = (path, req, sql, callback) => {
  S3Upload(path, req.file, function (s3Uploaded) {
    if (s3Uploaded.Location) {
      pool.query(sql, [s3Uploaded.Location, req.params.id], (err, rows) => {
        if (err) {
          logger.error(err.stack);
          callback({
            error: err,
          });
        } else {
          return callback({
            message: "file uploaded",
            url: s3Uploaded.Location,
          });
        }
      });
    } else {
      return callback({
        error: "Upload Failed",
      });
    }
  });
};

module.exports = uploadFile;
