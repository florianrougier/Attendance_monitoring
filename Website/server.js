var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var db = require('./models/index'); // BDD
var path = require('path');
var fileUpload = require('express-fileupload');
var xlsx = require('node-xlsx');
var fs = require('fs');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule'); // job scheduler

// crée une instance d'express
var app = express();

// définition du port
app.set('port', 9000); // pour le serveur : port 8080

// morgan permet d'avoir les log de toutes les requetes au serveur
// skipLog : fonction qui exclue des log
function skipLog (req, res) {
  var url = req.url;
  if(url.indexOf('?')>0)
    url = url.substr(0,url.indexOf('?'));
  if(url.match(/(js|jpg|png|css)$/ig)) {
    return true;
  }
  if (req.url == '/vendor/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0') {
    return true;
  }
  if (req.url == '/vendor/bootstrap/css/bootstrap.min.css.map') {
    return true;
  }
  return false;
}

app.use(morgan('tiny', {stream: process.stdout, skip: skipLog}));

// initialize body-parser to parse incoming parameters requets to req.body
app.use(bodyParser.urlencoded({ extended: true}));

// initialize cookie-parser to allow us access the cookie stored in the browser.
app.use(cookieParser());

// charge le module permetttant d'uploader des fichiers
app.use(fileUpload());

// charge les fichier javascript, css et les images. 
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/node_modules/angular-i18n')));

// =========================
// a utiliser plus tard pour programmer la maj des status des étudiants absents et l'envoie de fichiers à l'administration

// https://www.npmjs.com/package/node-schedule

/*
var j = schedule.scheduleJob('5 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});
*///========================


// initialise express-session, permet de tracker l'utilisateur à travers les sessions.
var idleTimeoutSeconds = 600;

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


// route vers la page de login
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route de la page de login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        db['users'].findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.sendFile(__dirname + '/views/login_false.html');
            } else if (!user.validPassword(password)) {
                res.sendFile(__dirname + '/views/login_false.html');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/AcceuilSession');
            }
        });
    });


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

       // check type de droits du compte à créer :
       var droits = req.body.selection_droits;

       if (droits === 'admin') {

            db.users.create({
                username: req.body.prenom,
                droits: droits
            })
            .then(user => {
                req.session.user = user.dataValues;

            })
            .catch(error => {
                //TODO marque message d'erreur gui
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

            })
            .catch(error => {
                //TODO marque message d'erreur gui
                console.log(error);
            });

       } else { // si élève

            db.users.create({
                username: req.body.prenom,
                email: req.body.prenom + '.' + req.body.nom + '@epfedu.fr',
                droits: droits,
            })
            .then(user => {
                user.createEleve({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    promo: req.body.promotion,
                    groupe: req.body.groupe
                })

            })
            .catch(error => {
                //TODO marque message d'erreur gui
                console.log(error);
            });
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


// permet d'uplader un fichier xlsx ou xls pour le mettre dans la BDD -- PAS FINI !
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


// renvoie la liste des présences pour l'affichage
app.get('/getListePresences', (req,res) => {
    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'admin') {


        db.presences.findAll({ 
            include: [{model: db.cartes, include: [{model: db.professeurs}, {model: db.eleves}]}, {model: db.courss, include: [{model: db.professeurs}]}]
        })
        .then( (presences) => {
           res.send(JSON.stringify(presences));
        });

    } else {
        res.redirect('/login');
    }
});


// récupère les présence de l'utilisateur (élève ou professeur)
app.get('/getUserPresences', (req, res, ) => {

    if (req.session.user && req.cookies.user_sid && req.session.user.droits === 'eleve') {
       
        db.eleves.findOne({where: {prenom: req.session.user.username}, include: [{model: db.cartes, include: [{model: db.presences, as:'presences_eleve', include: [{model: db.courss, include: [{model: db.professeurs}]}]}]}]})
        .then( (eleve) => {
           res.send(JSON.stringify(eleve));
        });

    } else {
        res.redirect('/login');
    }
});


// route pour le logout, supprimer le cookie
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

// route pour la page 404
app.use(function (req, res, next) {
    res.status(404).send("Erreur 404 : la page n'existe pas !")
});

// lance le serveur express
// on ecoute le port (port 9000 ici)
app.listen(app.get('port'), () => console.log(`L'application utilise le port : ${app.get('port')}`));
