// Base62 encoding/decoding with BigInt support
const base62 = {
  charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  encode: (integer) => {
    if (integer === 0) {
      return '0';
    }
    let str = '';
    while (integer > 0) {
      str = base62.charset[integer % 62] + str;
      integer = BigInt(integer / 62n);
    }
    return str;
  },
  decode: (str) => {
    let result = 0n;
    const length = str.length;
    for (let i = 0; i < length; i++) {
      const char = str[i];
      const power = length - i - 1;
      const charIndex = base62.charset.indexOf(char);
      result += BigInt(charIndex) * (62n ** BigInt(power));
    }
    return result;
  }
};
