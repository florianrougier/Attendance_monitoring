
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
			type: DataTypes.INTEGER
		},
		groupe: {
			type: DataTypes.STRING
		}

	});

	// models : db et models.item : item reprends le nom du champ dans la db
	Eleve.associate = function (models) {
	    models.eleves.belongsTo(models.users, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.eleves.hasMany(models.presences, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	};


	return Eleve;
};