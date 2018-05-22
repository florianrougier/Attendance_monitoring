
module.exports = (sequelize, DataTypes) => {

	var Professeur = sequelize.define('professeur', {
		email: {
			type: DataTypes.STRING,
			unique: true,
		},
		nom: {
			type: DataTypes.STRING
		},
		prenom: {
			type: DataTypes.STRING
		},
	});

	Professeur.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Professeur;
};