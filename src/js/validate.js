// references:
//  - http://www1.mtjh.kh.edu.tw/~t394/math/g1/person.htm

function validateIdFormat(id) {
  if (id.length !== 10) return false;
  if (id[1] !== '1' && id[1] !== '2') return false;

  const table = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

  const ix = table.indexOf(id[0]);
  if (ix === -1) return false;

  let sum = parseInt((ix + 10) / 10, 10) + ((ix + 10) % 10) * 9;
  for (let i = 1; i < 10; i += 1) {
    const c = parseInt(id[i], 10);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(c)) return false;
    sum += c * mx[i];
  }
  if (sum % 10 !== 0) return false;
  return true;
}

function validateUidFormat(uid) {
  if (uid.length === 8 && uid.replace(/[0-9a-fA-F]/g, '') === '') return true;
  if (uid.length === 10 && uid.replace(/[0-9]/g, '') === '') return true;
  return false;
}

function validateCardidFormat(cardid) {
  if (cardid.length === 16 && cardid.replace(/[0-9]/g, '') === '') return true;
  return false;
}

module.exports = {
  validateIdFormat,
  validateUidFormat,
  validateCardidFormat,
};
