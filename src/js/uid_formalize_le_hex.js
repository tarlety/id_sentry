'use strict';
const { UID_FORMAT } = require('./uid');

function uid_formalize_le_hex(uid, format) {
  // https://www.mifare.net/support/forum/topic/mifare-uid-number/
  switch (format) {
    case UID_FORMAT.BE_HEX:
      return uid.match(/../g).reverse().join('');
    case UID_FORMAT.LE_HEX:
      return uid;
    case UID_FORMAT.BE_DEC:
      return parseInt(uid, 10)
        .toString(16)
        .toUpperCase()
        .match(/../g)
        .reverse()
        .join('');
    case UID_FORMAT.LE_DEC:
      return parseInt(uid, 10).toString(16).toUpperCase();
    default:
      return uid;
  }
}
