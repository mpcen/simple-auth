import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import http from 'http'
import routes from './routes';

import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/auth');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({ term: '*/*' }));

routes(app);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
	console.log('Listening on port:', port);
});