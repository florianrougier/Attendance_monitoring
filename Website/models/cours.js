
module.exports = (sequelize, DataTypes) => {

	var Cours = sequelize.define('cours', {
		matiere: {
			type: DataTypes.STRING,
		},
		salle: {
			type: DataTypes.STRING
		},
		date: {
			type: DataTypes.DATEONLY // ou DATEONLY ?
		},
		heure_debut: {
			type: DataTypes.TIME
		},
		heure_fin: {
			type: DataTypes.TIME
		},
		code_module: {
			type: DataTypes.STRING
		},
		groupe: {
			type: DataTypes.STRING
		},
		code_module_groupe: {
			type: DataTypes.STRING
		},
		professeur: {
			type: DataTypes.STRING
		},
		code_cours: {
			type: DataTypes.STRING,
		}
	},{
		hooks: {
			beforeCreate: (cours) => {
				cours.code_module_groupe = cours.code_module + cours.groupe + cours.code_cours;
			}
		}

	});

	Cours.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Cours;
};