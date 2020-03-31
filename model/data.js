const config = require('./config');
const Store = require('electron-store');

const dt = new Date();

const data = new Store({
  name: 'id-sentry-data-' + config.node_id + '-' + dt.toJSON(),
  encryptionKey: config.enable_encrypt_data ? config.login_pwd_hash : null,
  schema: {
    version: { type: 'number', maximum: 100, minimum: 1, default: 1 },
    node_id: { type: 'string' },
    local_date: { type: 'string' },
    json_date: { type: 'string' },
    reader_type: { type: 'string' },
    scan_type: { type: 'string' },
    scan_value: { type: 'string' },
    hashed: { type: 'boolean' }
  }
});

let records = data.get('records') || [];

function getLastRecord() {
  return records.slice(-1)[0];
}

function addRecord(record) {
  records = [...records, record];
  data.set('records', records);
}

function getRecords() {
  return records;
}

module.exports = { addRecord, getLastRecord, getRecords };
