const accounts = "CREATE TABLE IF NOT EXISTS accounts ( id UUID PRIMARY KEY, name Varchar(50))";

const tenants = "CREATE TABLE IF NOT EXISTS tenants ( id UUID PRIMARY KEY, name VARCHAR(50))";

const schedule = "CREATE TABLE IF NOT EXISTS schedules (duration SMALLINT CHECK (duration > 0), units VARCHAR(10), PRIMARY KEY (duration, units))";
const skus = "CREATE TABLE IF NOT EXISTS skus ( id VARCHAR(5) PRIMARY KEY, name VARCHAR(50), is_deferred BOOLEAN, duration SMALLINT, units text, FOREIGN KEY (duration, units) REFERENCES schedules (duration, units) ON DELETE SET NULL)";

const inputs = "CREATE TABLE IF NOT EXISTS inputs (name VARCHAR(10) PRIMARY KEY, type VARCHAR(10))";
const steps = "CREATE TABLE IF NOT EXISTS steps ( id UUID PRIMARY KEY, name VARCHAR(50), step_order SMALLINT CHECK (step_order > 0), notify_on_error BOOLEAN, notify_on_completion BOOLEAN, requires_response BOOLEAN)";
const workflows = "CREATE TABLE IF NOT EXISTS workflows ( id UUID PRIMARY KEY, name VARCHAR(50), description VARCHAR(255))";
const workflowInputs = "CREATE TABLE IF NOT EXISTS workflow_inputs ( workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE, input_name VARCHAR(10) REFERENCES inputs(name) ON DELETE CASCADE, required BOOLEAN, PRIMARY KEY (workflow_id, input_name))";
const workflowSteps = "CREATE TABLE IF NOT EXISTS workflow_steps ( workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE, step_id UUID REFERENCES steps(id) ON DELETE CASCADE, PRIMARY KEY (workflow_id, step_id))";

const lineItems = "CREATE TABLE IF NOT EXISTS line_items ( id UUID PRIMARY KEY, sku_id VARCHAR(5) REFERENCES skus(id), quantity SMALLINT CHECK (quantity > 0), amount INTEGER CHECK (amount > 0), start_date DATE)";
const invoices = "CREATE TABLE IF NOT EXISTS invoices ( id UUID PRIMARY KEY, tenant_id UUID REFERENCES tenants(id), account_id UUID REFERENCES accounts(id), created_date timestamp DEFAULT CURRENT_TIMESTAMP)";
const invoiceLineItems = "CREATE TABLE IF NOT EXISTS invoice_line_items ( invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE, line_item_id UUID REFERENCES line_items(id) ON DELETE CASCADE, PRIMARY KEY (invoice_id, line_item_id))";

module.exports = {
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
};