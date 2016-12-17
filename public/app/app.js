angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'tubenotes.services',
  'tubenotes.auth', 
  'tubenotes.home',
  'ngRoute',
  'tubenotes.groups',
  'angularMoment',
  'tubenotes.groupVids'
])

.factory('AppFactory', function($http) {
  
  // This factory function will do a post request to our server to store a note in our database
  var addNote = function(commentText, timestamp) {
    note = {
      username: globalObj.username,
      videoUrl: 'youtube.com/embed/' + globalObj.currentVideo.id,
      videoTitle: globalObj.currentVideo.title,
      image: globalObj.currentVideo.image,
      commentText: commentText,
      timestamp: timestamp
    };

    $http.post('/comment-video', note);
  };
  
  // This will be accessed in all of our controllers as AppFactory
  var globalObj = {
    currentVideo: {},
    addNote: addNote,
    username: '',
    searchResults: []
  };

  return globalObj;
})

.controller('appController', function($scope, $http, $window, $location, AppFactory, Auth, GroupHandler) {
  $scope.currentVideo = 'https://www.youtube.com/embed/4ZAEBxGipoA';
  $scope.isLoggedIn = function() {
    return AppFactory.username !== '';
  };

  // Log the user out and reset the username 
  $scope.logout = function () {
    Auth.signout();
    AppFactory.username = '';
  };

  // This is to set the current video from the YouTube search and the library
  // 'video' comes from the youtube search and 'libVideo' comes from the users library of saved videos
  $scope.setCurrentVideo = function (video, libVideo, groupBool) {
    if (video) {
      AppFactory.currentVideo = {
        title: video.snippet.title,
        id: video.id.videoId,
        comments: [], 
        image: video.snippet.thumbnails.default.url
      };
    } else if (libVideo) {
      if (!libVideo.comments) {
        libVideo.comments = [];
      }
      AppFactory.currentVideo = {
        title: libVideo.title,
        id: libVideo.url.slice(18),
        comments: libVideo.comments,
        image: libVideo.image,
        videoTableId: libVideo.id
      };
    }

    if (groupBool) {
      $location.path('/watch').search({group: GroupHandler.currentGroup.groupname});
    }
    // Redirect the page to the watch route
    $location.path('/watch');
    // make asynchronous call to onYouTubeIframeAPIReady
    setTimeout(window.onYouTubeIframeAPIReady, 0);
  };

  $scope.searchYoutube = function(msg) {
    $http.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: window.YOUTUBE_API_KEY,
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        q: msg
      }
    })
    .success(function(data) {
      // $scope.videos = data.items;
      AppFactory.searchResults = data.items;
      $location.path('/search');
    })
    .error(function() {
      console.log('ERROR');
    });
  };
})
// Routing for app
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth/login.html',
      controller: 'AuthController',
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      authenticate: true
    })
    .when('/groups', {
      templateUrl: 'app/groups/groups.html',
      controller: 'GroupController',
      authenticate: true
    })
    .when('/groupVids', {
      templateUrl: 'app/groups/groupVids.html',
      controller: 'GroupVidsController',
      authenticate: true
    })
    .when('/watch', {
      templateUrl: 'app/watch/watch.html',
      controller: 'WatchController',
      authenticate: true
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      authenticate: true
    })   
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })    
    .when('/login', {
      templateUrl: 'app/auth/login.html',
      controller: 'AuthController'
    })
    .otherwise({
      redirectTo: '/login'
    });
  // We add our $httpInterceptor into the array
  // of interceptors. Think of it like middleware for your ajax calls
  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});