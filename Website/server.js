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
    // debut du test
    db['users'].create({username:'valentin', password:'test', email:'eleve@gmail.com', droits:'eleve'});
    db['eleves'].create({nom:'valentin', prenom:'m', email:'eleve@gmail.com', promo:'2019', groupe:'A'});

    res.redirect('/login');
});

/*
// route pour la création d'un compte utilisateur
app.route('/signup')
    .get(sessionChecker, (req, res) => {
	res.sendFile(__dirname + '/views/signup.html');
    })
    .post((req, res) => {
	User.create({
	    username: req.body.username,
	    email: req.body.email,
	    password: req.body.password
	})
	    .then(user => {
		req.session.user = user.dataValues;
		res.redirect('/AcceuilSession');
	    })
	    .catch(error => {
           //marque message d'erreur
		res.redirect('/login');
	    });
    });
*/


// route de la page de login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');

        //créer un élève
        //db['eleves'].create({nom:'valentin', prenom:'m', email:'eleve@gmail.com', promo:'2019', groupe:'A'});

        //créé un professeur
        //db['professeur'].create({nom:'florian', prenom:'r', email:'prof@gmail.com@gmail.com'});

        //créer un utilisateur sans la page de connexion :
        //db['users'].create({username:'simon', password:'test', email:'boitepastresutile@gmail.com', droits:'admin'});
        //db['users'].create({username:'flo', password:'test', email:'prof@gmail.com', droits:'professeur'});
        //db['users'].create({username:'valentin', password:'test', email:'eleve@gmail.com', droits:'eleve'});

        // créer un cours
        //db['courss'].create({matiere:'', salle:'', date:'', heure_debut:'', heure_fin:'', code_module:'',
        // groupe:'', code_module_grouep:'', professeur:'', code_cours:''});

        // créer une absence
        //db['presences'].create({date:'', heure_arrivee:'', heure_depart:'', statut:'', mail:'', code_cours:''});

        // vérifier ce que contient table eleve
        //db['eleve'].findAll().then(eleve => console.log(eleve));

        console.log('DEBUT DU TEST');
        db.users.findAll({ where: {username: 'valentin'}, include: [{model: db.eleves}] }).then(user => console.log(user[0].eleve.get({plain:true})));
        

        //db.users.findAll().then(user => console.log(user));
        console.log('FIN DU TEST');

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
       res.sendFile(__dirname + '/views/administration.html');
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
