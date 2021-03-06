'use strict';

angular.module('handCoolerApp')
  .controller('GemDetailCtrl', function ($scope, $http, $routeParams, $window, detectRepos) {
    $scope.gemName = $routeParams.gemName;
    if(! $scope.gemName) {
      $scope.siteDescription = true;
      var myArray = ['paperclip', 'appraisal', 'tachikoma', 'omniauth', 'pundit'];
      $scope.exampleGems = myArray;
      $scope.gemName = myArray[Math.floor(Math.random() * myArray.length)];
    }

    $scope.fetchReadme = function(url) {
      var uri = URI(url);
      var readmeApi = 'http://api.handcooler.org/readme/github.com/' + uri.segment(0) + '/' + uri.segment(1);
      $http.get(readmeApi).success(function(data) {
        $scope.readme = data;
      });
    };

    $scope.doCompare = function(tags) {
      var uri = URI($scope.sourceUrl);
      $scope.compareUrl = 'https://github.com/' + uri.segment(0) + '/' + uri.segment(1) + '/compare/' + tags.base + '...' + tags.compare;
      $window.open($scope.compareUrl);
    };

    $scope.fetchTags = function(url) {
      var uri = URI(url);
      var tagsApi = 'http://api.handcooler.org/tags/github.com/' + uri.segment(0) + '/' + uri.segment(1) + '.json';
      $http.get(tagsApi).success(function(data) {
        $scope.tags = data;
        //default value
        $scope.tags.base = $scope.tags[1];
        $scope.tags.compare = $scope.tags[0];
      });
    };
    var gemApi = 'http://api.handcooler.org/rubygems.org/api/v1/gems/' + $scope.gemName + '.json';
    $http.get(gemApi).success(function(data) {
      $scope.detail = data;
      $scope.sourceUrl = detectRepos.uri(data);
      $scope.fetchReadme($scope.sourceUrl);
      $scope.fetchTags($scope.sourceUrl);
    });
  });
