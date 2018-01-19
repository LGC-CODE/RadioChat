app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'home.html'
		});

	$urlRouterProvider.otherwise('/home');
});