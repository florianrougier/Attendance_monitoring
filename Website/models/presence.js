
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
		id_carte: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		code_cours: {
			type: DataTypes.STRING,
			primaryKey:true
		}

	});

	Presence.associate = function (models) {
	    
	    models.presences.belongsTo(models.eleves, {
	    	foreignKey: 'id_carte',
	    	targetKey:'id_carte',
	    	constraints: false
	    });

	    
	    models.presences.belongsTo(models.professeurs, {
	    	foreignKey: 'id_carte',
	    	targetKey:'id_carte',
	    	constraints: false
	    });

	    
	    models.presences.belongsTo(models.courss, {
	    	foreignKey: 'code_cours',
	    	targetKey: 'code_cours',
	    	constraints: false
	    });


	    models.presences.hasOne(models.cartes, {
	    	foreignKey: 'id_carte',
	    	sourceKey:'id_carte',
	    	targetKey: 'id_carte',
	    	primaryKey: 'id_carte',
	    	constraints: false
	    });
	};

/*
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
	*/

	return Presence;
};