var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// crée une instance sequelize avec les informations de la base de donnée locale
var sequelize = new Sequelize('postgres://postgres@localhost:5432/projetmin', {
	dialect: 'postgres',
	operatorsAliases: false,
	define: {
        timestamps: false
     }
    });

db = {};


db['eleves'] =  sequelize.import(__dirname + '/eleve');
db['users'] = sequelize.import(__dirname + '/user');
db['professeurs'] = sequelize.import(__dirname + '/professeur');
db['presences'] = sequelize.import(__dirname + '/presence');
db['courss'] = sequelize.import(__dirname + '/cours');


// crée toutes les tables déinies dans la base de donnée
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));


// exporte les tables de la bdd pour le utiliser dans d'autres modules
module.exports = db;
