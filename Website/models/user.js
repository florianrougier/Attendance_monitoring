
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
				var transporter = nodemailer.createTransport({
			        service: 'Outlook365',
			        auth: {
			            user: 'simon.negrier@epfedu.fr',
			            pass: 'StupidEKeV91.@'
			        }
			    });

				//console.log("INFOS : ");
				//console.log(user.getEleve());

				/*
				console.log("PASSWORD GENERATED : ");
				console.log(password_generated);

				console.log("VARIABLES DE USER : ");
				console.log(user);
				*/

				/*var text = ' \n le mot de passe pour accéder à votre compte EPF Présence est : ' +  password_generated;

				// créer un compte de test avant
			    var mailOptions = {
			        from: 'simon.negrier@epfedu.fr',
			        to: user.email, // !!!!!!!!!!!!!!!! variable user.email
			        subject: 'Sending Email using Node.js',
			        text: text
			    };

			    console.log('debut test \n');

			    transporter.sendMail(mailOptions, function(error, info){
			        if (error) {
			            console.log(error);
			        } else {
			            console.log('Email sent: ' + info.response);
			        }
			    });*/

			    console.log('fin du test \n');
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
	};


	User.prototype.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	}

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
	}

	return User;
};