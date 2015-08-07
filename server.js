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

        // check if current user already exists, if not then create it
        var memberQuery = new Parse.Query(Member);
        memberQuery.equalTo("email", req.body.email);

        memberQuery.first({
            success: function(user){
                if(user){
                    res.json({ result: user, error: null});
                }else{
                    var member = new Member();

                    member.set("firstName", req.body.firstName);
                    member.set("lastName", req.body.lastName);
                    member.set("email", req.body.email);
                    member.set("gender", req.body.gender);
                    member.set("pref", req.body.pref);
                    member.set("imgUrl", req.body.imgUrl);
                    member.set("fbId", req.body.fbId);

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
                }
            },
            error: function(error){

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
router.route('/feedback')
    // POST FEEDBACK { 'isrc', 'type': 'like'|'dislike', 'access_token' }
    .post(function(req, res){

        var accessToken = req.body.access_token;

        // first get user's session number
        var Feedback = Parse.Object.extend("Feedback");
        var query = new Parse.Query(Feedback);

        query.equalTo("userId", accessToken);
        query.descending("round");
        query.first({
            success: function(round){

                var feedback = new Feedback();

                feedback.set("userId", accessToken);
                feedback.set("round", round);
                feedback.set("isrc", req.body.isrc);
                feedback.set("type", req.body.type);

                feedback.save(null, {
                    success: function(feedback){
                        console.log('Feedback saved: ' + feedback.id);

                        res.json({ result: feedback, error: null});
                    },
                    error: function(feedback, error){
                        console.log('Error: Failed to create member with error code: ' + error.message);
                        res.json({ result: null, error: error });
                    }
                });
            },
            error: function(error){
                console.log("Error: " + error.code + " " + error.message);
                res.json({ result: null, error: error})
            }
        });
    });

// MATCHES
router.route('/matches')
    // GET
    .get(function(req, res){

        var accessToken = req.query.access_token;

        // get the user's list of feedback
        var Feedback = Parse.Object.extend("Feedback");
        var userFeedbackListQuery = new Parse.Query(Feedback);

        userFeedbackListQuery.equalTo("userId", accessToken);
        userFeedbackListQuery.equalTo("type", "like");
        userFeedbackListQuery.find({
            success: function(userFeedbackList){

                if(userFeedbackList.length > 0){

                    // returns a list of user's liked feedback
                    // pull out the isrcs and then build query to find other
                    // users who also liked these isrcs
                    userFeedbackList = _.sortBy(userFeedbackList, function(feedback){
                        return feedback.round;
                    }).reverse();

                    var userRounds = userFeedbackList[0].round;
                    var likedIsrcs = _.pluck(userFeedbackList, 'isrc');

                    var matchedFeedbackQuery = new Parse.Query(Feedback);
                    matchedFeedbackQuery.notEqualTo("userId", accessToken);
                    matchedFeedbackQuery.equalTo("type", "like");
                    matchedFeedbackQuery.containedIn("isrc", likedIsrcs);

                    matchedFeedbackQuery.find({
                        success: function(matches){

                            // group the results by user to find the user that
                            // is the best match
                            var matchesGroupedByUserId = _.groupBy(matches, function(m){
                                return m.userId;
                            });

                            var userIds = Object.keys(matchesGroupedByUserId);
                            var maxMatch = 0;
                            var maxMatchUserId = '';
                            _.map(userIds, function(id){
                                var numMatches = matchesGroupedByUserId[id].length;
                                if(numMatches > maxMatch){
                                    maxMatch = numMatches;
                                    maxMatchUserId = id;
                                }
                            });

                            var Member = Parse.Object.extend("Member");
                            var userQuery = new Parse.Query(Member);
                            userQuery.equalTo("objectId", maxMatchUserId);
                            userQuery.first({
                                success: function(maxMatchUser){
                                    maxMatchUser.set("matchPercent", maxMatch / userRounds * 20);
                                    res.json({ result: maxMatchUser, error: null });
                                },
                                error: function(error){
                                    console.log("Error: Finding matched max user", error);
                                    res.json({ result: null, error: error})
                                }
                            });

                        },
                        error: function(error){
                            console.log("Error: Finding matched feedback", error);
                            res.json({ result: null, error: error})
                        }
                    });
                }else{
                    res.json({ result: [], error: null });
                }

            },
            error: function(error){
                console.log("Error: Getting user's feedback list", err);
                res.json({ result: null, error: error})
            }
        });

        // find other feedback that is similar to the user's feedback


    });

app.use('/api', router);


var server = app.listen(process.env.PORT || 1337, function(){

   var host = server.address().address;
   var port = server.address().port;

   console.log('Vevo Lean Back app listening at http://' + host + ':' + port);
 }
);
