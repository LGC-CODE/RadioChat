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
		scope: {path: '=', imageUrl: '='},
		link: function(scope, elem, attrs){

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
		},
		controller: ['$scope', '$firebase', '$document', '$ionicLoading',function($scope, $firebase, $document, $ionicLoading){
			$scope.isFileUploaded = false;
			$scope.upload = function(){
				var uploadElement = $document[0].getElementById('upload').click();
				console.log(uploadElement);
			};

			$scope.$watch('file', function(newFile, oldFile){
				console.log('new file detected', newFile, oldFile);
				if(newFile && newFile.size > 0) {

					$ionicLoading.show({
						template: '<ion-spinner class="loading-spinner spinner-light" icon="ripple"></ion-spinner>',
					});

					var uid = $firebase.app.auth().currentUser.uid;
					console.log(newFile, 'file detected');
					$firebase.app.storage().ref()
						.child('images/'+ uid + '/' + newFile.name)
						.put(newFile).then(function(snapshot) {
							console.log('Uploaded a blob or file!' , snapshot.metadata);
							$scope.isFileUploaded = snapshot.metadata;
							$scope.path = snapshot.metadata.fullPath;
							$scope.imageUrl = snapshot.metadata.downloadURLs[0];
							$ionicLoading.hide();
							$scope.$apply();
						}).catch(function(err){
							console.log(new Error(err.message));
						});
				}
			});

			$scope.$watch('imageUrl', function(newFile, oldFile){
				if(newFile) {
					$scope.isFileUploaded = { downloadURLs: [$scope.imageUrl] };
				} else {
					$scope.isFileUploaded = false;
				}
			});
			
			$scope.removeFile = function(){
				console.log($scope.isFileUploaded.fullPath);
				$firebase.app.storage().ref().child($scope.path)
					.delete()
					.then(function(){
						$scope.isFileUploaded = false;
						$scope.file = {};
						$scope.imageUrl = '';
						$scope.$apply();
					})
					.catch(function(err){
						console.log(new Error(err));
					});
			};
		}],
		templateUrl: '../../templates/uploadTemplate.html'
	};
});

app.directive('signupTemplate', function(){
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope', '$firebase', '$stateParams', '$ionicModal', '$state', function($scope, $firebase, $stateParams, $ionicModal, $state){
			
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

			$scope.sonideroCreateProfile = function(stationName){
					var user = {};
					var userFolder = stationName.split(' ').join('').toLowerCase();
					var chatRoom = [];

					user.stationName = stationName;
					user.isActive = false;
					user._id = $firebase.app.auth().currentUser.uid;
					user.isPlaying = '';
					user.avatar = '';
					user.audioPlayer = '';
					user.comments = [];
					user.subStationName = '';
					user.stationDescription = '';
					user.stationUrl = '';
					user.facebookUrl = '';

					//create user profile by uid
					$firebase.app.database().ref('users/' + user._id).set(user).then(function(){
						console.log('user processing done.');
					});

					// //create user chat databse by uid
					$firebase.app.database().ref('chats/' + user._id + '/messages').set(chatRoom).then(function(){
						console.log('chat processing done.');
					});
				};

			$scope.sonideroSignup = function(user){
				console.log(user);
				if(user){
					$firebase.createUser(user).then(function(){
						$firebase.app.auth().currentUser.sendEmailVerification({url: 'http://localhost:8100/#/home'});
						$scope.sonideroCreateProfile(user.stationName);
						$state.go('user');
					}).catch(function(err){
						console.log(new Error(err));
						console.log(err.message);
						$scope.error = err;
						$scope.$apply();
					});
					console.log(user);
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
			  	});
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
			$scope.authUser = '';

			$firebase.app.auth().onAuthStateChanged(function(user) {
				$scope.authUser = $firebase.app.auth().currentUser;
				if($scope.authUser){
					$firebase.app.database().ref('users/' + $scope.authUser.uid).once('value').then(function(data){
						console.log(data.val(), 'value from database');
						$scope.user = data.val();
						$scope.isSonidero = data.val() ? true : '';
						$scope.isFileUploaded = true;
						console.log($scope.isSonidero, 'sonidero ?');
						$scope.$apply();
					});
				}
			});
			$scope.isFileUploaded = false;
			console.log($scope.currentUser, 'current user');

			$scope.sentVerification = false;
			$scope.updateUser = function(name){
				if(name){
					$firebase.updateUser(name).then(function(res){
						$scope.currentUser = $firebase.app.auth().currentUser;
						$scope.$apply();
					});
				} else {
					console.log('no name');
				}
			};

			$scope.resendVerification = function(){
				$firebase.app.auth().currentUser.sendEmailVerification({url: 'http://localhost:8100/#/home'});
				$scope.sentVerification = true;
			};

			$scope.sonideroUpdateProfile = function(user, authUser){
				if(authUser.name){
					$firebase.updateUser(authUser.name).then(function(res){
						$scope.currentUser = $firebase.app.auth().currentUser;
						$scope.$apply();
					});
				}

				$firebase.app.database().ref('users/' + $scope.authUser.uid).update(user).then(function(data){
					console.log(data, 'update response');
				}).catch(function(err){
					console.log(new Error(err));
				});
				console.log(user, 'profile sonidero updated');
			};
		}],
		templateUrl: '../../templates/accounts/user.html'
	};
});








