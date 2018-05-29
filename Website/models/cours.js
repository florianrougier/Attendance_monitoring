
module.exports = (sequelize, DataTypes) => {

	var Cours = sequelize.define('cours', {
		matiere: {
			type: DataTypes.STRING,
		},
		salle: {
			type: DataTypes.STRING
		},
		date: {
			type: DataTypes.DATEONLY
		},
		heure_debut: {
			type: DataTypes.TIME
		},
		heure_fin: {
			type: DataTypes.TIME
		},
		code_module: {
			type: DataTypes.STRING
		},
		groupe: {
			type: DataTypes.STRING
		},
		code_module_groupe: {
			type: DataTypes.STRING
		},
		professeur_cours: {
			type: DataTypes.STRING
		},
		code_cours: {
			type: DataTypes.STRING,
		}
	},{
		hooks: {
			beforeCreate: (cours) => {
				cours.code_module_groupe = cours.code_module + cours.groupe + cours.code_cours;
			}
		}

	});

	Cours.associate = function (models) {
	    /*models.courss.belongsToMany(models.presences, {
	    	//onDelete: "CASCADE",
	    	through: models.eleves,
	    	foreignKey: 'id_carte',
	    	//sourceKey: 'code_module_groupe',
	    	constraints: false
	    });
/*
	    models.courss.belongsToMany(models.eleves, {
	    	//onDelete: "CASCADE",
	    	as: '',
	    	through : ,
	    	foreignKey: 'code_module_groupe',
	    	constraints: false
	    });*/

	    models.courss.belongsTo(models.professeurs, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'professeur_cours',
	    	constraints: false
	    });

	    models.courss.hasMany(models.presences, {
	    	foreignKey: 'code_module_groupe',
	    	constraints: false
	    })
	};

	return Cours;
};