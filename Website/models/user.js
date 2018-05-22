
module.exports = (sequelize, DataTypes) => {

	var bcrypt = require('bcrypt');

	var User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		droits: {
			type: DataTypes.STRING,
			allowNull: false
		}
		}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}

	});

	User.prototype.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
	}

	User.prototype.sayHi = function () {
		console.log(this.username);
	}

	return User;
};