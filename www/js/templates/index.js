app.factory('$stations', ['$http', function($http){
	var stations = {};

	stations.hosts = [
		{
			avatar: 'http://animals.sandiegozoo.org/sites/default/files/2016-08/animals_hero_reindeer.jpg',
			stationName: 'El Leon Sonidero',
			subStationName: 'El mejor ruido del siglo!',
			coverImage: 'http://animals.sandiegozoo.org/sites/default/files/2016-08/animals_hero_reindeer.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://hyades.shoutca.st:8043/stream',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com'
		},{
			avatar: 'img/tigreazul.jpg',
			stationName: 'Tigre Sonidero',
			subStationName: 'Estacion En Vivo',
			coverImage: 'img/tigre2.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://incompetech.com/music/royalty-free/mp3-royaltyfree/Miami%20Nights%20-%20Extended%20Theme.mp3',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com'
		},{
			avatar: 'http://www.driven.co.nz/media/137800/forgiato-sema-ferrari-tec-2-4-1.jpg',
			stationName: 'Lagarto Sonidero',
			subStationName: 'Los Mejores del Milenio!',
			coverImage: 'http://www.driven.co.nz/media/137800/forgiato-sema-ferrari-tec-2-4-1.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://hyades.shoutca.st:8043/stream',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com'
		}
	];

	return stations;
}]);

app.directive('homeTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$ionicSideMenuDelegate', '$stations', function($scope, $ionicSideMenuDelegate, $stations){
			$scope.page = {
				title: 'Radio Chat'
			};

			$scope.toggleLeft = function() {
			    $ionicSideMenuDelegate.toggleLeft();
		    };

		    $scope.stations = $stations.hosts;

		}],
		templateUrl: '../../templates/home.html'
	};
});

app.directive('audioPlayer', function(){
	return {
		restrict: 'E',
		scope: {stationUrl: '=stationUrl'},
		controller: ['$scope', '$document', function($scope, $document){
			console.log($document);
			$scope.isPlaying = false;

			$scope.audio =  new Audio($scope.stationUrl);

			$scope.play = function(){
				$scope.audio.load();
				$scope.audio.play();
			};

			$scope.stop = function(){
				$scope.audio.pause();
			}


			$scope.page = { title: 'Radio Chat' };

			console.log($scope.stationUrl);

			$scope.toggleLeft = function() {
			    $ionicSideMenuDelegate.toggleLeft();
		    };



		}],
		templateUrl: '../../templates/audio-player.html'
	};
});





