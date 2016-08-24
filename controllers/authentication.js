import jwt from 'jwt-simple';
import User from '../models/user';
import config from '../config';

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export function signup(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password) {
		return res.send({ error: 'You must enter an email and password' });
	}

	// Check to see if user exists
	User.findOne({ email: email }, (err, existingUser) => {
		if(err) { return next(err); }

		// If user exists, return an error
		if(existingUser) {
			return res.status(422).send({ error: 'Email already exists' });
		}

		// If user doesnt exist, create and save user to DB
		const user = new User({
			email: email,
			password: password
		});

		user.save((err) => {
			if(err) { return next(err); }
		});

		// Let the user know that the creation was successful
		res.send({ token: tokenForUser(user) });
	});	
}