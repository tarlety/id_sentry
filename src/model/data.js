const Store = require('electron-store');
const config = require('./config');

let records;
let data;

function initRecords(key) {
  const dt = new Date();
  const name = `id-sentry-data_${config.node_id}_${dt.getFullYear()}-${(
    dt.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${dt
    .getDate()
    .toString()
    .padStart(2, '0')}_${dt
    .getHours()
    .toString()
    .padStart(2, '0')}-${dt
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${dt.getSeconds().toString().padStart(2, '0')}`;

  data = new Store({
    name,
    encryptionKey: config.enable_encrypt_data ? key : null,
    schema: {
      version: { type: 'number', maximum: 100, minimum: 1, default: 1 },
      node_id: { type: 'string' },
      local_date: { type: 'string' },
      json_date: { type: 'string' },
      reader_type: { type: 'string' },
      scan_type: { type: 'string' },
      scan_value: { type: 'string' },
      hashed: { type: 'boolean' },
    },
  });

  records = data.get('records');
  if (!records) {
    records = [];
    data.set('records', records);
  }
}

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

module.exports = { initRecords, addRecord, getLastRecord, getRecords };
