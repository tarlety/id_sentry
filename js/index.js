const config = require('./model/config');
const hash = require('./js/challenge');
const { validate_id_format, validate_uid_format } = require('./js/validate');
const { UID_FORMAT, uid_formalize_le_hex } = require('./js/uid');
const STATE = require('./js/state');
const { addRecord, getLastRecord } = require('./model/data');
const TEXT = require('./res/strings');

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
    version: 1,
    node_id: config.node_id,
    local_date: dt.toLocaleString(),
    json_date: dt.toJSON(),
    reader_type: state.uid_format,
    scan_type,
    scan_value: config.enable_hash_data
      ? hash(config.node_id + last_digest + state.id_scan)
      : state.id_scan,
    hashed: config.enable_hash_data
  };
  return record;
}

window.$ = window.jQuery = require('jquery');

$(document).ready(() => {
  $('#node').text(config.node_id);
  state.state = STATE.INIT;
  state_fast_forwarding();
});

document.addEventListener('keydown', e => {});

document.addEventListener('keyup', e => sm(e));

function challenge_id(id) {
  return config.login_ids_hash.includes(
    hash(config.node_id + config.nonce + id)
  );
}

function challenge_uid(uid) {
  return config.login_uids_hash.includes(
    hash(config.node_id + config.nonce + uid)
  );
}

function challenge_pwd(pwd) {
  return hash(config.node_id + config.nonce + pwd) == config.login_pwd_hash;
}

function state_fast_forwarding() {
  let next_state = state.state;

  if (next_state == STATE.INIT) {
    if (config.login_ids_hash && config.login_ids_hash.length != 0) {
      next_state = STATE.ID_WAITING_ALPHABET;
    } else {
      next_state = STATE.UID_WAITING_INIT;
    }
  }
  if (next_state == STATE.UID_WAITING_INIT) {
    if (
      (!config.login_uids_hash || config.login_uids_hash.length == 0) &&
      config.reader_type != ''
    ) {
      state.uid_format = config.reader_type;
      next_state = STATE.PWD_WAITING_INIT;
    }
  }
  if (next_state == STATE.PWD_WAITING_INIT) {
    if (!config.login_pwd_hash || config.login_pwd_hash == '') {
      next_state = STATE.ID_SCAN_INIT;
    }
  }
  if (next_state == STATE.UID_INVALID) {
    next_state = STATE.ID_WAITING_ALPHABET;
  }
  if (next_state == STATE.UID_INVALID_CONFIG) {
    next_state = STATE.DEINIT;
  }
  if (next_state == STATE.PWD_INVALID) {
    next_state = STATE.ID_WAITING_ALPHABET;
  }
  if (next_state == STATE.ID_SCAN_INVALID) {
    next_state = STATE.ID_SCAN_INIT;
  }

  if (next_state != state.state) {
    state.state = next_state;
    render();
  }
}

function sm(e) {
  state_fast_forwarding();

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
      } else if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
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
      } else if (e.keyCode == 13) {
        if (!validate_uid_format(state.login.uid)) {
          next_state = STATE.UID_INVALID;
        } else {
          state.uid_format = '';
          let uid_format_accepts = [];
          for (let format in UID_FORMAT) {
            if (challenge_uid(uid_formalize_le_hex(state.login.uid, format))) {
              uid_format_accepts.push(format);
            }
          }
          if (uid_format_accepts.length == 1) {
            state.uid_format = uid_format_accepts[0];
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
          addRecord(newRecord(config, getLastRecord(), state, 'invalid'));
          next_state = STATE.ID_SCAN_INVALID;
        }
      }
      break;
    default:
      break;
  }

  if (state.state != next_state) {
    state.state = next_state;
    render();
  }

  state_fast_forwarding();
}

function render() {
  switch (state.state) {
    case STATE.INIT:
      $('#info').text('');
      break;
    case STATE.DEINIT:
      $('#info').text(TEXT.END_OF_PROGRAM);
      break;
    case STATE.ID_WAITING_ALPHABET:
      $('#info').text(TEXT.SCAN_ID_CARD);
      break;
    case STATE.ID_WAITING_NUMBER:
      $('#info').text(TEXT.SCAN_ID_CARD);
      $('#warning').text('');
      break;
    case STATE.ID_WAITING_ENTER:
      $('#info').text(TEXT.SCAN_ID_CARD);
      break;
    case STATE.ID_INVALID:
      $('#warning').text(TEXT.INVALID_ID);
      state.state = STATE.ID_WAITING_ALPHABET;
      render();
      break;
    case STATE.UID_WAITING_INIT:
      $('#info').text(TEXT.SCAN_RFID_CARD);
      break;
    case STATE.UID_WAITING:
      $('#info').text(TEXT.SCAN_RFID_CARD);
      $('#warning').text('');
      break;
    case STATE.UID_INVALID:
      $('#warning').text(TEXT.INVALID_UID);
      break;
    case STATE.UID_INVALID_CONFIG:
      $('#warning').text(TEXT.INVALID_UID_IN_CONFIG);
      break;
    case STATE.PWD_WAITING_INIT:
      $('#info').text(TEXT.SCAN_PASSWORD);
      $('#warning').text('');
      break;
    case STATE.PWD_WAITING:
      break;
    case STATE.PWD_INVALID:
      $('#warning').text(TEXT.INVALID_PASSWORD);
      state.state = STATE.ID_WAITING_ALPHABET;
      render();
      break;
    case STATE.ID_SCAN_INIT:
      $('#info').text(TEXT.SCAN_INIT);
      break;
    case STATE.ID_SCAN:
      $('#info').text(TEXT.SCAN_WAITING);
      $('#warning').text('');
      break;
    case STATE.ID_SCAN_INVALID:
      $('#warning').text(TEXT.INVALID_ID_OR_UID);
      break;
    default:
      break;
  }
}
