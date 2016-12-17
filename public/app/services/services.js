angular.module('tubenotes.services', [])

// Factory for handling authentication 
.factory('Auth', function ($http, $location, $window) {
  var login = function (user) {
    return $http({
      method: 'POST',
      url: '/users/login',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.tubenotes');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.tubenotes');
    $location.path('/signin');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})
.factory('GroupHandler', function ($http, $location, $window, AppFactory) {
  var postGroup = function(groupname) {
    return $http({
      method: 'POST',
      url: '/groups',
      data: JSON.stringify({groupname: groupname}),
    })
    .then(function (resp) {
      console.log(resp);
    });
  };

  var getGroups = function() {
    return $http({
      method: 'GET',
      url: '/groups',
    }).then(function(response) {
      return response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  var joinGroup = function(group) {
    return $http({
      method: 'POST',
      url: '/groupUsers',
      data: JSON.stringify({username: AppFactory.username, groupId: group})
    }).then(function(response) {
      return response.data;
    }).catch(function(err) {
      console.log(err);
    }); 
  };

  //post from the watch page
  var postGroupVid = function(groupname, vid) {
    return $http({
      method: 'POST',
      url: '/groupVids',
      data: JSON.stringify({
        groupname: groupname, 
        video: vid,
        username: AppFactory.username
      })
    }).then(function(response) {
      return response.data;
    }).catch(function(err) {
      console.log(err);
    }); 
  };

  //get from the groupvids page
  var getGroupVids = function(groupId) {
    return $http({
      method: 'GET',
      url: '/groupVids',
      params: {groupId: groupId} 
    }).then(function(response) {
      return response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  var getUserGroups = function(user) {
    return $http({
      method: 'GET',
      url: '/groupUsers',
      params: {username: user} 
    }).then(function(response) {
      return response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  var postGroupComment = function(groupId, note, startTime) {
    return $http({
      method: 'POST',
      url: '/groupComments',
      data: JSON.stringify({
        username: AppFactory.username, 
        video: AppFactory.currentVideo,
        note: note,
        startTime: startTime,
        groupId: groupId
      })
    }).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.log(err);
    });
  };

  var getGroupComments = function(groupId) {
    return $http({
      method: 'GET',
      url: '/groupComments',
      params: {groupId: groupId} 
    }).then(function(response) {
      console.log(response.data);
      return response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  return {
    currentGroup: {}, //current group object
    groups: [], //list of the current user's groups

    postGroup: postGroup,
    getGroups: getGroups,

    postGroupVid: postGroupVid, 
    getGroupVids: getGroupVids,

    joinGroup: joinGroup,
    getUserGroups: getUserGroups,

    postGroupComment: postGroupComment,
    getGroupComments: getGroupComments
  };
});