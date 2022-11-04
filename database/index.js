const {
    accounts,
    tenants,
    schedule,
    skus,
    inputs,
    steps,
    workflows,
    workflowInputs,
    workflowSteps,
    lineItems,
    invoices,
    invoiceLineItems
} = require('./schema.js');
const {creatPool} = require('./pool.js');

async function createAccounts(pool) {
    await pool.query(accounts);

    await pool.query(
        `INSERT INTO "accounts" ("id", "name")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['a8d3a0f1-f454-4f50-bf7e-8276e4bc45b5', 'Lumon Industries']);
    await pool.query(
        `INSERT INTO "accounts" ("id", "name")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ["a2ed7f7d-8c18-4a7b-ae26-0626b44d2da7", "Los Pollos Hermanos"]);
    await pool.query(
        `INSERT INTO "accounts" ("id", "name")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ["26b881c9-a362-4fb1-8c1c-ec1d4e99fd4b", "Soup Kitchen International"]);
    await pool.query(
        `INSERT INTO "accounts" ("id", "name")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ["573c0757-8810-4b15-860b-1611fc349ce3", "Crusty Crab"]);
}

async function createTenents(pool) {
    await pool.query(tenants);

    await pool.query(
        `INSERT INTO "tenants" ("id", "name")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['c24aec68-7cd0-456b-8d4c-faf95914654f', 'Decimal Accounting Services']);
}

async function createSkus(pool) {
    await pool.query(schedule);
    await pool.query(skus);

    await pool.query(
        `INSERT INTO "schedules" ("duration", "units")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, [3, 'month']);
    await pool.query(
        `INSERT INTO "schedules" ("duration", "units")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, [12, 'month']);

    await pool.query(
        `INSERT INTO "skus" ("id", "name", "is_deferred", "duration", "units")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['00001', 'Implementation Services', true, 3, 'month']);

    await pool.query(
        `INSERT INTO "skus" ("id", "name", "is_deferred", "duration", "units")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['00002', 'Annual Software License', true, 12, 'month']);

    await pool.query(
        `INSERT INTO "skus" ("id", "name", "is_deferred", "duration", "units")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['00003', 'One Time Processing Fee', false, null, null]);
}

