
module.exports = (sequelize, DataTypes) => {

	var bcrypt = require('bcrypt');
	var password_generator = require('generate-password');
	var nodemailer = require('nodemailer');

	var password_generated;

	var User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			primaryKey: true,
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
			beforeValidate: (user) => {
				if (user.droits === 'admin' ) {

				} else {
					//var password_generated = password_generator.generate({length:8, numbers:true});
					password_generated = password_generator.generate({length:8, numbers:true});
					console.log("PASSWORD : " + password_generated);
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(password_generated, salt);
				}
			},
			beforeCreate: (user) => {
				if (user.droits === 'admin' ) {
					console.log('PASSWORD : ' + user.password);
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
					console.log('PASSWORD : ' + user.password);
				} else {
					//password_generated = password_generator.generate({length:8, numbers:true});
					//console.log("PASSWORD : " + password_generated);
					//const salt = bcrypt.genSaltSync();
					//user.password = bcrypt.hashSync(password_generated, salt);
				}
				
			},
			afterCreate: (user) => {
				/*var transporter = nodemailer.createTransport({
			        service: 'Outlook365',
			        auth: {
			            user: 'simon.negrier@epfedu.fr',
			            pass: 'StupidEKeV91.@'
			        }
			    });

				//console.log("INFOS : ");
				//console.log(user.getEleve());
				
				console.log("PASSWORD GENERATED : ");
				console.log(password_generated);

				var text = ' \n le mot de passe pour accéder à votre compte EPF Présence est : ' +  password_generated;

			    var mailOptions = {
			        from: 'simon.negrier@epfedu.fr',
			        to: user.email,
			        subject: 'Création de compte EPF Présence',
			        text: text
			    };

			    transporter.sendMail(mailOptions, function(error, info){
			        if (error) {
			            console.log(error);
			        } else {
			            console.log('Email envoyé : ' + info.response);
			        }
			    });*/
			}
		}

	});

	User.associate = function (models) {
	    models.users.hasOne(models.eleves, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.users.hasOne(models.professeurs, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });

	    models.users.hasOne(models.admins, {
	    	//onDelete: "CASCADE",
	    	foreignKey: 'email',
	    	constraints: false
	    });
	};


	User.prototype.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	}
/*
	// A ECRIRE
	// le prof doit pouvoir exclure un utilisateur
	User.prototype.exclureEleve = function () {
		if (this.droits === 'professeur') {

		}
	}

	// A ECRIRE
	// l'administration doit pouvoir modifier le statut de présence d'un élève
	User.prototype.modifierStatusUser = function () {
		if (this.droits === 'admin') {

		}
	}*/

	return User;
};