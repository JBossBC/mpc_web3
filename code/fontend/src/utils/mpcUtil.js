export function encryptMPC(secret) {
    const t = 3;
    const k = 2;
  
    if (t < k) {
      throw new Error('t must be greater than or equal to k');
    }
  
    const coefficients = [secret];
    for (let i = 1; i < k; i++) {
      coefficients.push(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
    }
  
    const points = [];
    for (let x = 1; x <= t; x++) {
      let y = BigInt(0);
      for (let i = 0; i < coefficients.length; i++) {
        y += coefficients[i] * BigInt(x) ** BigInt(i);
      }
      points.push({ x: BigInt(x), y: y });
    }
  
    return  points;
  }
  
export  function decryptMPC(shares) {
    const xs = shares.map((share) => share.x);
    const ys = shares.map((share) => share.y);
  
    const summands = [];
    for (let i = 0; i < xs.length; i++) {
      let numerator = BigInt(1);
      let denominator = BigInt(1);
      for (let j = 0; j < xs.length; j++) {
        if (j !== i) {
          numerator *= -xs[j];
          denominator *= xs[i] - xs[j];
        }
      }
      summands.push(ys[i] * numerator * modInverse(denominator, BigInt(Number.MAX_SAFE_INTEGER + 1)));
    }
  
    return summands.reduce((sum, value) => sum + value);
  }
  
  function modInverse(a, b) {
    let b0 = b;
    let x0 = BigInt(0);
    let x1 = BigInt(1);
    if (b === BigInt(1)) {
      return BigInt(1);
    }
    while (a > 1) {
      let q = a / b;
      let tmp = a;
      a = b;
      b = tmp % b;
      tmp = x0;
      x0 = x1 - q * x0;
      x1 = tmp;
    }
    if (x1 < 0) {
      x1 += b0;
    }
    return x1;
  }