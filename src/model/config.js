const Store = require('electron-store');
const { UID_FORMAT } = require('../js/uid');
const hash = require('../js/challenge');

const store = new Store({
  name: 'id-sentry-config',
});

let config = store.get('config');

if (!config) {
  const defaults = {
    node_id: '000-000-00',
    nonce: 'ABD910FE',
  };

  config = {
    version: 1,
    node_id: defaults.node_id,
    nonce: defaults.nonce,
    login_ids_hash: ['A123456789'].map((id) =>
      hash(defaults.node_id + defaults.nonce + id)
    ),
    login_uids_hash: ['FFFFFFFE', '00112233'].map((uid) =>
      hash(defaults.node_id + defaults.nonce + uid)
    ),
    login_pwd_hash: hash(`${defaults.node_id + defaults.nonce}PLZIGNOREME`),
    reader_type: UID_FORMAT.LE_HEX,
    enable_hash_data: false,
    enable_encrypt_data: false,
    prod: false,
  };

  store.set('config', config);
}

module.exports = config;
