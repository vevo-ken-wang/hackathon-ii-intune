var request = require('superagent');
var S = require('string'); // special String lib with additional String functions
var Promise = require('promise');

module.exports = (function(){
  var MUSIC_GRAPH = {
    key: "0afe888303d4bcd77230c498f10a4b38",
    baseUrl: 'api.musicgraph.com/api/v2', //'qa.v2.api.musicgraph.com'
    clientAccountId: '2445581198641' // NOTE: this value comes from when you first create a MusicGraph user, this needs to be attached in order to look up our users within their system
    // lookUpArtist: '/artist/suggest',
    // lookUpVideo: '/video/suggest',
    // playlist: '/playlist',
    // similarArtist: '/artist/vevo:{vevo_artist_id}/similar',
    // similarVideo: '/video/vevo:{vevo_isrc}/similar',
    // user: '/user'
  };

  return {

    /*
    options - { genre, decade, limit, offset }
    */
    lookUpArtist: function(searchTerm, options){
      var urlFormat = 'http://{{baseUrl}}/artist/suggest?api_key={{key}}&prefix={{prefix}}&catalog=vevo&genre={{genre}}&decade={{decade}}&limit={{limit}}&offset={{offset}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        prefix: encodeURIComponent(searchTerm),
        genre: (options && options.genre) ? options.genre : '',
        decade: (options && options.decade) ? options.decade : '',
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!searchTerm){
          reject('No search term');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    options - { genre, decade, limit, offset }
    */
    lookUpVideo: function(searchTerm, options){

      var urlFormat = 'http://{{baseUrl}}/video/suggest?api_key={{key}}&prefix={{prefix}}&catalog=vevo&genre={{genre}}&decade={{decade}}&limit={{limit}}&offset={{offset}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        prefix: encodeURIComponent(searchTerm),
        genre: (options && options.genre) ? options.genre : '',
        decade: (options && options.decade) ? options.decade : '',
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!searchTerm){
          reject('No search term');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    options - {
        limit - Result limit. default=20, max=100
        offset - Pagination
        popularity - Track popularity. default='any'. Values range from Low to High [1-10]
        year - default='retro,2014'. Must pass a 'to,from' year values
        tempo - Track Tempo. default='any'. Values are slow|moderate|fast
        similarity - Artist similarity.
      }
    */
    getPlaylistByArtist: function(artistIdsArr, options){

      var urlFormat = 'http://{{baseUrl}}/playlist?api_key={{key}}&artist_ids={{artistIds}}&catalog=vevo&limit={{limit}}&offset={{offset}}&popularity={{popularity}}&year={{year}}&tempo={{tempo}}&similarity={{similarity}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        artistIds: (artistIdsArr) ? 'vevo:' + artistIdsArr.join(',vevo:') : '', // we want our string to look like 'vevo:artistId1,vevo:artistId2,...'
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : '',
        popularity: (options && options.popularity) ? options.popularity : '',
        year: (options && options.year) ? options.year : '',
        tempo: (options && options.tempo) ? options.tempo : '',
        similarity: (options && options.similarity) ? options.similarity : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!artistIdsArr){
          reject('No artist ids');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    options - {
        limit - Result limit. default=20, max=100
        offset - Pagination
        popularity - Track popularity. default='any'. Values range from Low to High [1-10]
        year - default='retro,2014'. Must pass a 'to,from' year values
        tempo - Track Tempo. default='any'. Values are slow|moderate|fast
        similarity - Artist similarity.
      }
    */
    getPlaylistByVideo: function(videoIsrcsArr, options){

      var urlFormat = 'http://{{baseUrl}}/playlist?api_key={{key}}&video_ids={{videoIds}}&catalog=vevo&limit={{limit}}&offset={{offset}}&popularity={{popularity}}&year={{year}}&tempo={{tempo}}&similarity={{similarity}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        videoIds: (videoIsrcsArr) ? 'vevo:' + videoIsrcsArr.join(',vevo:') : '', // we want our string to look like 'vevo:isrc1,vevo:isrc2,...'
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : '',
        popularity: (options && options.popularity) ? options.popularity : '',
        year: (options && options.year) ? options.year : '',
        tempo: (options && options.tempo) ? options.tempo : '',
        similarity: (options && options.similarity) ? options.similarity : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!videoIsrcsArr){
          reject('No video ids');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    options - {
        limit - Result limit. default=20, max=100
        offset - Pagination
      }
    */
    getSimilarArtists: function(artistId, options){
      var urlFormat = 'http://{{baseUrl}}/artist/{{artistId}}/similar?api_key={{key}}&catalog=vevo&limit={{limit}}&offset={{offset}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        artistId: (artistId) ? 'vevo:' + artistId : '', // we want our string to look like 'vevo:artistId'
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!artistId){
          reject('No artist id');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    options - {
        limit - Result limit. default=20, max=100
        offset - Pagination
      }
    */
    getSimilarVideos: function(isrc, options){
      var urlFormat = 'http://{{baseUrl}}/video/{{isrc}}/similar?api_key={{key}}&catalog=vevo&limit={{limit}}&offset={{offset}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        isrc: (isrc) ? 'vevo:' + isrc : '', // we want our string to look like 'vevo:artistId'
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!isrc){
          reject('No isrc');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    first_name
    last_name
    gender - male/female
    location - city,state,region
    country - 2-3 letter country code
    birthday - mm/dd/yyyy
    language - ISO 639-1 (en,es,pt)
    email

    {
      "status": {
          "code": 0,
          "message":
          "Success",
          "api": "v2"
      },
      data: {
          "status": "active",
          "name": "My Company",
          "entity_type": "account",
          "date_created": 1420581139487,
          "date_last_modified": 1420581139714,
          "id": "6137fcec-efbc-1720-e7db-f726a47e022c",
          "account_id": "2445580905922"
      }
    }

    */
    createUser: function(userId){
      var urlFormat = 'http://{{baseUrl}}/user?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key
      };

      var url = S(urlFormat).template(interpolateVals).s;
      var postData = {
        "user_id": userId
      };

      var promise = new Promise(function(resolve, reject){
        if(!userId){
          reject('No userId');
        }else{
          request
            .post(url)
            .send(postData)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    first_name
    last_name
    gender - male/female
    location - city,state,region
    country - 2-3 letter country code
    birthday - mm/dd/yyyy
    language - ISO 639-1 (en,es,pt)
    email

    {
      "status": {
          "code": 0,
          "message":
          "Success",
          "api": "v2"
      },
      data: {
          "status": "active",
          "name": "My Personal Graph",
          "entity_type": "account",
          "date_created": 1420581139487,
          "date_last_modified": 1420581488159,
          "id": "6137fcec-efbc-1720-e7db-f726a47e022c",
          "account_id": "2445580905922"
      }
    }
    */
    updateUser: function(userId, userData){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!userId || !userData){
          reject('No userId or userData');
        }else{
          request
            .put(url)
            .send(userData)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    userId - Our userId

    {
      "status": {
          "code": 0,
          "message":
          "Success",
          "api": "v2"
      },
      data: {
          "status": "active",
          "name": "My Company",
          "entity_type": "account",
          "date_created": 1420581139487,
          "date_last_modified": 1420581139714,
          "id": "6137fcec-efbc-1720-e7db-f726a47e022c",
          "account_id": "2445580905922"
      }
    }
    */
    getUser: function(userId){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!userId){
          reject('No userId');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    userId - Our userId
    */
    deleteUser: function(userId){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!userId){
          reject('No userId');
        }else{
          request
            .del(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
    {
      "status": {
         "code": 0,
         "message": "Success",
         "api": "v2"
      },
      "data": {
         "station_session_id": "[generated sessionid]",
         "station_id": "[generated station id]"
      }
    }

    */
    createStationByArtist: function(userId, artistIdsArr){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}/stations?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var postData = {
        "artist_ids": (artistIdsArr) ? 'vevo:' + artistIdsArr.join(',vevo:') : '',
        "catalog": "vevo"
      };

      var promise = new Promise(function(resolve, reject){
        if(!userId || !artistIdsArr){
          reject('No userId or artistIdsArr');
        }else{
          request
            .post(url)
            .send(postData)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;

    },

    /*
      options - {
        limit - Result limit. default=20, max=100
        offset - Pagination
      }

      {
        "status": {
          "code": 0,
          "message": "Success",
          "api": "v2"
        },
        "pagination": {
          "count": 2,
          "total": 2,
          "offset": 1
        },
        "data": [
          {
            "name": "Red Hot Chili Peppers",
            "settings": {
              "popularity": "any",
              "year": "retro,2014",
              "tempo": "any",
              "similarity": "any"
            },
            "meta": {
              "includes": [
                {
                  "name": "Red Hot Chili Peppers",
                  "entity_type": "artist",
                  "artist_ref_id": "27692",
                  "gender": "Male",
                  "main_genre": "Pop/Rock",
                  "decade": "1980s / 1990s / 2000s / 2010s"
                }
              ]
            },
            "date_created": "1420597562819",
            "artist_id": "e3109b71-a6b5-11e0-b446-00251188dd67",
            "additional_seeds": [],
            "id": "e4fe3bf6-fd50-496c-9749-0750ed44e149"
          },
			...
        ]
      }

    */
    getUserStations: function(userId, options){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}/stations?api_key={{key}}&limit={{limit}}&offset={{offset}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId,
        limit: (options && options.limit) ? options.limit : '',
        offset: (options && options.offset) ? options.offset : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!userId){
          reject('No userId');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;

    },

    /*
    {
      "status": {
        "code": 0,
        "message": "Success",
        "api": "v2"
      },
      "data": {
        "name": "Red Hot Chili Peppers",
        "settings": {
          "popularity": "any",
          "year": "retro,2014",
          "tempo": "any",
          "similarity": "any"
        },
        "meta": {
          "includes": [
            {
              "name": "Red Hot Chili Peppers",
              "entity_type": "artist",
              "artist_ref_id": "27692",
              "gender": "Male",
              "main_genre": "Pop/Rock",
              "decade": "1980s / 1990s / 2000s / 2010s"
            }
          ]
        },
        "date_created": "1420597562819",
        "artist_id": "e3109b71-a6b5-11e0-b446-00251188dd67",
        "additional_seeds": [

        ],
        "id": "e4fe3bf6-fd50-496c-9749-0750ed44e149"
      }
    }
    */
    getStation: function(userId, stationId){
      var urlFormat = 'http://{{baseUrl}}/user/{{clientAccountId}}:{{userId}}/stations/{{stationId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        clientAccountId: MUSIC_GRAPH.clientAccountId,
        userId: userId,
        stationId: stationId ? stationId : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!userId || !stationId){
          reject('No userId or stationId');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    // region StationSession
    //===============================

    // start a new station session
    /*
    {
      "status": {
        "code": 0,
        "message": "Success",
        "api": "v2"
      },
      "data": {
        "station_session_id": "43706be9-aa9b-4b7f-91f1-2b47d3c6c4bc",
        "new_session": true
      }
    }
    */
    createStationSession: function(stationId, country){
      var urlFormat = 'http://{{baseUrl}}/station/{{stationId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        stationId: stationId ? stationId : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      var postData = {
          "catalog": "vevo",
          "country": country ? country : "us",
          "dmca": false
      };

      var promise = new Promise(function(resolve, reject){
        if(!stationId){
          reject('No stationId');
        }else{
          request
            .post(url)
            .send(postData)
            .set('Accept', 'application/json')
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
      action - first|next|error|skip
      options - {
        duration - duration of last streamed track/video in seconds
        country - ISO 3166-1 code
      }

      {
       "status":{
          "code":0,
          "message":"Success",
          "api":"v2"
       },
       "data":{
          "main_artist_name":"Tori Kelly",
          "entity_type":"video",
          "video_artist_id":"a3ef5202-977b-1867-7b57-bad3df1985cd",
          "vevo_id":"USUV71501567",
          "title":"Should\u2019ve Been Us (Official)",
          "duration":199,
          "id":"39d06feb-b2f2-4637-92c5-b7cefd3406e0"
       }
    }
    */
    getTrack: function(stationId, sessionId, action, options){
      console.log("API getTrack for session: ", sessionId);
      var urlFormat = 'http://{{baseUrl}}/station/{{stationId}}/{{sessionId}}?api_key={{key}}&action={{action}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        stationId: stationId ? stationId : '',
        sessionId: sessionId ? sessionId : '',
        action: action ? action : ''
      };

      var url = S(urlFormat).template(interpolateVals).s;

      if(options && options.duration){
        url += ('&duration=' + options.duration);
      }

      if(options && options.country){
        url += ('&country=' + options.country);
      }

      if(action === "first"){
          url += "&seed_date_desc"
      }

      var promise = new Promise(function(resolve, reject){
        if(!stationId || !sessionId || !action){
          reject('No stationId or sessionId or action');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;
    },

    /*
      type - artist|track
      action - like|unlike
      id - either artistId or trackId depending on feedback type

      {
        "status": {
          "code": 0,
          "message": "Success",
          "api": "v2"
        },
        "data": {

        }
      }

    */
    postFeedback: function(stationId, sessionId, id, type, action){
      var urlFormat = 'http://{{baseUrl}}/station/{{stationId}}/{{sessionId}}/feedback?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        stationId: stationId ? stationId : '',
        sessionId: sessionId ? sessionId : ''
      };

      // interpolate url with our variables
      var url = S(urlFormat).template(interpolateVals).s;

      // build post data
      var feedback;
      if(type === 'artist'){
        feedback = action + '_artist';
      }else if(type === 'track'){
        feedback = action + '_song'
      }

      var postData = {
        id: id,
        feedback: feedback
      };

      var promise = new Promise(function(resolve, reject){
        if(!stationId || !sessionId || !action || !id || !type){
          reject('No stationId or sessionId or action or id or type');
        }else{
          request
            .post(url)
            .send(postData)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;

    },

    /*
    {
      "status": {
        "code": 0,
        "message": "Success",
        "api": "v2"
      },
      "data": {
        "plays": [
          {
            "track_title": "Chloe Dancer/Crown of Thorns",
            "play_duration": 501,
            "artist_name": "Mother Love Bone",
            "tstamp": 1420665185776,
            "action": "next",
            "duration": 501,
            "track_id": "03fe5b79-8c38-a42c-db1d-7185c7f0a353"
          },
          {
            "track_title": "Say Hello 2 Heaven",
            "play_duration": 382,
            "artist_name": "Temple of the Dog",
            "tstamp": 1420665849847,
            "action": "next",
            "duration": 382,
            "track_id": "1f4ae53d-7216-3f08-be76-52cc82e679cc"
          },
          {
            "track_title": "Even Flow",
            "play_duration": 0,
            "artist_name": "Pearl Jam",
            "tstamp": 1420665905848,
            "action": "skip",
            "duration": 303,
            "track_id": "ee6c6759-86a0-2dc1-f529-718a9029357c"
          }
        ],
        "feedback": {
          "like_song": [
            {
              "track_title": "Say Hello 2 Heaven",
              "id": "1f4ae53d-7216-3f08-be76-52cc82e679cc"
            }
          ]
        }
      }
    }
    */
    getStationSessionHistory: function(stationId, sessionId){
      var urlFormat = 'http://{{baseUrl}}/station/{{stationId}}/{{sessionId}}/history?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        stationId: stationId ? stationId : '',
        sessionId: sessionId ? sessionId : ''
      };

      // interpolate url with our variables
      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!stationId || !sessionId){
          reject('No stationId or sessionId');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;

    },

    deleteStationSessionHistory: function(stationId, sessionId){
      var urlFormat = 'http://{{baseUrl}}/station/{{stationId}}/{{sessionId}}?api_key={{key}}';
      var interpolateVals = {
        baseUrl: MUSIC_GRAPH.baseUrl,
        key: MUSIC_GRAPH.key,
        stationId: stationId ? stationId : '',
        sessionId: sessionId ? sessionId : ''
      };

      // interpolate url with our variables
      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!stationId || !sessionId){
          reject('No stationId or sessionId');
        }else{
          request
            .del(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body.data);
                resolve(res.body.data);
              }
            });
        }
      });

      return promise;

    },


    //===============================

    // region Vevo API
    //===============================

    searchVideo: function(videoObj, token){

      var artistName = videoObj.artist_name || videoObj.main_artist_name;

      var urlFormat = 'https://apiv2.vevo.com/search?query={{query}}&sortBy=MostViewedLastMonth&videosLimit=1&skippedVideos=0&artistsLimit=0&&token={{key}}';
      var interpolateVals = {
        query: artistName + ' - ' + videoObj.title,
        key: token
      };

      // interpolate url with our variables
      var url = S(urlFormat).template(interpolateVals).s;

      var promise = new Promise(function(resolve, reject){
        if(!videoObj){
          reject('No videoObj');
        }else{
          request
            .get(url)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body);
                resolve(res.body);
              }
            });
        }
      });

      return promise;
    },

    /*
      Get video streams for given isrc
      https://stg-apiv2.vevo.com/video/USUV71500848/streams/mp4?token=80Xd5X2t_GNQL6_3BNHZKlwiuOGFSHo5qptyr19z1O81.1435798800.MPOJO_NVnRfX2G3hT1SQOvRhJhZAP_9clptXes8w1FFDE69Rrjl_WyYvlNCOwv80kKIMTg2

      [
        {
          quality: "High",
          version: 4,
          isLive: false,
          url: "http://h264-aws.vevo.com/v3/h264/2015/04/USUV71500848/32ff7cba-2449-44fa-be23-102086c743e9/usuv71500848_high_1280x720_h264_2000_aac_128.mp4"
        },
        {
          quality: "Med",
          version: 4,
          isLive: false,
          url: "http://h264-aws.vevo.com/v3/h264/2015/04/USUV71500848/32ff7cba-2449-44fa-be23-102086c743e9/usuv71500848_med_480x360_h264_500_aac_128.mp4"
        },
        {
          quality: "Low",
          version: 4,
          isLive: false,
          url: "http://h264-aws.vevo.com/v3/h264/2015/04/USUV71500848/32ff7cba-2449-44fa-be23-102086c743e9/usuv71500848_low_176x144_h264_56_aac_128.mp4"
        }
      ]
    */
    getStreams: function(isrc, token){
        //NOTE: update token since we need to refresh it daily

        var urlFormat = 'http://apiv2.vevo.com/video/{{isrc}}/streams/mp4?token={{key}}';
        var interpolateVals = {
          isrc: isrc,
          key: token
        };

        // interpolate url with our variables
        var url = S(urlFormat).template(interpolateVals).s;

        var promise = new Promise(function(resolve, reject){
          if(!isrc){
            reject('No isrc');
          }else{
            request
              .get(url)
              .end(function(err, res){
                if(err){
                  console.log("err: ", err);
                  reject(err);
                }else{
                  console.log("res: ", res.body);
                  resolve(res.body);
                }
              });
          }
        });

        return promise;
    },

    getVevoToken: function(){

      var url = 'https://apiv2.vevo.com/oauth/token';
      var postData = {
        'client_id': "e962a4ae0b634065b774729ee601a82b",
        'client_secret': "9794fb3bcd4b47488380c2bc9e5ef618",
        'grant_type': 'client_credentials',
        'country': "us",
        'locale': "en-us"
      };

      var promise = new Promise(function(resolve, reject){
          request
            .post(url)
            .send(postData)
            .end(function(err, res){
              if(err){
                console.log("err: ", err);
                reject(err);
              }else{
                console.log("res: ", res.body);
                resolve(res.body);
              }
            });
      });

      return promise;
    }

    //===============================

 };

})();
