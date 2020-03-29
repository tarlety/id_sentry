const config = require('./model/config');
const hash = require('./js/challenge');
const { validate_id_format, validate_uid_format } = require('./js/validate');
const { UID_FORMAT, uid_formalize_le_hex } = require('./js/uid');
const STATE = require('./js/state');
const { addRecord, getLastRecord } = require('./model/data');

const state = {
  state: '',
  login: {
    id: '',
    uid: '',
    pwd: ''
  },
  uid_format: '',
  id_scan: ''
};

function newRecord(config, last_record, state, scan_type) {
  const dt = new Date();
  const last_digest =
    (last_record && last_record.scan_value) || config.login_id_hash;
  const record = {
    domain: config.domain_id,
    local_date: dt.toLocaleString(),
    json_date: dt.toJSON(),
    reader_type: state.uid_format,
    scan_type,
    scan_value: hash(config.domain_id + last_digest + state.id_scan)
  };
  return record;
}

window.$ = window.jQuery = require('jquery');

$(document).ready(() => {
  $('#domain').text(config.domain_id);
  state.state = STATE.ID_WAITING_ALPHABET;
  render();
});

document.addEventListener('keydown', e => {});

document.addEventListener('keyup', e => sm(e));

function challenge_id(id) {
  return hash(config.domain_id + id) == config.login_id_hash;
}

function challenge_uid(uid) {
  return hash(config.domain_id + uid) == config.login_uid_hash;
}

function challenge_pwd(pwd) {
  return hash(config.domain_id + pwd) == config.login_pwd_hash;
}

function sm(e) {
  let next_state = state.state;

  switch (state.state) {
    case '' | STATE.INIT:
      next_state = STATE.ID_WAITING_ALPHABET;
      break;
    case STATE.ID_WAITING_ALPHABET:
      state.login.id = '';
      if (e.keyCode == 13) {
        next_state = STATE.ID_INVALID;
      } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        state.login.id = e.code.slice(-1);
        next_state = STATE.ID_WAITING_NUMBER;
      }
      break;
    case STATE.ID_WAITING_NUMBER:
      if (e.keyCode == 13) {
        next_state = STATE.ID_INVALID;
      } else if (e.keyCode >= 48 && e.keyCode <= 57) {
        state.login.id += e.code.slice(-1);
      } else if (e.keyCode >= 96 && e.keyCode <= 105) {
        state.login.id += e.code.slice(-1);
      }

      if (state.login.id.length == 10) {
        next_state = STATE.ID_WAITING_ENTER;
      }
      break;
    case STATE.ID_WAITING_ENTER:
      if (
        e.keyCode == 13 &&
        validate_id_format(state.login.id) &&
        challenge_id(state.login.id)
      ) {
        next_state = STATE.UID_WAITING_INIT;
      } else {
        next_state = STATE.ID_INVALID;
      }
      break;
    case STATE.ID_INVALID:
      next_state = STATE.ID_WAITING_ALPHABET;
      break;
    case STATE.UID_WAITING_INIT:
      state.login.uid = '';
      if (
        (e.keyCode >= 65 && e.keyCode <= 70) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.uid = e.code.slice(-1);
        next_state = STATE.UID_WAITING;
      }
      break;
    case STATE.UID_WAITING:
      if (
        (e.keyCode >= 65 && e.keyCode <= 70) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.uid += e.code.slice(-1);
        next_state = STATE.UID_WAITING;
      } else if (e.keyCode == 13) {
        if (!validate_uid_format(state.login.uid)) {
          next_state = STATE.UID_INVALID;
        } else {
          state.uid_format = '';
          let uid_format_accepts = [];
          for (let format in UID_FORMAT) {
            if (challenge_uid(uid_formalize_le_hex(state.login.uid, format))) {
              uid_format_accepts.push(format);
              state.uid_format = format;
            }
          }
          if (uid_format_accepts.length == 1) {
            next_state = STATE.PWD_WAITING_INIT;
          } else if (uid_format_accepts.length == 0) {
            next_state = STATE.UID_INVALID;
          } else {
            next_state = STATE.UID_INVALID_CONFIG;
          }
        }
      }
      break;
    case STATE.PWD_WAITING_INIT:
      state.login.pwd = '';
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.pwd = e.code.slice(-1);
        next_state = STATE.PWD_WAITING;
      }
      break;
    case STATE.PWD_WAITING:
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.pwd += e.code.slice(-1);
        next_state = STATE.PWD_WAITING;
      } else if (e.keyCode == 13) {
        if (challenge_pwd(state.login.pwd)) {
          next_state = STATE.ID_SCAN_INIT;
        } else {
          next_state = STATE.PWD_INVALID;
        }
      }
      break;
    case STATE.ID_SCAN_INIT:
      state.id_scan = '';
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.id_scan = e.code.slice(-1);
        next_state = STATE.ID_SCAN;
      }
      break;
    case STATE.ID_SCAN:
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.id_scan += e.code.slice(-1);
        next_state = STATE.ID_SCAN;
      } else if (e.keyCode == 13) {
        if (validate_id_format(state.id_scan)) {
          addRecord(newRecord(config, getLastRecord(), state, 'id'));
          next_state = STATE.ID_SCAN_INIT;
        } else if (validate_uid_format(state.id_scan)) {
          addRecord(newRecord(config, getLastRecord(), state, 'uid'));
          next_state = STATE.ID_SCAN_INIT;
        } else {
          next_state = STATE.ID_SCAN_INVALID;
        }
      }
      break;
    default:
      break;
  }

  state.state = next_state;
  render();
}

