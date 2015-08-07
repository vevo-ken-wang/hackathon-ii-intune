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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
                    user.set("access_token", user.id);
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
    })
    // GET USER
    .get(function(req, res){
        var Member = Parse.Object.extend("Member");

        // check if current user already exists, if not then create it
        var memberQuery = new Parse.Query(Member);
        if(req.query.email){
            memberQuery.equalTo("email", req.query.email);
        }
        if(req.query.fbId){
            memberQuery.equalTo("fbId", req.query.fbId);
        }

        memberQuery.first({
            success: function(user){
                if(user){
                    user.set("access_token", user.id);
                    res.json({ result: user, error: null});
                }else{
                    res.json({ result: null, error: null});
                }
            },
            error: function(error){

            }
        });
    });

// VIDEOS
router.route('/videos')
    // GET VIDEOS (session 1)
    .get(function(req, res){

        // check which session the user is on, automatically paginate to the next
        // set of videos
        var accessToken = req.query.access_token;
        var size = req.query.size ? req.query.size : 20;
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
                //newRound = latestRound+1;
                newRound = 1; // DEBUG for now and always be round 1;

                console.log(newRound);

                var numPerRound = size;
                var Video = Parse.Object.extend("Video");
                var vidQuery = new Parse.Query(Video);
                vidQuery.ascending("objectId");
                vidQuery.skip(((newRound-1) * numPerRound)%120); // loop around if we just keep going
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
        //query.descending("round"); // TODO: update to get latest round if needed
        query.first({
            success: function(result){

                return result;

            },
            error: function(error){
                console.log("Error: " + error.code + " " + error.message);
                res.json({ result: null, error: error})
            }
        }).then(function(result){

            // check if user has already posted feedback for this video, if so, then update it
            var findFeedback = new Parse.Query(Feedback);
            findFeedback.equalTo("userId", accessToken);
            findFeedback.equalTo("isrc", req.body.isrc);

            return query.first();

        }).then(function(dbFeedback){

            if(dbFeedback){
                console.log(dbFeedback);
                console.log("update existing feedback");
                dbFeedback.save({
                    userId: accessToken,
                    round: 1,
                    isrc: req.body.isrc,
                    feedbackType: req.body.type
                }, {
                    success: function(feedbackResult){
                        console.log('Feedback saved: ' + feedbackResult.id);

                        res.json({ result: feedbackResult, error: null});
                    },
                    error: function(feedback, error){
                        console.log('Error: Failed to create member with error code: ' + error.message);
                        res.json({ result: null, error: error });
                    }
                });
            }else{
                var feedback = new Feedback();

                feedback.set("userId", accessToken);
                feedback.set("round", 1);
                feedback.set("isrc", req.body.isrc);
                feedback.set("feedbackType", req.body.type);

                feedback.save(null, {
                    success: function(feedbackResult){
                        console.log('Feedback saved: ' + feedbackResult.id);

                        res.json({ result: feedbackResult, error: null});
                    },
                    error: function(feedback, error){
                        console.log('Error: Failed to create member with error code: ' + error.message);
                        res.json({ result: null, error: error });
                    }
                });
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
        var query = new Parse.Query(Feedback);

        query.equalTo("userId", accessToken);
        query.equalTo("feedbackType", "like");
        query.find({
            success: function(results){
                results = _.pluck(results, '_serverData');
                console.log(results);

                if(results.length > 0){

                    // returns a list of user's liked feedback
                    // pull out the isrcs and then build query to find other
                    // users who also liked these isrcs
                    userFeedbackList = _.sortBy(results, function(feedback){
                        return feedback.round;
                    }).reverse();

                    var userRounds = userFeedbackList[0].round;
                    var likedIsrcs = _.pluck(userFeedbackList, 'isrc');
                    console.log("user's liked isrcs", likedIsrcs);

                    var matchedFeedbackQuery = new Parse.Query(Feedback);
                    matchedFeedbackQuery.notEqualTo("userId", accessToken);
                    matchedFeedbackQuery.equalTo("feedbackType", "like");
                    matchedFeedbackQuery.containedIn("isrc", likedIsrcs);

                    matchedFeedbackQuery.find({
                        success: function(matches){

                            // need this pluck cuz of weird bug with parse sdk, returning extraneous data
                            matches = _.pluck(matches, '_serverData');

                            // group the results by user to find the user that
                            // is the best match
                            var matchesGroupedByUserId = _.groupBy(matches, function(m){
                                return m.userId;
                            });

                            console.log("matches", matchesGroupedByUserId);

                            var userIds = Object.keys(matchesGroupedByUserId);

                            // get user objects for these userIds
                            var Member = Parse.Object.extend("Member");
                            var memberQuery = new Parse.Query(Member);
                            memberQuery.containedIn("objectId", userIds);

                            memberQuery.find({
                                success: function(users){

                                    _.forEach(users, function(u){
                                        u._serverData.id = u.id;
                                    })

                                    users = _.pluck(users, "_serverData");
                                    usersHash = _.groupBy(users, function(u){
                                        return u.id;
                                    })

                                    // get current user
                                    var currentUserQuery = new Parse.Query(Member);
                                    currentUserQuery.equalTo("objectId", accessToken);
                                    currentUserQuery.first({
                                        success: function(currentUser){
                                            console.log("currentUser", currentUser);
                                            currentUser = currentUser._serverData;

                                            console.log(usersHash);

                                            var maxMatch = 0;
                                            var maxMatchUserId = '';
                                            _.map(userIds, function(id){
                                                var numMatches = matchesGroupedByUserId[id].length;
                                                var matchUser = usersHash[id][0];
                                                // check if the user meets the sexual pref and vice versa, both ways sexual pref have to match in order to work
                                                if(currentUser.pref.indexOf(matchUser.gender) > -1
                                                    && matchUser.pref.indexOf(currentUser.gender) > -1
                                                    && numMatches > maxMatch){
                                                    maxMatch = numMatches;
                                                    maxMatchUserId = id;
                                                }
                                            });

                                            var Member = Parse.Object.extend("Member");
                                            var userQuery = new Parse.Query(Member);
                                            userQuery.equalTo("objectId", maxMatchUserId);
                                            userQuery.first({
                                                success: function(maxMatchUser){
                                                    if(maxMatchUser){
                                                        console.log("maxMatch: " + maxMatch + "| userRounds: " + userRounds);
                                                        maxMatchUser.set('matchPercent', maxMatch / (userRounds * 20) * 100);
                                                    }
                                                    res.json({ result: maxMatchUser, error: null });
                                                },
                                                error: function(error){
                                                    console.log("Error: Finding matched max user", error);
                                                    res.json({ result: null, error: error})
                                                }
                                            });

                                        }
                                    });

                                },
                                error: function(error){

                                }
                            })

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
