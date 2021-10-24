const { ObjectId } = require('bson');

function getObjectId(stringId) {
  try {
    const objId = ObjectId(stringId);
    return objId;
  } catch {
    return '';
  }
}

function getRoomInviteLink(userId, roomName) {
  const cipher = (salt) => {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
  };

  return cipher('INV_LINK_GEN')(userId.concat(roomName));
}

module.exports = {
  getObjectId,
  getRoomInviteLink,
};
