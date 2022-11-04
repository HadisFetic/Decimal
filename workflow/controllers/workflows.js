const {getPool} = require('../../database/pool.js');

const testWorkFlows = {
    path: '/workFlows',
    method: 'POST',
    async handler(request) {
        const {
            workflowId,
            invoiceId
        } = request;

        //const pool = getPool();

        return 'Hello, hapi!';
    }
};

const getWorkflows = {
    path: '/workFlows',
    method: 'GET',
    async handler(request) {
        const pool = getPool();

        const response = await pool.query(`SELECT * FROM tenants WHERE id = $1`,  ["c24aec68-7cd0-456b-8d4c-faf95914654f"]);
        
        return response.rows;
    }
};

module.exports = [
    testWorkFlows,
    getWorkflows
];