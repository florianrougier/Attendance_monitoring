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

// crée les associations entre les tables
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// crée toutes les tables déinies dans la base de donnée
sequelize.sync({force:true})
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// relations entre les tables
//db.eleves.belongsTo(db.users, {foreignKey: 'email', constraints:false});
//db.users.hasOne(db.eleves, {foreignKey: 'email', constraints:false});

//db.professeurs.belongsTo(db.users, {foreignKey: 'email', constraints:false});
//db.users.hasOne(db.professeurs, {foreignKey: 'email', constraints:false});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// exporte les tables de la bdd pour le utiliser dans d'autres modules
module.exports = db;
