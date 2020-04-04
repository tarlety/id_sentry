'use strict';
const crypto = require('crypto');

function hash(data) {
  const sha256 = crypto.createHash('sha256');
  const hashed = sha256.update(data).digest('base64');
  return hashed;
}

module.exports = hash;
