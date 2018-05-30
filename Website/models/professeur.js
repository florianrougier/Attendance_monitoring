
module.exports = (sequelize, DataTypes) => {

	var Professeur = sequelize.define('professeur', {
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			primaryKey: true
		},
		nom: {
			type: DataTypes.STRING,
			allowNull: false
		},
		prenom: {
			type: DataTypes.STRING,
			allowNull: false
		},
		id_carte: {
			type: DataTypes.STRING
		}
	});


	Professeur.associate = function (models) {
	    models.professeurs.belongsTo(models.users, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    
	    models.professeurs.hasMany(models.presences, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'id_carte',
	    	sourceKey:'id_carte',
	    	constraints: false
	    });

	    models.professeurs.hasOne(models.cartes, {
	    	foreignKey: 'email',
	    	sourceKey: 'email',
	    	constraints: false
	    })

	    
	    models.professeurs.hasMany(models.courss, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	sourceKey: 'email',
	    	constraints: false
	    });
	};

	return Professeur;
};