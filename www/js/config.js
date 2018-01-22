app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html'
		}).state('station', {
			url: '/station/:id',
			templateUrl: 'station.html'
		});

		
	$urlRouterProvider.otherwise('/home');
});