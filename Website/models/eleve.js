
module.exports = (sequelize, DataTypes) => {

	var Eleve = sequelize.define('eleve', {
		email: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey:true,
		},
		nom: {
			type: DataTypes.STRING
		},
		prenom: {
			type: DataTypes.STRING
		},
		promo: {
			type: DataTypes.STRING
		},
		groupe: {
			type: DataTypes.STRING
		},
		id_carte: {
			type: DataTypes.STRING,
			unqique:true,
			primaryKey:true

		},
	});

	// models : db et models.item : item reprends le nom du champ dans la db
	Eleve.associate = function (models) {
	    models.eleves.belongsTo(models.users, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	    
	    models.eleves.hasMany(models.presences, {
	    	foreignKey: 'id_carte',
	    	sourceKey:'id_carte',
	    	constraints: false
	    });

	    models.eleves.hasOne(models.cartes, {
	    	foreignKey: 'email',
	    	sourceKey: 'email',
	    	constraints: false
	    });

	};


	return Eleve;
};