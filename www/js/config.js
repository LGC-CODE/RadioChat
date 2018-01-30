app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html'
		}).state('station', {
			url: '/station/:id',
			templateUrl: 'station.html'
		}).state('accounts', {
			url: '/accounts',
			templateUrl: 'accounts.html'
		}).state('signup', {
			url: '/accounts/:id',
			templateUrl: 'signup.html'
		}).state('login', {
			url: '/login',
			templateUrl: 'login.html'
		}).state('user', {
			url: '/user',
			templateUrl: 'user.html'
		});
		
	$urlRouterProvider.otherwise('/home');
});