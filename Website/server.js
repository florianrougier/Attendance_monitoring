var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var db = require('./models/index');
var path = require('path');
var fileUpload = require('express-fileupload');
var xlsx = require('node-xlsx');
var fs = require('fs');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule'); // job scheduler

// crée une instance d'express
var app = express();

// définition du port
app.set('port', 9000);

// permet d'avoir les log de toutes les requetes au serveur
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requets to req.body
app.use(bodyParser.urlencoded({ extended: true}));

// initialize cookie-parser to allow us access the cookie stored in the browser.
app.use(cookieParser());

// charge le module permetttant d'uploader des fichiers
app.use(fileUpload());

// initialize express-session to allow us track the logged-in user across sessions.
var idleTimeoutSeconds = 600;

// =========================
// a utiliser plus tard pour programmer la maj des status des étudiants absents et l'envoie de fichiers à l'administration

// https://www.npmjs.com/package/node-schedule

/*
var j = schedule.scheduleJob('5 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});
*///========================

// options du cookie de session
app.use(session({
    key: 'user_sid',
    secret: 'randomsecret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: idleTimeoutSeconds * 1000
    },
    rolling:true
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
	res.clearCookie('user_sid');
    }
    next();
})


// fonction middleware qui permet de vérifier quels sont les utilisateurs connectés
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
	   res.redirect('/AcceuilSession');
    } else {
	   next();
    }
}

app.use(express.static(path.join(__dirname + '/public')));

// route vers la page de login
app.get('/', sessionChecker, (req, res) => {

    // création admin ===================================
    db['users'].create({username:'valentin', password:'test', email:'valentin.m@gmail.com', droits:'admin'});
    db['admins'].create({nom:'m', prenom:'valentin', email:'valentin.m@gmail.com'});

    // création de professeurs ==========================
    db['users'].create({username:'flo', password:'test', email:'flo.aaa@gmail.com', droits:'professeur'});
    db['professeurs'].create({nom:'flo', prenom:'m', email:'flo.aaa@gmail.com'});

    db['users'].create({username:'profA', password:'test', email:'prof.A@epfedu.fr', droits:'professeur'});
    db['professeurs'].create({nom:'prof', prenom:'A', email:'prof.A@epfedu.fr'});

    db['users'].create({username:'profB', password:'test', email:'prof.B@epfedu.fr', droits:'professeur'});
    db['professeurs'].create({nom:'prof', prenom:'B', email:'prof.B@epfedu.fr'});

    db['users'].create({username:'profC', password:'test', email:'prof.C@epfedu.fr', droits:'professeur'});
    db['professeurs'].create({nom:'prof', prenom:'C', email:'prof.C@epfedu.fr'});

    // création d'élèves =================================
    db['users'].create({username:'simon', password:'test', email:'simon.negrier@gmail.com', droits:'eleve'});
    db['eleves'].create({nom:'negrier', prenom:'simon', email:'simon.negrier@gmail.com', promo:'2019', groupe:'AA', id_carte:'12345'});

    db['users'].create({username:'martin', password:'test', email:'martin.dupont@gmail.com', droits:'eleve'});
    db['eleves'].create({nom:'dupont', prenom:'martin', email:'martin.dupont@gmail.com', promo:'2019', groupe:'AB'});

    console.log("CREATION DES presences");
    var date_arrivee = new Date('2018-05-11T09:07:00Z');
    var date_depart = new Date('2018-05-11T10:32:00Z');

    db['presences'].create({heure_arrivee:date_arrivee, heure_depart:date_depart, statut:'Absent', id_carte:'12345',
                            code_module_groupe:'MSFGE1ME01AA1'});

    db['presences'].create({heure_arrivee:date_arrivee, heure_depart:date_depart, statut:'Présent', id_carte:'12345',
                            code_module_groupe:'MSFGE1ME01AA1'});

    db['presences'].create({heure_arrivee:date_arrivee, heure_depart:date_depart, statut:'Présent', id_carte:'12345',
                            code_module_groupe:'MSFGE1ME01AAAA1'});

    var date_debut = new Date('2018-05-11T09:00:00Z');
    var date_fin = new Date('2018-05-11T10:30:00Z');

    db['courss'].create({matiere:'Algorithmique', salle:'I1', date:date_debut, heure_debut:date_debut, code_module:'MSFGE1ME01AA',
                             heure_fin:date_fin, groupe:'AA', professeur_cours:'prof.A@epfedu.fr', code_cours:'1'});

    res.redirect('/login');
});


