
module.exports = (sequelize, DataTypes) => {

	var Eleve = sequelize.define('eleve', {
		username:{
			type: DataTypes.STRING,
			unique: true,
		},

	});

	Eleve.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Eleve;
};