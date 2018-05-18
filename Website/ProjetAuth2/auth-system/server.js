var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var path = require('path');

// invoke an instance of express application.
var app = express();

// set out application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requets to req.body
app.use(bodyParser.urlencoded({ extended: true}));

// initialize cookie-parser to allow us access the coolie stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
var idleTimeoutSeconds = 600;

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


// middleware functino to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
	   res.redirect('/AcceuilSession');
    } else {
	   next();
    }
}

app.use(express.static(path.join(__dirname + '/public')));

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

/*
// route for user signup
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
		res.redirect('/signup');
	    });
    });
*/


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
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


// route for user's dashboard
app.get('/AcceuilSession', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
	   res.sendFile(__dirname + '/views/AcceuilSession.html');
    } else {
	   res.redirect('/login');
    }
});

// route for user's dashboard
app.get('/administration', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       res.sendFile(__dirname + '/views/administration.html');
    } else {
       res.redirect('/login');
    }
});

// route for user's dashboard
app.get('/creerutilisateur', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       res.sendFile(__dirname + '/views/administrationn/creerutilisateur.html');
    } else {
       res.redirect('/login');
    }
    console.log(__dirname + '/views/administrationn/creerutilisateur.html');
    
});

// route for user's dashboard
app.get('/presence', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       res.sendFile(__dirname + '/views/presence.html');
    } else {
       res.redirect('/login');
    }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

/*
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.send('what???', 404);
});
*/


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
