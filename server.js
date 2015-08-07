var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;
var _ = require('lodash');

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
                console.log('Error: Failed to create member with error code: ' + error.message);
                res.json({ result: null, error: error });
            }
        });
    });

    // GET USER

// VIDEOS
router.route('/videos')
    // GET VIDEOS (session 1)
    .get(function(req, res){

        // check which session the user is on, automatically paginate to the next
        // set of videos
        var accessToken = req.query.access_token;
        console.log("access_token:", accessToken);

        // look up user by access_token (which is just userId)
        var Feedback = Parse.Object.extend("Feedback");
        var query = new Parse.Query(Feedback);
        query.equalTo("userId", accessToken);
        query.descending("round");
        query.first({
            success: function(result){
                var latestRound = 0;
                if(result){
                    latestRound = result.round;
                }
                newRound = latestRound+1;

                console.log(newRound);

                var numPerRound = 20;
                var Video = Parse.Object.extend("Video");
                var vidQuery = new Parse.Query(Video);
                vidQuery.ascending("objectId");
                vidQuery.skip((newRound-1) * numPerRound);
                vidQuery.limit(numPerRound);

                vidQuery.find({
                    success: function(vidQueryRes){
                        res.json({result: _.shuffle(vidQueryRes), error: null});
                    },
                    error: function(error){
                        console.log("Error: " + error.code + " " + error.message);
                        res.json({ result: null, error: error})
                    }
                })
            },
            error: function(error){
                console.log("Error: " + error.code + " " + error.message);
                res.json({ result: null, error: error})
            }
        });

    });

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
