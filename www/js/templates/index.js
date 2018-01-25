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
	};

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
		return stations.hosts[id] ? stations.hosts[id].audioPlayer : false;
	};

	stations.setNowPlaying = function(id){
		console.log('now playing id:', id);
		stations.nowPlayingId = id;
	};

	return stations;
}]);

app.factory('$page', [function(){
	var page = { title: '', isPlaying: ''};

	page.setTitle = function(title){
		page.title = title;
	};

	page.setAudioStatus = function(status){
		page.isPlaying = status;
	}

	page.getTitle = function(){
		return page.title;
	};

	page.getAudioStatus = function(){
		return page.isPlaying;
	};

	return page;
}]);



app.directive('navTitle', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$page', '$stations', function($scope, $page, $stations){
			$scope.page = $page.getTitle;
			$scope.$watch(function(){ return $page.isPlaying }, function(newStatus){
				$scope.isPlaying = newStatus;
			});
		}],
		templateUrl: '../../templates/navTitle.html'
	};
});

app.directive('navAudioPlayer', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$stations', '$page', function($scope, $stations, $page){
			$scope.$watchCollection(function(){ return { stationId: $stations.nowPlayingId, isPlaying: $stations.getStation($stations.nowPlayingId).isPlaying }; }, function(newStation, oldStation){
						var audio = $stations.loadAudio($stations.nowPlayingId);
						var station = $stations.getStation(newStation.stationId);

						$scope.isPlaying = newStation.isPlaying;
						$page.setAudioStatus(newStation.isPlaying);

						$scope.stop = function(){
							audio.pause();
							audio.load();
							audio = $stations.saveAudio(newStation.stationId, new Audio(station.stationUrl));
							$scope.isPlaying = $stations.audioStatus(newStation.stationId, false);
							$stations.nowPlayingId = oldStation.stationId;
							$page.setTitle('Radio Chat');
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
		scope: {stationId: '='},
		controller: ['$scope', '$stations', '$stateParams', '$page', function($scope, $stations, $stateParams, $page){
			var stationId = $stateParams.id || $scope.stationId;
			var station = $stations.getStation(stationId);

			var audio = $stations.loadAudio(stationId);

			if(!audio) audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));

			this.station = station;
			this.audio = audio;
			this.$page = $page;

				$scope.$watch(function(){ return station.isPlaying; }, function(newVal, oldVal){
					$scope.isPlaying = $stations.getAudioStatus(stationId);
				});

				$scope.$watch(function(){ return $stations.nowPlayingId; }, function(newVal, oldVal){
					if(oldVal === stationId && oldVal !== newVal){
						audio.pause();
						$scope.isPlaying = $stations.audioStatus(stationId, false);
					} 
				});

				$scope.isPlaying = $stations.getAudioStatus(stationId);

				$scope.play = function(){
					audio.play();
					$scope.isPlaying = $stations.audioStatus(stationId, true);
					$stations.setNowPlaying(stationId);
					$page.setTitle(station.stationName);
					$page.setAudioStatus($scope.isPlaying);
				};

				$scope.stop = function(){
					audio.pause();
					//audio = $stations.saveAudio(stationId, new Audio(station.stationUrl));
					//audio.load();
					$scope.isPlaying = $stations.audioStatus(stationId, false);
					$stations.setNowPlaying(stationId);
					$page.setTitle('Radio Chat');
					$page.setAudioStatus($scope.isPlaying);
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
		restrict: 'E',
		scope: {},
		controller: ['$scope', function($scope){

		}],
		templateUrl: '../../templates/station.html'
	};
});





