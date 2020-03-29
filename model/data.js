const config = require('./config');
const Store = require('electron-store');

const data = new Store({
  name: 'id-sentry-data-' + config.domain_id,
  encryptionKey: config.enable_encrypt_data ? config.login_pwd_hash : null
});

let records = data.get('records') || [];

function getLastRecord() {
  return records.slice(-1)[0];
}

function addRecord(record) {
  records = [...records, record];
  data.set('records', records);
}

module.exports = { addRecord, getLastRecord };
