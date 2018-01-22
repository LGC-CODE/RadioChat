app.factory('$stations', ['$http', function($http){
	var stations = {
		nowPlayingId: '0'
	};

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
		stations.hosts[id].audioPlayer.id = id;
		return stations.hosts[id].audioPlayer;

	};

	stations.loadAudio = function(id){
		return stations.hosts[id].audioPlayer;
	};

	stations.setNowPlaying = function(id){
		stations.nowPlayingId = id;
	};

	return stations;
}]);

app.factory('$page', [function(){
	var page = { title: '' };

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
			$scope.page = $page.getTitle;
		}],
		templateUrl: '../../templates/navTitle.html'
	};
});

app.directive('navAudioPlayer', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$stations', function($scope, $stations){
			$scope.$watch(function(){ return $stations.nowPlayingId; }, function(newVal, oldVal){
				console.log(newVal, oldVal, 'new value scanned');
						var stationId = $stations.nowPlayingId;
						var station = $stations.getStation(stationId);
						var audio = $stations.loadAudio(stationId);


						$scope.$watch(function(){ return station.isPlaying; }, function(newVal, oldVal){
							$scope.isPlaying = $stations.getAudioStatus(stationId);
						});

						$scope.play = function(){
							audio.play();
							$scope.isPlaying = $stations.audioStatus(stationId, true);
						};

						$scope.stop = function(){
							audio.pause();
							audio.load();
							audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));
							$scope.isPlaying = $stations.audioStatus(stationId, false);
						};
				
			});

		}],
		templateUrl: '../../templates/navAudioPlayer.html'
	};
});

app.directive('homeTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$ionicSideMenuDelegate', '$stations', '$page', function($scope, $ionicSideMenuDelegate, $stations, $page){

			$page.setTitle('Radio Chat');

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
		controller: ['$scope', '$stations', '$stateParams', '$page', function($scope, $stations, $stateParams, $page){
			var stationId = $stateParams.id || $scope.stationId;
			console.log($stations.getStation($scope.stationId), $scope.stationId);
			var station = $stations.getStation(stationId);

			var audio = $stations.loadAudio(stationId);

			if(!audio) audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));

			this.station = station;
			this.audio = audio;
			this.$page = $page;

				$scope.$watch(function(){ return station.isPlaying; }, function(newVal, oldVal){
					console.log(newVal, oldVal, 'is playing');

					$scope.isPlaying = $stations.getAudioStatus(stationId);

				});
				$scope.isPlaying = $stations.getAudioStatus(stationId);

				$scope.play = function(){
					audio.play();
					$scope.isPlaying = $stations.audioStatus(stationId, true);
					$stations.setNowPlaying(stationId);
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
			audioCtrl.$page.setTitle(audioCtrl.station.stationName);

			scope.toggleLeft = function() {
			    $ionicSideMenuDelegate.toggleLeft();
			};
		},
		templateUrl: '../../templates/station.html'
	};
});





