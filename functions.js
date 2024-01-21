const f = {};

f.randomCode = () => {
  var pwdChars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var pwdLen = 10;
  var randomstring = Array(pwdLen)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  return randomstring;
};
f.urlFriendly = (value) => {
  return value == undefined
    ? ""
    : value
        .replace(/[\s+]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
};
f.datetimeNow = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};
f.setZero = (val) => {
  let z = parseInt(val);
  if (val <= 0) {
    z = 0;
  }
  return z;
};

module.exports = f;
