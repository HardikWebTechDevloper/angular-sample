import * as CryptoJS from 'crypto-js';
export const encrytData = (data: Object) => {
  const currentDataTime = new Date().getTime();
  const pwdToken = `${currentDataTime}_api_dexp_2021`;
  var text = CryptoJS.AES.encrypt(JSON.stringify(data), pwdToken).toString();
  const headers = { requestedTime: currentDataTime.toString() };
  // const headers = { Secret_Key: currentDataTime.toString() };

  return { text, headers };
};
export const decryptData = (data: string, key: string) => {
  var bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encrytServerData = (data: any, pwdToken: string) => {
  console.log(typeof data);
  var ciphertext = CryptoJS.AES.encrypt(data, pwdToken).toString();
  return ciphertext;
};
