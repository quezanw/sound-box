const path = require('path');
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

module.exports = {
	login: (req, res) => {
		var state = generateRandomString(16);
		res.cookie(stateKey, state);
		// your application requests authorization
		var scope = 'user-read-private user-read-email user-modify-playback-state';
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
						if (!error) {
							res.redirect('/rooms/' + refresh_token + '/' + body.id);
						} else {
							res.redirect('/#' +
								querystring.stringify({
									error: 'invalid_token'
								})
							);
						}
					});
				} else {
					res.redirect('/#' +
						querystring.stringify({
							error: 'invalid_token'
						})
					);
				}
			});
		}
	},
	get_song: (req, res) => {
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: req.params.refresh_token
			},
			json: true
		};
	
		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let access_token = body.access_token;
				var options = {
					url: 'http://api.spotify.com/v1/search?' +
						querystring.stringify({
							q: req.params.name,
							type: 'track',
							limit: '5'
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
			} else {
				res.json({error});
			}
		});
	},
	play_song: (req, res) => {
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: req.body.refresh_token
			},
			json: true
		};
	
		request.post(authOptions, function (error, response, body) {
			console.log(req.body.song_uri)
			if (!error && response.statusCode === 200) {
				let access_token = body.access_token;
				var options = {
					url: 'https://api.spotify.com/v1/me/player/play',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + access_token
					},
					form: JSON.stringify({
						uris: [req.body.song_uri]
					}),
					json: true
				};
				request.put(options, (error, body) => {
					if (!error) {
						res.json({body});
					} else {
						res.json({error});
					}
				});
			} else {
				res.json({error});
			}
		});
	},
	angular: (req, res) => {
		res.sendFile(path.resolve('./public/dist/public/index.html'));
    },
}