async function createWorkflows(pool) {
    await pool.query(inputs);
    await pool.query(steps);
    await pool.query(workflows);
    await pool.query(workflowInputs);
    await pool.query(workflowSteps);

    await pool.query( 
        `INSERT INTO "inputs" ("name", "type")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['invoice', 'invoice']);
    await pool.query(
        `INSERT INTO "inputs" ("name", "type")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['dryrun', 'boolean']);

    await pool.query(
        `INSERT INTO "steps" ("id", "name", "step_order", "notify_on_error", "notify_on_completion", "requires_response")  
        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`, ['573c0757-8810-4b15-860b-1611fc349ce3', 'validate invoice', 1, true, false, false]);
    await pool.query(
        `INSERT INTO "steps" ("id", "name", "step_order", "notify_on_error", "notify_on_completion", "requires_response")  
        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`, ['7f1c5e5e-567f-4743-8463-a37a23af76d9', 'generate deferred revenue schedule', 2, true, false, false]);
    await pool.query(
        `INSERT INTO "steps" ("id", "name", "step_order", "notify_on_error", "notify_on_completion", "requires_response")  
        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`, ['77d38c71-c969-4439-8857-75969e1b84df', 'write schedule to source', 3, true, true, true]);

    await pool.query(
        `INSERT INTO "workflows" ("id", "name", "description")  
        VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', 'Deferred Revenue Schedule', 'Process an invoice and build the deferred revenue schedule']);

    await pool.query(
        `INSERT INTO "workflow_inputs" ("workflow_id", "input_name", "required")  
        VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', 'invoice', true]);
    await pool.query(
        `INSERT INTO "workflow_inputs" ("workflow_id", "input_name", "required")  
        VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', 'dryrun', false]);

    await pool.query(
        `INSERT INTO "workflow_steps" ("workflow_id", "step_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', '573c0757-8810-4b15-860b-1611fc349ce3']);
    await pool.query(
        `INSERT INTO "workflow_steps" ("workflow_id", "step_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', '7f1c5e5e-567f-4743-8463-a37a23af76d9']);
    await pool.query(
        `INSERT INTO "workflow_steps" ("workflow_id", "step_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['dcfb918d-befa-411d-adda-58f3eefd3e07', '77d38c71-c969-4439-8857-75969e1b84df']);
}

async function createInvoices(pool) {
    await pool.query(lineItems);
    await pool.query(invoices);
    await pool.query(invoiceLineItems);

    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['ee7766b6-5bf5-11ed-9b6a-0242ac120002', '00001', 1, 10000, "2022-10-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['390789cc-5bf6-11ed-9b6a-0242ac120002', '00002', 1, 120000, "2022-10-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['5bddeaea-5bf6-11ed-9b6a-0242ac120002', '00001', 1, 12000, "2022-09-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['712b2dd6-5bf6-11ed-9b6a-0242ac120002', '00002', 1, 165000, "2022-09-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['8bb2ad96-5bf6-11ed-9b6a-0242ac120002', '00003', 1, 500, "2022-09-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['aa2bc924-5bf6-11ed-9b6a-0242ac120002', '00001', 1, 3000, "2022-07-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['bf9eb24e-5bf6-11ed-9b6a-0242ac120002', '00002', 1, 42000, "2022-07-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['e3082bfc-5bf6-11ed-9b6a-0242ac120002', '00001', 1, 1000, "2022-05-01"]);
    await pool.query( 
        `INSERT INTO "line_items" ("id", "sku_id", "quantity", "amount", "start_date")  
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, ['e84cc0a0-5bf6-11ed-9b6a-0242ac120002', '00002', 1, 15000, "2022-05-01"]);

    await pool.query(
        `INSERT INTO "invoices" ("id", "tenant_id", "account_id", "created_date")  
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, ['ee654522-8f2f-4363-b47d-6ab6037fa0aa', 'c24aec68-7cd0-456b-8d4c-faf95914654f', 'a8d3a0f1-f454-4f50-bf7e-8276e4bc45b5', '2022-10-06T13:36:31+00:00']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['ee654522-8f2f-4363-b47d-6ab6037fa0aa', 'ee7766b6-5bf5-11ed-9b6a-0242ac120002']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['ee654522-8f2f-4363-b47d-6ab6037fa0aa', '390789cc-5bf6-11ed-9b6a-0242ac120002']);

    await pool.query(
        `INSERT INTO "invoices" ("id", "tenant_id", "account_id", "created_date")  
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, ['eaf9ebf2-6bac-4f37-b521-f34f61767875', 'c24aec68-7cd0-456b-8d4c-faf95914654f', 'a2ed7f7d-8c18-4a7b-ae26-0626b44d2da7', '2022-08-020T18:36:31+00:00']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['eaf9ebf2-6bac-4f37-b521-f34f61767875', '5bddeaea-5bf6-11ed-9b6a-0242ac120002']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['eaf9ebf2-6bac-4f37-b521-f34f61767875', '712b2dd6-5bf6-11ed-9b6a-0242ac120002']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['eaf9ebf2-6bac-4f37-b521-f34f61767875', '8bb2ad96-5bf6-11ed-9b6a-0242ac120002']);

    await pool.query(
        `INSERT INTO "invoices" ("id", "tenant_id", "account_id", "created_date")  
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, ['6d58bc11-9439-4721-a558-b61cc93b4e6f', 'c24aec68-7cd0-456b-8d4c-faf95914654f', '26b881c9-a362-4fb1-8c1c-ec1d4e99fd4b', '2022-06-08T13:36:31+00:00']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['6d58bc11-9439-4721-a558-b61cc93b4e6f', 'aa2bc924-5bf6-11ed-9b6a-0242ac120002']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['6d58bc11-9439-4721-a558-b61cc93b4e6f', 'bf9eb24e-5bf6-11ed-9b6a-0242ac120002']);

    await pool.query(
        `INSERT INTO "invoices" ("id", "tenant_id", "account_id", "created_date")  
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, ['05c6da2e-431c-404b-ab04-a53a16a9fe09', 'c24aec68-7cd0-456b-8d4c-faf95914654f', '573c0757-8810-4b15-860b-1611fc349ce3', '2022-04-02T12:36:31+00:00']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['05c6da2e-431c-404b-ab04-a53a16a9fe09', 'e3082bfc-5bf6-11ed-9b6a-0242ac120002']);
    await pool.query(
        `INSERT INTO "invoice_line_items" ("invoice_id", "line_item_id")  
        VALUES ($1, $2) ON CONFLICT DO NOTHING`, ['05c6da2e-431c-404b-ab04-a53a16a9fe09', 'e84cc0a0-5bf6-11ed-9b6a-0242ac120002']);
}

async function createDatabase(pool) {
    try {
        await createAccounts(pool); 
        await createTenents(pool);
        await createSkus(pool);
        await createWorkflows(pool);
        await createInvoices(pool);

        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
}

async function initializeDb() {
    const pool = creatPool();

    await createDatabase(pool);
}

module.exports = initializeDb;