// route de la page de login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
/*
        var date_debut = new Date('2018-05-11T09:00:00Z');
        var date_fin = new Date('2018-05-11T10:30:00Z');

        var date_debut2 = new Date('2018-05-11T10:45:00Z');
        var date_fin2 = new Date('2018-05-11T12:15:00Z');

        // créer un cours
        db['courss'].create({matiere:'Algorithmique', salle:'I1', date:date_debut, heure_debut:date_debut, code_module:'MSFGE1ME01',
                             heure_fin:date_fin, groupe:'AA', professeur:'prof.A@epfedu.fr', code_cours:'1'});

        db['courss'].create({matiere:'Projet Web', salle:'1L', date:date_debut, heure_debut:date_debut, heure_fin:date_fin,
                             code_module:'MSAPP1IN09', groupe:'AB', professeur:'prof.B@epfedu.fr', code_cours:'1'});

        db['courss'].create({matiere:'Algorithmique', salle:'2L', date:date_debut2, heure_debut:date_debut2, heure_fin:date_fin2,
                             code_module:'MSFGE1ME01', groupe:'AC', professeur:'prof.A@epfedu.fr', code_cours:'2'});

        db['courss'].create({matiere:'Algorithmique', salle:'2L', date:date_debut2, heure_debut:date_debut2, heure_fin:date_fin2,
                             code_module:'MSFGE1ME01', groupe:'AC', professeur:'prof.C@epfedu.fr', code_cours:'2'});
        

        // créer une présence / absence
        var date_arrivee = new Date('2018-05-11T09:07:00Z');
        var date_depart = new Date('2018-05-11T10:32:00Z');

        db['presences'].create({heure_arrivee:date_arrivee, heure_depart:date_depart, statut:'Absent', email:'simon.negrier@gmail.com',
                                code_module_groupe:'MSFGE1ME01AA1'});*/

        // tests de récupération de présences
        db.users.findOne({where: {username: 'simon'}, include: [{model:db.eleves, include: [{model: db.presences}]}]})
        .then((user) => console.log('\n\n\n\n\n\n' + 'liste des éléèves avec présences et cours 11111' + JSON.stringify(user)) + '\n\n\n\n\n');

        db.eleves.findOne({where: {prenom: 'simon'}, include: [{model: db.presences}]})
        .then((user) => console.log('\n\n\n\n\n\n' + 'liste des eleves avec présence 222222' + JSON.stringify(user)) + '\n\n\n\n\n');

        db.eleves.findOne({where: {prenom: 'simon'}})
        .then((user) => user.getPresences()).then(user => console.log('\n\n\n\n\n\n' + 'liste des eleves 33333\n' + JSON.stringify(user)) + '\n\n\n\n\n');

        // test de récupérations des cours et des professeurs
        db.courss.findOne({where: {code_module_groupe: 'MSFGE1ME01AAAA1'}, include: [{model: db.professeurs}]})
        .then((cours) => console.log('\n\n\n\n\n\n' + 'liste des cours 44444\n' + JSON.stringify(cours)) + '\n\n\n\n\n');

        db.professeurs.findOne({where: {email: 'prof.A@epfedu.fr'}, include: [{model: db.courss}]})
        .then((professeur) => console.log('\n\n\n\n\n\n' + 'liste des professeurs 555555\n' + JSON.stringify(professeur)) + '\n\n\n\n\n');

        db.presences.findOne({where: {code_module_groupe: 'MSFGE1ME01AAAA1'}})
        .then((presence) => console.log('\n\n\n\n\n\n' + 'liste des presences 666666\n' + JSON.stringify(presence)) + '\n\n\n\n\n\n');

        db.courss.findOne({where: {code_module_groupe: 'MSFGE1ME01AAAA1'}, include: [{model: db.presences}]})
        .then((cours) => console.log('\n\n\n\n\n\n' + 'liste des presences 777777\n' + JSON.stringify(cours)) + '\n\n\n\n\n\n');


    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        db['users'].findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/AcceuilSession');
            }
        });
    });

/*
app.get('/pre', (req,res) => {
    db.courss.findAll({ raw: true }).then( (cours) => res.json(cours));
});
*/

// route vers la page d'acceuil
app.get('/AcceuilSession', (req, res) => {

    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
	   res.sendFile(__dirname + '/views/administrationn/AcceuilSession.html');
    } else if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'professeur') {
	   res.sendFile(__dirname + '/views/professeur/AcceuilSession.html');
    } else if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'eleve') {
        res.sendFile(__dirname + '/views/eleve/AcceuilSession.html');
    } else {
        res.redirect('/login');
    }
});

// route vers la page d'administration
app.get('/administration', (req, res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       res.sendFile(__dirname + '/views/administrationn/administration.html');
    } else {
       res.redirect('/login');
    }
});

// route vers la page de création d'utilisateur
app.get('/creerutilisateur', (req, res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       res.sendFile(__dirname + '/views/administrationn/creerutilisateur.html');
    } else {
       res.redirect('/login');
    }
});


