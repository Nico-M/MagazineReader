const EPub = require("epub");

class EPubLocal extends EPub {
  getChapterRaw(id, callback) {
    if (this.manifest[id]) {
      if (
        !(
          this.manifest[id]["media-type"] == "application/xhtml+xml" ||
          this.manifest[id]["media-type"] == "image/svg+xml" ||
          this.manifest[id]["media-type"] == "text/html"
        )
      ) {
        return callback(new Error("Invalid mime type for chapter"));
      }

      this.zip.readFile(
        this.manifest[id].href,
        function (err, data) {
          if (err) {
            callback(new Error("Reading archive failed"));
            return;
          }

          var str = "";
          if (data) {
            str = data.toString("utf-8");
          }

          callback(null, str);
        }.bind(this)
      );
    } else {
      callback(new Error("File not found"));
    }
  }
}

module.exports = EPubLocal;
