import passport from 'passport';
import User from '../models/user';
import config from '../config';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

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