// Imports
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';

import routes from './routes'; // routes.ts file used here

const API: Express = express();

// ====================================
API.use(morgan('dev'));
API.use(express.urlencoded({ extended: false }));
API.use(express.json());


API.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});
// ====================================

// The API can access the points from routes.ts
API.use('/', routes);

// Error handling
API.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

// Creates the server @ port 6060
const httpServer = http.createServer(API);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));