// route pour la création d'un compte utilisateur
app.post('/creer_un_compte', (req, res) => {

    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {

       // check type de droits :
       var droits = req.body.selection_droits;

       if (droits === 'admin') {

            db.users.create({
                username: req.body.prenom,
                droits: droits
            })
            .then(user => {
                req.session.user = user.dataValues;

                // send mail

            })
            .catch(error => {
                //marque message d'erreur gui
                console.log(error);
            });


       } else if (droits === 'professeur') {

            db.users.create({
                username: req.body.prenom,
                droits: droits
            })
            .then(user => {
                user.createprofesseurs({
                    nom: req.body.nom,
                    prenom: req.body.prenom
                })

                //req.session.user = user.dataValues;

                // send mail

            })
            .catch(error => {
                //marque message d'erreur gui
                console.log(error);
            });

       } else if (droits === 'eleve') {
            //var password_generator = require('generate-password');
            //password_generated = password_generator.generate({length:8, numbers:true});

            db.users.create({
                username: req.body.prenom,
                email: req.body.prenom + '.' + req.body.nom + '@epfedu.fr',
                droits: droits,
                //password: password_generated
            })
            .then(user => {
                user.createEleve({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    promo: req.body.promotion,
                    groupe: req.body.groupe
                })

                //req.session.user = user.dataValues;

                // send mail

            })
            .catch(error => {
                //marque message d'erreur gui
                console.log(error);
            });

       } else {
            console.log('ATTENTTION, IL Y A EU UNE ERREUR DANS LA SELECTION DES DROITS !!!');
       }

    } else {
       res.redirect('/login');
    }
    
});


// route vers la page de création d'utilisateur à partir d'un fichier
app.get('/creerListUtilisateur', (req, res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       res.sendFile(__dirname + '/views/administrationn/creerListUtilisateur.html');
    } else {
       res.redirect('/login');
    }
});

// permet d'uplader un fichier xlsx ou xls pour le mettre dans la BDD
app.post('/uploadFileUtilisateurs', function(req, res) {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
        if (!req.files){
            return res.status(400).send('No files were uploaded.');
        }
        
        var file = req.files.filename;
        var filename = file.name;   

        // Use the mv() method to place the file somewhere on your server
        file.mv(__dirname + '/public/xslx/' + filename, function(err) {

            if (err){
                return res.status(500).send(err);
            } else {
                res.send('File uploaded!');
            }

         var obj = xlsx.parse(__dirname + '/public/xslx/' + filename); // parses a file
         var rows = [];
         var writeStr = "";

        //looping through all sheets
        for(var i = 0; i < obj.length; i++) {
            var sheet = obj[i];
            //loop through all rows in the sheet
            for(var j = 0; j < sheet['data'].length; j++) {
                //add the row to the rows array
                rows.push(sheet['data'][j]);
            }
        }

        //creates the csv string to write it to a file
        for(var i = 0; i < rows.length; i++) {
            writeStr += rows[i].join(",") + "\n";
            }

            fs.writeFile(__dirname + "/public/xslx/" + "/test.csv", writeStr, function(err) {
                if(err) {
                    return console.log(err);
                }
            });

        });

    } else {
        res.redirect('/login');
    }

});


// route vers la page de la liste des utilisateurs
app.get('/listeUtilisateurs', (req, res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       res.sendFile(__dirname + '/views/administrationn/listeUtilisateurs.html');
    } else {
        res.redirect('/login');
    }
});

// renvoie la liste des utilisateurs pour l'affichage
app.get('/getListeUtilisateurs', (req,res) => {

    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {

        db.users.findAll({ include: [{model:db.eleves},{model:db.admins},{model:db.professeurs}]})
            .then( (user) => {
                res.send(JSON.stringify(user));
        });

    } else {
        res.redirect('/login');
    }
    
});

// supprime l'utilisateur demandé
app.delete('/supprimerUnUtilisateur:email', (req, res, ) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       
        db.users.destroy({where: {email: req.params.email}}).then(() => {
            db.users.findAll({ include: [{model:db.eleves},{model:db.admins},{model:db.professeurs}]}).then((users) => {res.json(users)});
        });

    } else {
        res.redirect('/login');
    }

});



// route vers la page de présence / d'absence
app.get('/presence', (req, res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {
       res.sendFile(__dirname + '/views/administrationn/presence.html');
    } else if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'professeur') {
        res.sendFile(__dirname + '/views/professeur/presence.html');
    } else if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'eleve') {
        res.sendFile(__dirname + '/views/eleve/presence.html');
    } else {
        res.redirect('/login');
    }
});

/*
// renvoie la liste des présences pour l'affichage
app.get('/getListePresences', (req,res) => {

    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {

        db.presences.findAll({ include: [{model:db.eleves},{model:db.courss},{model:db.professeurs}]})
            .then( (presences) => {
                res.send(JSON.stringify(presences));
        });

    } else {
        res.redirect('/login');
    }
    
});
*/

// route pour le logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        //res.clearCookie('user_sid');
        //res.redirect('/');
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

// route pour la page 404
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

// lance le serveur express
// on ecoute le port (port 9000 ici)
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
