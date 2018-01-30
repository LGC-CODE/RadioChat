app.factory('$firebase', ['$http', function($http){
	var firebase_api = { app: '', account: '', currentUser: ''};

	var config = {
		    apiKey: "AIzaSyAXMJkXBvLOcX5sjliP_WWQWcPSY8LwNC4",
		    authDomain: "radioclouddrop.firebaseapp.com",
		    databaseURL: "https://radioclouddrop.firebaseio.com",
		    projectId: "radioclouddrop",
		    storageBucket: "radioclouddrop.appspot.com",
		    messagingSenderId: "722063736454"
		};
		
	firebase_api.app = firebase.initializeApp(config, 'radioclouddrop');

	firebase_api.createUser = function(user){
		var validEmail = user ? /\w*\@\w*\.\w*/.test(user.email) : false;
		if(validEmail && user.password) {
			return firebase_api.app.auth().createUserWithEmailAndPassword(user.email, user.password);
		} else {
			alert('invalid email or password');
		}
	};

	firebase_api.login = function(user){
		var validEmail = user ? /\w*\@\w*\.\w*/.test(user.email) : false;
		if(validEmail && user.password) {
			return firebase_api.app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		} else {
			alert('invalid email or password');
		}
	};

	firebase_api.googleSignup = function(){
		return firebase_api.app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
	};

	firebase_api.updateUser = function(name, password){
		console.log(name);
		if(name){
			return firebase_api.app.auth().currentUser.updateProfile({ displayName: name });
		} else if(password){
			return firebase_api.app.auth().currentUser.updatePassword(password);
		}
	};

	return firebase_api;
}]);












