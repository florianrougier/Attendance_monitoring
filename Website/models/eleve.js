
module.exports = (sequelize, DataTypes) => {

	var Eleve = sequelize.define('eleve', {
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
		promo: {
			type: DataTypes.INTEGER
		},
		groupe: {
			type: DataTypes.STRING
		}

	});

	Eleve.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Eleve;
};