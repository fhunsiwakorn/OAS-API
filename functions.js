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
module.exports = f;
