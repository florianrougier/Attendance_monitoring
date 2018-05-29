var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// crée une instance sequelize avec les informations de la base de donnée locale
var sequelize = new Sequelize('postgres://postgres:saucisson@localhost:5432/projetmintest', {
	dialect: 'postgres',
	operatorsAliases: false,
	define: {
        timestamps: false
     },

  // you can either write to console
  //logging: console.log

  // or write your own custom logging function
  logging: function (str) {
    console.log ('\n' + str + '\n');
    // do stuff with the sql str
  }
});

db = {};


db['eleves'] =  sequelize.import(__dirname + '/eleve');
db['users'] = sequelize.import(__dirname + '/user');
db['professeurs'] = sequelize.import(__dirname + '/professeur');
db['presences'] = sequelize.import(__dirname + '/presence');
db['courss'] = sequelize.import(__dirname + '/cours');
db['admins'] = sequelize.import(__dirname + '/admin');


// crée les associations entre les tables
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// crée toutes les tables déinies dans la base de donnée (sync : synchronise les modèles et les tables de la bdd)
sequelize.sync({logging:false})
    .then(() => console.log('Les tables ont été créées sans problème ou ont été récupérées si elles existaient déjà'))
    .catch(error => console.log('Cette erreur s\'est produite : \n', error));


// exporte les tables de la bdd pour le utiliser dans d'autres modules
module.exports = db;
