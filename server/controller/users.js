const User = require('../models/user'),
	path = require('path');
	request = require('request'),
	querystring = require('querystring'),
	client_id = '0466c059bcf9445b900d493d0d29a087',
	client_secret = 'd9a906cbb0974cc3abb168cf8dc676dc',
	redirect_uri = 'http://localhost:8888/callback',
	stateKey = 'spotify_auth_state';

var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

// requesting access token from refresh token
var getAccessToken = function () {
	console.log("userID is " + userID)
	User.find({spotify_id: userID})
		.then(user => {
			console.log("entered query")
			var authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				headers: {
					'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
				},
				form: {
					grant_type: 'refresh_token',
					refresh_token: user['refresh_token']
				},
				json: true
			};
		
			request.post(authOptions, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					console.log("access token: " + body.access_token)
					return body.access_token;
				}
			});
		})
		.catch(err => console.log(err));

}

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
			})
		);
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

			request.post(authOptions, function (error, response, body) {
				if (!error && response.statusCode === 200) {

					let access_token = body.access_token
					let refresh_token = body.refresh_token;

					var options = {
						url: 'https://api.spotify.com/v1/me',
						headers: {'Authorization': 'Bearer ' + access_token},
						json: true
					};

					// use the access token to access the Spotify Web API
					request.get(options, function (error, response, body) {
						// console.log(body);

						// enter user into database if they don't already exist
						User.find({spotify_id: body.id})
							.then(data => {
								if (data.length == 0) {
									let user = new User({
										name: body.display_name,
										spotify_id: body.id,
										refresh_token: refresh_token
									});
									user.save()
										.then(user => console.log(user))
										.catch(err => console.log(err));
								}
							})
							.catch(err => console.log(err));
					});
					// res.redirect('/rooms');
					res.redirect('/rooms/' + refresh_token)
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
	get_song: async (req, res) => {
		console.log("get_song userID: " + userID)
		let access_token = await getAccessToken();
			try {
				console.log("return access token: " + access_token)
				var options = {
					url: 'http://api.spotify.com/v1/search?' +
						querystring.stringify({
							q: req.params.name,
							type: 'track'
						}),
					headers: {
						'Authorization': 'Bearer ' + access_token
					},
					json: true
				};
				request.get(options, (error, body) => {
					if (!error) {
						res.json({body});
					} else {
						res.json({error});
					}
				});
			} catch (e) {
				console.log(e)
			}
	},
	angular: (req, res) => {
		res.sendFile(path.resolve('./public/dist/public/index.html'));
	}
}