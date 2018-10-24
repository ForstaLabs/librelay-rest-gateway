
const api = require('./api');
const bodyParser = require('body-parser');
const express = require('express');
const expressWS = require('express-ws');
const morgan = require('morgan');
const process = require('process');
const feathers = require('@feathersjs/feathers');
const app = feathers();

app.use('auth', {
    get: async name => {
        
    }
}

const port = process.env.PORT || '8086';
const listenAddr = process.env.LISTEN_ADDR || '127.0.0.1';


let _rejectCount = 0;
process.on('unhandledRejection', ev => {
    console.error(ev);
    if (_rejectCount++ > 100) {
        console.error("Reject count too high, killing process.");
        process.exit(1);
    }
});


async function main() {
    const app = express();
    expressWS(app);
    app.use(morgan('dev')); // logging
    app.use(bodyParser.json());
    app.use('/auth/', (new api.auth.AuthenticationV1({app})).router);
    app.use('/account/', (new api.account.AccountV1({app})).router);
    app.use('/devices/', (new api.devices.DevicesV1({app})).router);
    app.use('/messages/', (new api.messages.MessagesV1({app})).router);
    app.use((req, res, next) => {
        res.status(404).json({
            error: 'bad_request',
            message: 'not_found'
        });
    });
    app.use((error, req, res, next) => {
        console.error("Server error:", error);
        const message = error.message || error.toString();
        res.status(500).json({
            error: 'server',
            message
        });
    });
    app.listen(port, listenAddr);
}


main();
