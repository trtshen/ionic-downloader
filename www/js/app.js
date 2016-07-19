(function() {

  var barsCtrl = function($scope, $interval, FileManager) {
    $scope.dynamic = 0;
    $scope.file = 0;

    $scope.download = function(url) {
      FileManager.xhrDownload(url).then(function(resp) {
        console.log(resp);
      }, function(err) {
        console.log(err);
      }, function(notify) {
        $scope.file = parseFloat((notify.loaded/notify.total) * 100).toFixed(0);
        console.log(notify);
      });
    };

    $scope.cordovaDownload = function(url) {
      FileManager.download(url).then(function(resp) {
        console.log(resp);
      }, function(err) {
        console.log(err);
      }, function(notify) {
        $scope.file = parseFloat((notify.loaded/notify.total) * 100).toFixed(0);
        console.log(notify);
      });
    };

    $interval(function() {
      $scope.dynamic = Math.floor(Math.random() * (100 - 0)) + 0;
    }, 2000);
  };

  angular.module('downloader', ['ionic', 'ngCordova', 'downloader.directives', 'downloader.file'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .controller('barCtrl', barsCtrl);

}());
