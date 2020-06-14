const http = require("http");
const fs = require("fs");

const download = function(url, dest, cb) {
  dest = `./songs/${dest}.mp3`;
  const file = fs.createWriteStream(dest);
  http
    .get(url, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

exports.download = download;
