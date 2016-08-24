import passport from 'passport';
import User from '../models/user';
import config from '../config';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';


// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this email and password, call done with the user
	// if it is the correct email and password
	// otherwise, call done with false
	User.findOne({ email: email }, function(err, user) {
		if(err) { return done(err); }

		if(!user) { return done(null, false); }

		// Compare passwords - is `password` equal to user.password?
		user.comparePassword(password, function(err, isMatch) {
			if(err) { return done(err); }

			if(!isMatch) { return done(null, false); }

			return done(null, user);
		});
	});
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new Strategy(jwtOptions, function(payload, done) {
	// See if the user ID in the payload exists in our DB
	User.findById(payload.sub, function(err, user) {
		if(err) { return done(err, false); }

		// If it does call 'done' with that user
		if(user) {
			done(null, user);
		}
		else {
			// Otherwise call done without a user object	
			done(null, false);
		}
	});
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);