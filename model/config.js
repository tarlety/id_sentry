const { UID_FORMAT } = require('../js/uid');
const hash = require('../js/challenge');
const Store = require('electron-store');

const config_store = new Store({
  name: 'id-sentry-config'
});

let config = config_store.get('config');

if (!config) {
  const default_node_id = '000-000-00';
  const default_nonce = 'ABD910FE';

  config = {
    version: 1,
    node_id: default_node_id,
    nonce: default_nonce,
    login_ids_hash: ['A123456789'].map(id =>
      hash(default_node_id + default_nonce + id)
    ),
    login_uids_hash: ['FFFFFFFE', '00112233'].map(uid =>
      hash(default_node_id + default_nonce + uid)
    ),
    login_pwd_hash: hash(default_node_id + default_nonce + 'PLZIGNOREME'),
    reader_type: UID_FORMAT.LE_HEX,
    enable_hash_data: false,
    enable_encrypt_data: false,
    prod: false
  };

  config_store.set('config', config);
}

module.exports = config;
