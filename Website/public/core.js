
var myApp = angular
			.module('myApp',[])
			.controller('mainController', mainController);


function mainController($scope, $http) {

	// get pour récupérer la liste des presences d'un utilisateur
	$http.get('/getUserPresences')
		.success(function(data) {
			$scope.users_presences = data;
		})
		.error(function(data) {
			console.log('Erreur : ' + data)
		});


	// get pour récupérer la liste des utilisateurs
	$http.get('/getListeUtilisateurs')
		.success(function(data) {
			$scope.users = data;
		})
		.error(function(data) {
			console.log('Erreur : ' + data)
		});


	// get pour récupérer la liste des présences/absences
	$http.get('/getListePresences')
		.success(function(data) {
			$scope.presences = data;
			console.log(data);
		})
		.error(function(data) {
			// afficher l'erreur dans le gui
			console.log('Erreur : ' + data)
		});

/*
	// get pour récupérer la liste des présences/absences
	$http.get('/getListePresences2')
		.success(function(data) {
			$scope.presences = data;
			console.log(data);
		})
		.error(function(data) {
			// afficher l'erreur dans le gui
			console.log('Erreur : ' + data)
		});
*/

	// $scope.dataform = {};

	// crééer un élément dans une table
	/* ================================== plutot update
	$scope.createBLABLA function () {
		$http.post('route...', $scope.dataform)
			.success(function(data) {
				// logique de la fonction
				$scope.dataform = {};
				$scope.BLA = data;

			})
			.error(function(data) {
				console.log('Erreur : ' + data)
			});
	};
		
	*/
	// supprimer un élément d'un table
	$scope.supprimerUnUtilisateur = function(email) {
		$http.delete('/supprimerUnUtilisateur' + email)
			.success(function(data) {
				$scope.users = data;
			})
			.error(function(data) {
				console.log('Erreur : ' + data)
			});
	};

	// supprimer un élément d'un table =============================================================================
	$scope.supprimerUnePresence = function(user) {
		$http.delete('/supprimerUnePresence' + user)
			.success(function(data) {
				$scope.presence_a_supprimer = data;
				console.log(presence_a_supprimer);
			})
			.error(function(data) {
				console.log('Erreur : ' + data)
			});
	};
	
			
			
	};