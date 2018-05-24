
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
		mail: {
			type: DataTypes.STRING
		},
		code_cours: {
			type: DataTypes.STRING
		}

	});

	Presence.associate = function (models) {
	    models.presences.hasOne(models.eleves, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.users.hasOne(models.professeurs, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	};

	return Presence;
};