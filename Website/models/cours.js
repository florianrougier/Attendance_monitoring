
module.exports = (sequelize, DataTypes) => {

	var Cours = sequelize.define('cours', {
		matiere: {
			type: DataTypes.STRING,
		},
		salle: {
			type: DataTypes.STRING
		},
		date: {
			type: DataTypes.DATE // ou DATEONLY ?
		},
		heure_debut: {
			type: DataTypes.TIME
		},
		heure_fin: {
			type: DataTypes.DATE
		},
		code_module: {
			type: DataTypes.STRING
		},
		groupe: {
			type: DataTypes.STRING
		},
		professeur: {
			type: DataTypes.STRING
		},
		module_groupe: {
			type: DataTypes.STRING
		}
	});

	Cours.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Cours;
};