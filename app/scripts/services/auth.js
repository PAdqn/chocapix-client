'use strict';

angular.module('bars.auth', [
	'ngStorage',
	'bars.API'
])

// cannot inject $http directly because it would cause a conflict when registering AuthInterceptor
.factory('AuthService', ['$injector', '$sessionStorage', '$q', 'API',
	function ($injector, $sessionStorage, $q, API) {
		if ($sessionStorage.auth === undefined) {
			$sessionStorage.auth = {
				token: null
			};
		}
		return {
			login: function(credentials, resultLogin) {
				return $injector.get('$http').post(API.route('../nobar/auth/login'), credentials).then(
					function(response) {
						$sessionStorage.auth.token = response.data.token;
						return response.data.user;
					},
					function(response) {
						$sessionStorage.auth.token = null;
						return $q.reject();
					});
			},
			logout: function() {
				$sessionStorage.auth.token = null;
			},
			isAuthenticated: function() {
				return $sessionStorage.auth.token != null;
			},
			getToken: function() {
				return $sessionStorage.auth.token;
			}
		};
}])

.factory('AuthInterceptor', ['AuthService', '$q',
	function (AuthService, $q) {
		return {
			request: function(config) {
				// config.headers = config.headers || {};
				// if (AuthService.isAuthenticated()) {
				// 	config.headers.Authorization = 'Bearer ' + AuthService.getToken();
				// }

				config.params = config.params || {};
				// to improve: necessary for ui.bootstrap ; and the token is useless for static files
				if (AuthService.isAuthenticated() && /^((http)|[^a-z])/.test(config.url)) {
					config.params["bearer"] = AuthService.getToken();
				}
				return config || $q.when(config);
			},
			response: function(response) {
				if (response.status === 401) {
					AuthService.logout();
					// TODO: Redirect user to login page.
				}
				return response || $q.when(response);
			}
		};
}]);
