app.directive('modalTemplate', function(){
	return {
		restrict: 'E',
		scope: {modal: '=dataModal'},
		controller: ['$scope', '$firebase', '$state', '$ionicModal', function($scope, $firebase, $state, $ionicModal){
			console.log('popup loaded');
			$scope.updateUser = function(password){
				$firebase.updateUser(null, password).then(function(res){
					$state.go('home');
				}).catch(function(err){
					console.log(new Error(err));
				});
			};

			$scope.closeModal = function(){
				console.log('close');
			};
		}],
		templateUrl: '../../templates/modal.html'
	};
});