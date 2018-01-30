app.directive('accountsTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$firebase', '$state',function($scope, $firebase, $state){
			$scope.providers = [
				{name: 'Google', icon: 'ion-social-google'}, 
				{name: 'Email', icon: 'ion-ios-person'},
				{name: 'Sonidero', icon: 'ion-headphone'}
			];
		}],
		templateUrl: '../../templates/accounts/accounts.html'
	};
});

app.directive('uploadTemplate', function(){
	return {
		restrict: 'E',
		scope: { file: '=' },
		link: function(scope, elem, attrs){
			console.log(elem);
			console.log(scope.file);
			//elem.children[0].children.file.bind('change', function(event){
			//	console.log(event, 'event');

			//});

			elem.bind('change', function(event){
				console.log(event, 'elem changed');
				var file = event.target.files[0];
				if(file && typeof(file) !== undefined && file.size > 0){
					scope.file = file;
					scope.$apply();
				} else {
					scope.file = {};
				}
			});
			// el.bind('change', function(event){
			// 	console.log(event, 'event');
			// 	console.log(scope.file);
			// 	var files = event.target.files;
			// 	var file = files[0];
			// 	if(file && typeof(file) !== undefined && file.size > 0){
			// 		scope.file = file;
			// 		scope.$parent.file = file;
			// 		console.log(scope.$parent, 'parent');
			// 		scope.$apply();
			// 	} else {
			// 		scope.file = {};
			// 		scope.$parent.file = {};
			// 	}
			// });
		},
		templateUrl: '../../templates/uploadTemplate.html'
	};
});

app.directive('signupTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$firebase', '$stateParams', '$ionicModal', '$state', function($scope, $firebase, $stateParams, $ionicModal, $state){
			var station = {
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
		};
			
			$scope.signup = function(user){
				if(user){
					$firebase.createUser(user).then(function(){
						$firebase.app.auth().currentUser.sendEmailVerification({url: 'http://localhost:8100/#/home'});
					}).catch(function(err){
						console.log(err.message);
						$scope.error = err;
						$scope.$apply();
					});
				}
			};

			$ionicModal.fromTemplateUrl('../templates/modal.html', {scope: $scope, animation: 'slide-in-up'} ).then(function(modal){
				$scope.modal = modal;
				$scope.updateUser = function(password){
					$firebase.updateUser(null, password).then(function(data){
						console.log('updated password', data);
						$scope.modal.hide();
						$state.go('home');
					}).catch(function(err){
						console.log(new Error(err));
					});
				};

			});

			$scope.googleSignup = function(){
				$firebase.googleSignup().then(function(){
					var provider = new firebase.auth.GoogleAuthProvider();

					$firebase.app.auth().signInWithPopup(provider).then(function(res){

						console.log(res, 'google response');
						$firebase.currentUser = res;
						$scope.modal.show();

					}).catch(function(err){
						console.log(new Error(err));
					});

				});
			};


			$ionicModal.fromTemplateUrl('../templates/sonideroModal.html', {scope: $scope, animation: 'slide-in-up'} ).then(function(modal){
				$scope.sonideroModal = modal;
				$scope.user = {};
				//console.log(modal);

				//$scope.currentUser = $firebase.app.auth().currentUser;

				$scope.sonideroCreateProfile = function(user){
					console.log(user);
					console.log($scope.user.coverImage, 'image loaded');
					
					$firebase.app.storage().ref()
						.child('images/image.jpg')
						.put($scope.user.coverImage).then(function(snapshot) {
							console.log('Uploaded a blob or file!' , snapshot);
						}).catch(function(err){
							console.log(new Error(err.message));
						});

				};
			});

			$scope.sonideroSignup = function(user){
				if(user){
					// $firebase.createUser(user).then(function(){
					// 	$firebase.app.auth().currentUser.sendEmailVerification({url: 'http://localhost:8100/#/home'});
					// 	$scope.sonideroModal.show();
					// }).catch(function(err){
					// 	console.log(err.message);
					// 	$scope.error = err;
					// 	$scope.$apply();
					// });
					console.log(user);
					$scope.sonideroModal.show();
				}
			};

			$scope.closeModal = function(){
				$scope.modal.hide();
			};

			$scope.provider = $stateParams.id;
			console.log($scope.provider);
		}],
		templateUrl: '../../templates/accounts/signup.html'
	};
});

app.directive('loginTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$firebase', '$state', function($scope, $firebase, $state){
			$scope.login = function(user){
				$firebase.login(user).then(function() {
			    	$firebase.app.auth().signInWithEmailAndPassword(user.email, user.password)
							.then(function(res){ 
								console.log('success current user : ', $firebase.app.auth().currentUser); 
								$firebase.currentUser = res; 
								$state.go('home');
							}).catch(function(err){ throw new Error(err); }); 
			  	});	;
			};
		}],
		templateUrl: '../../templates/accounts/login.html'
	};
});

app.directive('userTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$firebase', function($scope, $firebase){
			$scope.user = $firebase.currentUser;
			$scope.sentVerification = false;
			$scope.updateUser = function(name){
				$firebase.updateUser(name).then(function(res){
					$scope.currentUser = $firebase.app.auth().currentUser;
					$scope.$apply();
				});
			};

			$scope.resendVerification = function(){
				$firebase.app.auth().currentUser.sendEmailVerification({url: 'http://localhost:8100/#/home'});
				$scope.sentVerification = true;
			};
		}],
		templateUrl: '../../templates/accounts/user.html'
	};
});








