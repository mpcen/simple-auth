import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema ({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

userSchema.pre('save', function(next) {
	const user = this;

	bcrypt.genSalt(10, function(err, salt) {
		if(err) { return next(err); }

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) { return next(err); }

			user.password = hash;

			next();
		});
	});
});

const ModelClass = mongoose.model('user', userSchema);

export default ModelClass;