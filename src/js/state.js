// application state
const STATE = {
  INIT: 'INIT',
  DEINIT: 'DEINIT',
  ID_WAITING_ALPHABET: 'ID_WAITING_ALPHABET',
  ID_WAITING_NUMBER: 'ID_WAITING_NUMBER',
  ID_WAITING_ENTER: 'ID_WAITING_ENTER',
  ID_INVALID: 'ID_INVALID',
  UID_WAITING_INIT: 'UID_WAITING_INIT',
  UID_WAITING: 'UID_WAITING',
  UID_INVALID: 'UID_INVALID',
  PWD_WAITING_INIT: 'PWD_WAITING_INIT',
  PWD_WAITING: 'PWD_WAITING',
  PWD_INVALID: 'PWD_INVALID',
  ID_SCAN_INIT: 'ID_SCAN_INIT',
  ID_SCAN: 'ID_SCAN',
  ID_SCAN_INVALID: 'ID_SCAN_INVALID',
};

module.exports = STATE;
