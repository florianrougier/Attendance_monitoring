
module.exports = (sequelize, DataTypes) => {

	var Presence = sequelize.define('presence', {
		date: {
			type: DataTypes.DATE
		},
		heure_arrivee: {
			type: DataTypes.TIME
		},
		heure_depart: {
			type: DataTypes.TIME
		},
		statut: {
			type: DataTypes.STRING
		},
		mail_professeur: {
			type: DataTypes.STRING
		},
		mail_eleve: {
			type: DataTypes.STRING
		},
		module_groupe: {
			type: DataTypes.STRING
		}

	});

	Presence.prototype.sayHi = function () {
		console.log('HI !!!!!!!!!!!!');
	}

	return Presence;
};