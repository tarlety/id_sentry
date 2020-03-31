// references:
//  - http://www1.mtjh.kh.edu.tw/~t394/math/g1/person.htm

function validate_id_format(id) {
  if (id.length != 10) return false;
  if (id[1] != '1' && id[1] != '2') return false;

  const table = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

  const ix = table.indexOf(id[0]);
  if (ix == -1) return false;

  let sum = (ix + 10) / 10 + ((ix + 10) % 10) * 9;
  for (let i = 1; i < 10; i++) {
    const c = parseInt(id[i]);
    if (isNaN(c)) return false;
    sum = sum + c * mx[i];
  }
  if (sum % 10 != 0) return false;
  return true;
}

function validate_uid_format(uid) {
  if (uid.length == 8 && uid.replace(/[0-9a-fA-F]/g, '') == '') return true;
  if (uid.length == 10 && uid.replace(/[0-9]/g, '') == '') return true;
  return false;
}

function validate_cardid_format(cardid) {
  if (cardid.length == 12 || cardid.length == 16) {
    if ( cardid.replace(/[0-9]/g, '') == '') return true;
  }
  return false;
}

module.exports = { validate_id_format, validate_uid_format, validate_cardid_format };
