const axios = require("axios");

requestConfig = {};

const getQRCode = ({ plainText: data, color = "000000", bgcolor = "ffffff" }) => {
  const url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(data)}&size=500x500&color=${color}&bgcolor=${bgcolor}&format=svg`;

  requestConfig.url = url;
  return axios(requestConfig);
};

module.exports = {
  getQRCode,
};
