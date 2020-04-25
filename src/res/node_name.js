// AAA-BBB-CC
// AAA: administrative agency id
// BBB: building id
// CC: entry id
function nodeName(id) {
  return {
    '000-000-00': '登記處',
    '001-001-00': '市府大樓登記處',
    '001-001-01': '市府大樓前門登記處',
    '001-001-02': '市府大樓後門登記處',
  }[id];
}

module.exports = { nodeName };
