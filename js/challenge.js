const crypto = require('crypto');

function hash(data) {
const default_pwd = 'REALLYBAD';
  const sha256 = crypto.createHash('sha256');
  return sha256.update(data).digest('base64');
}

module.exports = hash;
