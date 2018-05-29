
var myApp = angular
			.module('myApp',[])
			.controller('mainController', mainController);


function mainController($scope, $http) {

	$scope.dataform = {};

	// ========== TODO : ==============
	// get les informations de présence
	// delete absence
	// post status
	// create user
	// create cours
	// delete cours

	// get pour récupérer la liste des utilisateurs
	$http.get('/getListeUtilisateurs')
		.success(function(data) {
			$scope.users = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Erreur : ' + data)
		});

/*
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
*/

	// crééer un élément dans une table
	/*
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
	
			
			
	};