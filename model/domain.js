// AAA-BBB-CC
// AAA: administrative agency id
// BBB: building id
// CC: entry id
function domain_id2text(id) {
  return {
    '000-000-00': '登記處',
    '001-001-01': '市府大樓前門登記處',
    '001-001-02': '市府大樓後門登記處'
  }[id];
}

module.exports = { domain_id2text };
