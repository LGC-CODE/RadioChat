app.factory('$stations', ['$http', function($http){
	var stations = {};

	stations.hosts = [
		{
			_id: 'fgi4bihjwkj34knwlkn34',
			isPlaying: '',
			avatar: 'http://animals.sandiegozoo.org/sites/default/files/2016-08/animals_hero_reindeer.jpg',
			stationName: 'El Leon Sonidero',
			subStationName: 'El mejor ruido del siglo!',
			coverImage: 'http://animals.sandiegozoo.org/sites/default/files/2016-08/animals_hero_reindeer.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://hyades.shoutca.st:8043/stream',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com',
			audioPlayer: '',
			comments: [{
				from: 'Luis',
				message: 'muy buena estacion!'
			},{
				from: 'Jessie',
				message: 'muy buena estacion!'
			},{
				from: 'Tori',
				message: 'muy buena estacion!'
			}]
		},{
			_id: 'bihjwkj34knwffsrwr3',
			isPlaying: '',
			avatar: 'img/tigreazul.jpg',
			stationName: 'Tigre Sonidero',
			subStationName: 'Estacion En Vivo',
			coverImage: 'img/tigre2.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://incompetech.com/music/royalty-free/mp3-royaltyfree/Miami%20Nights%20-%20Extended%20Theme.mp3',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com',
			audioPlayer: '',
			comments: [{
				from: 'Luis',
				message: 'muy buena estacion!'
			},{
				from: 'Jessie',
				message: 'muy buena estacion!'
			},{
				from: 'Tori',
				message: 'muy buena estacion!'
			}]
		},{
			_id: 'jk34bk34bk34kjk43434343',
			isPlaying: '',
			avatar: 'http://www.driven.co.nz/media/137800/forgiato-sema-ferrari-tec-2-4-1.jpg',
			stationName: 'Lagarto Sonidero',
			subStationName: 'Los Mejores del Milenio!',
			coverImage: 'http://www.driven.co.nz/media/137800/forgiato-sema-ferrari-tec-2-4-1.jpg',
			stationDescription: 'Las mejores cumbias sonideras, haz click para escuchar la estacion en vivo! No se olviden dejar sus commentarios!',
			stationUrl: 'http://hyades.shoutca.st:8043/stream',
			facebookUrl: 'http://www.facebook.com',
			chatUrl: 'http://msgstar.herokuapp.com',
			audioPlayer: '',
			comments: [{
				from: 'Luis',
				message: 'muy buena estacion!'
			},{
				from: 'Jessie',
				message: 'muy buena estacion!'
			},{
				from: 'Tori',
				message: 'muy buena estacion!'
			}]
		}
	];

	stations.audioStatus = function(id, status){
		stations.hosts[id].isPlaying = status;
		return status;
	};

	stations.getAudioStatus = function(id){
		return stations.hosts[id].isPlaying;
	}

	stations.getStation = function(id){
		return stations.hosts[id];
	};

	stations.saveAudio = function(id, audioPlayer){
		stations.hosts[id].audioPlayer = audioPlayer;
		stations.hosts[id].audioPlayer.preload = 'metadata';
		return stations.hosts[id].audioPlayer;

	};

	stations.loadAudio = function(id){
		return stations.hosts[id].audioPlayer;
	};

	return stations;
}]);

app.factory('$page', ['$http', function($http){
	var page = {};

	page.title = 'Home';

	page.setTitle = function(title){
		page.title = title;
	};

	page.getTitle = function(){
		return page.title;
	};

	return page;
}]);



app.directive('navTitle', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$page', function($scope, $page){
			$scope.page = $page.getTitle();
		}],
		templateUrl: '../../templates/navBar.html'
	};
});

app.directive('homeTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$ionicSideMenuDelegate', '$stations', function($scope, $ionicSideMenuDelegate, $stations){

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
		transclude: true,
		scope: {stationId: '='},
		controller: ['$scope', '$stations', '$stateParams',function($scope, $stations, $stateParams){
			var stationId = $stateParams.id || $scope.stationId;
			console.log($stations.getStation($scope.stationId), $scope.stationId);
			var station = $stations.getStation(stationId);

			var audio = $stations.loadAudio(stationId);

			if(!audio) audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));

			this.station = station;
			this.audio = audio;

				$scope.isPlaying = $stations.getAudioStatus(stationId);

				$scope.play = function(){
					audio.play();
					$scope.isPlaying = $stations.audioStatus(stationId, true);
					console.log($scope.isPlaying);
				};

				$scope.stop = function(){
					audio.pause();
					audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));
					audio.load();
					$scope.isPlaying = $stations.audioStatus(stationId, false);
				};

				$scope.toggleLeft = function() {
				    $ionicSideMenuDelegate.toggleLeft();
			    };

		}],
		templateUrl: '../../templates/audio-player.html'
	};
});

app.directive('stationTemplate', function(){
	return {
		require:'^audioPlayer',
		restrict: 'AE',
		transclude: true,
		scope: {},
		link: function(scope, elem, attrs, audioCtrl){
			// scope.station = '';
			// scope.isPlaying = !audioCtrl.audio.paused;
			scope.page = { title: 'Radio Chat' };

			scope.toggleLeft = function() {
			    $ionicSideMenuDelegate.toggleLeft();
			};
		},
		templateUrl: '../../templates/station.html'
	};
});





