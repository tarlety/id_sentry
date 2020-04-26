/* globals $:false */

const jquery = require('jquery');
const commit = require('../commit');
const config = require('./model/config');
const hash = require('./js/challenge');
const {
  validateIdFormat,
  validateUidFormat,
  validateCardidFormat,
} = require('./js/validate');
const { UID_FORMAT, formalizeUidAsLeHex } = require('./js/uid');
const STATE = require('./js/state');
const {
  initRecords,
  addRecord,
  getLastRecord,
  getRecords,
} = require('./model/data');
const { nodeName } = require('./res/node_name');
const TEXT = require('./res/strings');

const state = {
  state: '',
  login: {
    id: '',
    uid: '',
    pwd: '',
  },
  uid_format: '',
  id_scan: '',
  fastForwarding: () => {},
  sm: () => {},
  render: () => {},
};

function newRecord(lastRecord, scanType) {
  const dt = new Date();
  const lastDigest = (lastRecord && lastRecord.scan_value) || config.nonce;
  const record = {
    version: 1,
    node_id: config.node_id,
    local_date: dt.toLocaleString(),
    json_date: dt.toJSON(),
    reader_type: state.uid_format,
    scan_type: scanType,
    scan_value: config.enable_hash_data
      ? hash(config.node_id + lastDigest + state.id_scan)
      : state.id_scan,
    hashed: config.enable_hash_data,
  };
  return record;
}

function countValidRecords() {
  const records = getRecords();
  const validRecords = records.filter((record) => {
    return record.scanType !== 'invalid';
  });
  return validRecords.length;
}

window.$ = jquery;
window.jQuery = jquery;

$(document).ready(() => {
  $('#node').text(nodeName(config.node_id));
  state.state = STATE.INIT;
  state.render();
  state.fastForwarding();
});

document.addEventListener('keydown', () => {});

document.addEventListener('keyup', (e) => state.sm(e));

function challengeId(id) {
  return config.login_ids_hash.includes(
    hash(config.node_id + config.nonce + id)
  );
}

function challengeUid(uid) {
  return config.login_uids_hash.includes(
    hash(config.node_id + config.nonce + uid)
  );
}

function challengePwd(pwd) {
  return hash(config.node_id + config.nonce + pwd) === config.login_pwd_hash;
}

function fastForwarding() {
  let nextState = state.state;

  if (nextState === STATE.INIT) {
    if (config.login_ids_hash && config.login_ids_hash.length !== 0) {
      nextState = STATE.ID_WAITING_ALPHABET;
    } else {
      nextState = STATE.UID_WAITING_INIT;
    }
  }
  if (nextState === STATE.UID_WAITING_INIT) {
    if (!config.login_uids_hash || config.login_uids_hash.length === 0) {
      state.uid_format = '';
      nextState = STATE.PWD_WAITING_INIT;
    }
  }
  if (nextState === STATE.PWD_WAITING_INIT) {
    if (!config.login_pwd_hash || config.login_pwd_hash === '') {
      initRecords('');
      nextState = STATE.ID_SCAN_INIT;
    }
  }
  if (nextState === STATE.ID_INVALID) {
    nextState = STATE.ID_WAITING_ALPHABET;
  }
  if (nextState === STATE.UID_INVALID) {
    nextState = STATE.UID_WAITING_INIT;
  }
  if (nextState === STATE.UID_INVALID_CONFIG) {
    nextState = STATE.DEINIT;
  }
  if (nextState === STATE.PWD_INVALID) {
    nextState = STATE.PWD_WAITING_INIT;
  }
  if (nextState === STATE.ID_SCAN_INVALID) {
    nextState = STATE.ID_SCAN_INIT;
  }

  if (nextState !== state.state) {
    state.state = nextState;
    state.render();
  }
}

