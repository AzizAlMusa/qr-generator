const axios = require("axios");

requestConfig = {};

const getQRCode = ({ plainText: data, color = "000000", bgcolor = "ffffff" }) => {
  const url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=500x500&color=${color}&bgcolor=${bgcolor}&format=svg`;
  console.log(url);
  requestConfig.url = url;
  return axios(requestConfig);
};

module.exports = {
  getQRCode,
};
