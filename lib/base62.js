// Base62 encoding/decoding helper with BigInt + input hygiene guards
const base62 = (() => {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let map = null;

  const ensureBigInt = () => {
    if (typeof BigInt !== 'function') {
      throw new Error('BigInt is not supported in this environment');
    }
  };

  const initMap = () => {
    if (!map) {
      map = new Map(charset.map((char, index) => [char, index]));
    }
  };

  const sanitize = (value) => {
    return String(value)
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, '');
  };

  const encode = (input) => {
    ensureBigInt();

    let value = input;
    if (typeof value === 'number') {
      value = BigInt(value);
    } else if (typeof value === 'string') {
      value = BigInt(value);
    } else if (typeof value !== 'bigint') {
      throw new TypeError('Base62 encode expects a bigint, number, or numeric string.');
    }

    if (value < BigInt(0)) {
      throw new RangeError('Base62 encode does not support negative values.');
    }

    if (value === BigInt(0)) {
      return '0';
    }

    const base = BigInt(62);
    let result = '';
    let current = value;

    while (current > BigInt(0)) {
      const remainder = Number(current % base);
      result = charset[remainder] + result;
      current = current / base;
    }

    return result;
  };

  const decode = (input) => {
    ensureBigInt();
    initMap();

    const sanitized = sanitize(input);
    if (!sanitized) {
      throw new Error('Empty Base62 string.');
    }

    const base = BigInt(62);
    let value = BigInt(0);

    for (let i = 0; i < sanitized.length; i++) {
      const char = sanitized[i];
      const index = map.get(char);
      if (index === undefined) {
        const hex = char.codePointAt(0).toString(16).toUpperCase();
        throw new Error(`Invalid Base62 character '${char}' at position ${i} (U+${hex}).`);
      }
      value = value * base + BigInt(index);
    }

    return value;
  };

  return {
    charset,
    encode,
    decode,
    clean: sanitize
  };
})();