function render() {
  switch (state.state) {
    case STATE.INIT:
      $('#info').text('');
      break;
    case STATE.DEINIT:
      $('#info').text('End of Program');
      break;
    case STATE.ID_WAITING_ALPHABET:
      $('#info').text('Scan your Identification card');
      break;
    case STATE.ID_WAITING_NUMBER:
      $('#info').text('Receiving Identification card:' + state.login.id);
      $('#warning').text('');
      break;
    case STATE.ID_WAITING_ENTER:
      $('#info').text('Waiting Enter...');
      break;
    case STATE.ID_INVALID:
      $('#warning').text('Invalid ID');
      state.state = STATE.ID_WAITING_ALPHABET;
      render();
      break;
    case STATE.UID_WAITING_INIT:
      $('#info').text('Scan your RFID card');
      break;
    case STATE.UID_WAITING:
      $('#info').text('Receiving RFID card UID:' + state.login.uid);
      $('#warning').text('');
      break;
    case STATE.UID_INVALID:
      $('#warning').text('Invalid UID');
      state.state = STATE.ID_WAITING_ALPHABET;
      render();
      break;
    case STATE.UID_INVALID_CONFIG:
      $('#warning').text('Invalid UID in config');
      state.state = STATE.DEINIT;
      render();
      break;
    case STATE.PWD_WAITING_INIT:
      $('#info').text('Scan the password');
      $('#warning').text('');
      break;
    case STATE.PWD_WAITING:
      $('#info').text('Getting Password:' + '*'.repeat(state.login.pwd.length));
      break;
    case STATE.PWD_INVALID:
      $('#warning').text('Invalid password');
      state.state = STATE.ID_WAITING_ALPHABET;
      render();
      break;
    case STATE.ID_SCAN_INIT:
      $('#info').text('Scan your ID or UID');
      break;
    case STATE.ID_SCAN:
      $('#info').text('Reading:' + state.id_scan);
      $('#warning').text('');
      break;
    case STATE.ID_SCAN_INVALID:
      $('#warning').text('Invalid ID or UID');
      state.state = STATE.ID_SCAN_INIT;
      render();
      break;
    default:
      break;
  }
}
