
module.exports = (sequelize, DataTypes) => {

	var Admin = sequelize.define('admin', {
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
	});


	Admin.associate = function (models) {
	    models.admins.belongsTo(models.users, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	};

	return Admin;
};