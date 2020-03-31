const hash = require('../js/challenge');
const Store = require('electron-store');

const config_store = new Store({
  name: 'id-sentry-config'
});

const default_domain_id = '000-000-00';
const default_login_id = 'A123456789';
const default_login_uid = 'FFFFFFFE';
const default_pwd = 'REALLYBAD';

const config = {
  domain_id: default_domain_id,
  login_id_hash: hash(default_domain_id + default_login_id),
  login_uid_hash: hash(default_domain_id + default_login_uid),
  login_pwd_hash: hash(default_domain_id + default_pwd),
  enable_encrypt_data: true,
  prod: false
};

module.exports = config;
