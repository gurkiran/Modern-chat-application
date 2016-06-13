import "source-map-support/register";

import {blegh} from 'shared/test';

blegh();

console.log('From Server');


import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import chalk from 'chalk';

const isDevelopement = process.env.NODE_ENV !== 'production';

// -------------------
// setup

const app = express();
const server = new http.Server(app);
const io = socketIo(server);


// // -------------------
// // client webpack
console.log(process.env.USE_WEBPACK);
if (process.env.USE_WEBPACK === 'true') {
    var webpackMiddleware = require('webpack-dev-middleware'),
        webpack = require('webpack'),
        clientConfig = require('../../webpack.client');
        
    const compiler = webpack(clientConfig);
    app.use(webpackMiddleware(compiler, {
        publicPath: '/build/',
        stats:{
            colors: true,
            chunks: false,
            assets: false,
            timings: false,
            modules: false,
            hash: false,
            version: false
        }
     }));
    
    console.log(chalk.bgRed('Using Webpack dev middleware ! This is for dev only'));
}

// // -------------------
// configure express 

app.set('view engine', 'jade');
app.use(express.static('public'));

const useExternalStyles = !isDevelopement; 

app.get('/', (req, res) => {
   res.render('index', {
      useExternalStyles 
   });
});


// -------------------
// Modules

// -------------------
// Socket

 io.on('connection', socket => {
    console.log(`Got connection from ${socket.request.connection.remoteAddress}`); 
 });

// -------------------
// Startup




const port = process.env.PORT || 3001;
function startServer() {
	server.listen(port, () => {
		console.log(`Started http server on ${port}`);
        
	});
}

startServer();