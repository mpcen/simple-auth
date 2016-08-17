import Authentication from './controllers/authentication';

export default function(app) {
	app.post('/signup', Authentication);
}