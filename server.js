var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;

var PARSE_APP_ID = "WDZQlWF0wJT4kdFy6udLNd6Hzkf80UnEnoPyv4vY";
var JS_KEY = "OLWwwMugNngEOQILaa6KI0c0UuquCHJEGhtprev6";
Parse.initialize(PARSE_APP_ID, JS_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

router.get('/', function(req, res){
    res.json({ message: 'hooray! welcome to our api!'});
});

// USERS
router.route('/users')
    // CREATE USER
    .post(function(req, res){

        var Member = Parse.Object.extend("Member");
        var member = new Member();
        console.log(req.body);

        member.set("firstName", req.body.firstName);
        member.set("lastName", req.body.lastName);
        member.set("email", req.body.email);
        member.set("gender", req.body.gender);
        member.set("pref", req.body.pref);
        member.set("imgUrl", req.body.imgUrl);

        member.save(null, {
            success: function(member){
                console.log('Member created: ' + member.id);
                // set a simple access_token to be userId
                member.set("access_token", member.id);
                res.json({ result: member, error: null});
            },
            error: function(member, error){
                console.log('Failed to create member with error code: ' + error.message);
                res.json({ result: null, error: error });
            }
        });
    });

    // GET USER

// VIDEOS
router.route('/videos');
    // GET VIDEOS (session 1)

// LIKE/DISLIKE
router.route('/feedback');
    // POST FEEDBACK { 'isrc', 'type': 'like'|'dislike' }

// MATCHES
router.route('/matches');
    // GET

app.use('/api', router);


var server = app.listen(process.env.PORT || 1337, function(){

   var host = server.address().address;
   var port = server.address().port;

   console.log('Vevo Lean Back app listening at http://' + host + ':' + port);
 }
);
