
module.exports = (sequelize, DataTypes) => {

	var Presence = sequelize.define('presence', {
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
		code_module_groupe: {
			type: DataTypes.STRING
		}

	});

	Presence.associate = function (models) {
	    models.presences.hasOne(models.eleves, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.presences.hasOne(models.professeurs, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.presences.belongsTo(models.courss, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'code_module_groupe',
	    	constraints: false
	    });
	};

	Presence.prototype.defineStatut = function () {
		// cas rien (absent)
		if(this.heure_arrivee === null) {
			console.log('l\'utilisateur est absent !');

		} else if((this.heure_arrivee.getMinutes() - this.courss.heure_debut.getMinutes()) > 5) { // cas retard
			console.log('retard !');

		} else { // cas present
			console.log('il y a eu un problème');
		}
	}

	return Presence;
};