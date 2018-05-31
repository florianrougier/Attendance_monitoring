
module.exports = (sequelize, DataTypes) => {

	var Carte = sequelize.define('carte', {
		email: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey:true,
		},
		id_carte: {
			type: DataTypes.STRING,
			unqique:true,
			primaryKey:true
		}

	});

	// models : db et models.item : item reprends le nom du champ dans la db
	Carte.associate = function (models) {
	    models.cartes.belongsTo(models.eleves, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.cartes.belongsTo(models.professeurs, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	    
	    models.cartes.belongsTo(models.presences, {
	    	foreignKey: 'id_carte',
	    	sourceKey:'id_carte',
	    	targetKey: 'id_carte',
	    	primaryKey: 'id_carte',
	    	constraints: false
	    });

	    models.cartes.hasMany(models.presences, {
	    	as : 'presences_eleve',
	    	foreignKey: 'id_carte',
	    	sourceKey:'id_carte',
	    	constraints: false
	    });

	};


	return Carte;
};