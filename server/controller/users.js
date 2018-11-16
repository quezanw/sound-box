const User = require('../models/user'),
    path = require('path');
    request = require('request'),
    querystring = require('querystring'),
    client_id = '0466c059bcf9445b900d493d0d29a087',
    client_secret = 'd9a906cbb0974cc3abb168cf8dc676dc',
    redirect_uri = 'http://localhost:8888/callback',
    stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = {
    login: (req, res) => {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);
        // your application requests authorization
        var scope = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
          }));
    },
    callback: (req, res) => {
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
      
        if (state === null || state !== storedState) {
          res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            }));
        } else {
          res.clearCookie(stateKey);
          var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
          };
      
          request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
      
              var access_token = body.access_token,
                  refresh_token = body.refresh_token;
      
              var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };
      
              // use the access token to access the Spotify Web API
              request.get(options, function(error, response, body) {
                console.log(body);
                // enter user into database if they don't already exist
                User.find({spotify_id: body.id})
                  .then(data => {
                    console.log(data)
                    if (data.length == 0) {
                      let user = new User({
                        name: body.display_name,
                        spotify_id: body.id
                      });
                      user.save()
                        .then(user => console.log(user))
                        .catch(err => console.log(err));
                    }
                    // store some user info in session to access later
                  })
                  .catch(err => console.log(err));
              });
      
              res.redirect('/rooms')
              // we can also pass the token to the browser to make requests from there
              // res.redirect('/#' +
              //   querystring.stringify({
              //     access_token: access_token,
              //     refresh_token: refresh_token
              //   }));
            } else {
              res.redirect('/#' +
                querystring.stringify({
                  error: 'invalid_token'
                }));
            }
          });
        }
    },
    angular: (req, res) => {
        res.sendFile(path.resolve('./public/dist/public/index.html'));
    }
}