function sm(e) {
  let nextState = state.state;

  switch (state.state) {
    case '':
    case STATE.INIT:
      nextState = STATE.ID_WAITING_ALPHABET;
      break;
    case STATE.ID_WAITING_ALPHABET:
      state.login.id = '';
      if (e.keyCode === 13) {
        nextState = STATE.ID_INVALID;
      } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        state.login.id = e.code.slice(-1);
        nextState = STATE.ID_WAITING_NUMBER;
      }
      break;
    case STATE.ID_WAITING_NUMBER:
      if (e.keyCode === 13) {
        nextState = STATE.ID_INVALID;
      } else if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.id += e.code.slice(-1);
      }

      if (state.login.id.length === 10) {
        nextState = STATE.ID_WAITING_ENTER;
      }
      break;
    case STATE.ID_WAITING_ENTER:
      if (
        e.keyCode === 13 &&
        validateIdFormat(state.login.id) &&
        challengeId(state.login.id)
      ) {
        nextState = STATE.UID_WAITING_INIT;
      } else {
        nextState = STATE.ID_INVALID;
      }
      break;
    case STATE.ID_INVALID:
      nextState = STATE.ID_WAITING_ALPHABET;
      break;
    case STATE.UID_WAITING_INIT:
      state.login.uid = '';
      if (
        (e.keyCode >= 65 && e.keyCode <= 70) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.uid = e.code.slice(-1);
        nextState = STATE.UID_WAITING;
      }
      break;
    case STATE.UID_WAITING:
      if (
        (e.keyCode >= 65 && e.keyCode <= 70) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.uid += e.code.slice(-1);
      } else if (e.keyCode === 13) {
        if (!validateUidFormat(state.login.uid)) {
          nextState = STATE.UID_INVALID;
        } else {
          state.uid_format = '';
          const accepts = Object.keys(UID_FORMAT).filter((format) => {
            return challengeUid(formalizeUidAsLeHex(state.login.uid, format));
          });
          if (accepts.length === 1) {
            state.uid_format = accepts[0];
            nextState = STATE.PWD_WAITING_INIT;
          } else if (accepts.length === 0) {
            nextState = STATE.UID_INVALID;
          } else {
            nextState = STATE.UID_INVALID_CONFIG;
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
        nextState = STATE.PWD_WAITING;
      }
      break;
    case STATE.PWD_WAITING:
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.login.pwd += e.code.slice(-1);
        nextState = STATE.PWD_WAITING;
      } else if (e.keyCode === 13) {
        if (challengePwd(state.login.pwd)) {
          initRecords(state.login.pwd);
          nextState = STATE.ID_SCAN_INIT;
        } else {
          nextState = STATE.PWD_INVALID;
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
        nextState = STATE.ID_SCAN;
      }
      break;
    case STATE.ID_SCAN:
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        state.id_scan += e.code.slice(-1);
        nextState = STATE.ID_SCAN;
      } else if (e.keyCode === 13) {
        if (validateIdFormat(state.id_scan)) {
          addRecord(newRecord(getLastRecord(), 'id'));
          nextState = STATE.ID_SCAN_INIT;
        } else if (validateUidFormat(state.id_scan)) {
          addRecord(newRecord(getLastRecord(), 'uid'));
          nextState = STATE.ID_SCAN_INIT;
        } else if (validateCardidFormat(state.id_scan)) {
          addRecord(newRecord(getLastRecord(), 'cardid'));
          nextState = STATE.ID_SCAN_INIT;
        } else {
          addRecord(newRecord(getLastRecord(), 'invalid'));
          nextState = STATE.ID_SCAN_INVALID;
        }
      }
      break;
    default:
      break;
  }

  if (state.state !== nextState) {
    state.state = nextState;
    state.render();
  }

  state.fastForwarding();
}

function render() {
  switch (state.state) {
    case STATE.INIT:
      document.title = TEXT.TITLE;
      $('#info').text('');
      {
        const dt = new Date(commit.date);
        // prettier-ignore
        $('#commit').text(
          `${commit.number}${commit.developing ? '+' : ''}: ${
            dt.toLocaleDateString()} ${
            dt.toLocaleTimeString()}`
        );
      }
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
      break;
    case STATE.PWD_WAITING:
      $('#info').text(TEXT.PASSWORD_SCANNING);
      $('#warning').text('');
      break;
    case STATE.PWD_INVALID:
      $('#warning').text(TEXT.INVALID_PASSWORD);
      break;
    case STATE.ID_SCAN_INIT:
      $('#info').text(TEXT.SCAN_INIT);
      $('#info').removeClass('info-scanning');
      $('#count').text(
        TEXT.SCAN_COUNT_PRE + countValidRecords() + TEXT.SCAN_COUNT_POST
      );
      break;
    case STATE.ID_SCAN:
      $('#info').text(TEXT.SCAN_WAITING);
      $('#info').addClass('info-scanning');
      $('#warning').text('');
      break;
    case STATE.ID_SCAN_INVALID:
      $('#info').text('');
      $('#info').removeClass('info-scanning');
      $('#warning').text(TEXT.INVALID_ID_OR_UID);
      break;
    default:
      break;
  }
}

state.fastForwarding = fastForwarding;
state.sm = sm;
state.render = render;
