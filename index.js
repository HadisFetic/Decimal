const Hapi = require('hapi');
const WorkFlow = require('./workflow/index.js');
const DataBase = require('./database/index.js');

async function start() {
    const port = 3000;

    await DataBase();

    const server = Hapi.server({
        port: port,
        host: 'localhost'
    });
    
    await server.start().then(() => {
        console.log(`Server has started on port ${port}`);
    });

    server.route(WorkFlow);
}

start();