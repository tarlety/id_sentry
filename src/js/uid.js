const UID_FORMAT = {
  BE_HEX: 'BE_HEX',
  LE_HEX: 'LE_HEX',
  BE_DEC: 'BE_DEC',
  LE_DEC: 'LE_DEC',
};

function formalizeUidAsLeHex(uid, format) {
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

module.exports = { UID_FORMAT, formalizeUidAsLeHex };
