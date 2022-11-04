const pg = require('pg');

let pool;

function getPool() {
    if (!pool) {
        throw new Error('Connection doesn\'t exist');
    }

    return pool;
}

function creatPool() {
    if (pool) {
        return pool;
    } else {
        pool = new pg.Pool({
            user                : 'postgres',
            password            : 'password',
            host                : '127.0.0.1',
            port                : 5432
        });
    }

    return pool;
}

module.exports = {
    getPool,
    creatPool
};