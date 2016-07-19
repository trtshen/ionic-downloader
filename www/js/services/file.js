(function(angular) {

'use strict';

angular.module('downloader.file', [])

.service('FileManager', ['$q', '$window', '$cordovaFile', '$cordovaFileTransfer', '$http', function($q, $window, $cordovaFile, $cordovaFileTransfer, $http){
  var self = this,

    getMimeType = function(extension) {
      var types = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        g3: "image/g3fax",
        gif: "image/gif",
        ief: "image/ief",
        tif: "image/tiff",
        webm: "video/webm",
        ogg: "video/ogg",
        ogv: "video/ogv",
        mp4: "video/mp4"
      };

      if (types[extension]) {
        return types[extension];
      }

      return '';
    },

    getFilename = function (url) {
      var name = url.split('/').pop().replace(/\#(.*?)$/, '').replace(/\?(.*?)$/, ''),
          extension = name.split('.').pop();

      if (extension === name) {
        extension = '';
      }

      return { name: name, extension: extension };
    };

  self.getDirectory = function() {
    var dir = cordova.file.dataDirectory;
    return dir;
  };

  self.getMetadata = function (filepath) {
    var d = $q.defer();

    $window.resolveLocalFileSystemURL(filepath, function (fileSystem) {
      fileSystem.getMetadata(d.resolve, d.reject);
    }, d.reject);

    return d.promise;
  };

  /**
   * Return file directory, name, extension
   * @return {object}
   */
  self.info = function(sourceFile) {
    var file = getFilename(sourceFile);

    return {
      filepath: sourceFile,
      directory: sourceFile.substring(0, sourceFile.lastIndexOf('/')) + '/',
      name: file.name,
      extension: file.extension,
      mimeType: getMimeType(file.extension)
    };
  };

  self.xhrDownload = function(url, options) {
    options = options || {};

    var thisFile = self.info(url),
        fileDir = self.getDirectory(),
        d = $q.defer();

        $http({
          url: url,
          method: 'GET',
          responseType: 'arraybuffer'
        }).then(function(response) {
          var arrayBufferView = new Uint8Array(response.data);
          var data = new Blob([arrayBufferView], {
            type: response.headers('content-type')
          });

          $window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function(dir) {
            dir.getFile(thisFile.name, {create:true}, function(file) {
              file.createWriter(function(writer) {

                writer.onwriteend = function(e) {
                  $cordovaFile.moveFile(cordova.file.cacheDirectory, thisFile.name, fileDir).then(function(created) {
                      d.resolve(created);
                    }, function(error) {
                      d.resolve(self.download(url, options));
                    });
                };

                writer.onerror = function(e) {
                  d.resolve(self.download(url, options));
                };

                writer.seek(writer.length);
                writer.write(data);

              }, function(error) {
                d.reject(error);
              });
            });
          });

        }, function(error) {
          d.reject(error);
        }, function(notify) {
          d.reject(notify);
        });

    return d.promise;
  };

  self.download = function(url, options) {
    options = options || {};

    var thisFile = self.info(url),
        fileDir = self.getDirectory() + thisFile.name,
        d = $q.defer();

    $cordovaFileTransfer.download(url, fileDir, {}, true).then(d.resolve, d.reject, d.notify);

    return d.promise;
  };

}]);

})(angular);

