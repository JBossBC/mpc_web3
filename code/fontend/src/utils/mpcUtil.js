//TODO to resolve the mpc question
//Input should be hex
    // 随机生成指定范围内的 BigInt 数
    function randomBigInt(max) {
        const raw = Array.from({ length: max.toString(2).length - 1 }, () => Math.random() >= 0.5 ? '1' : '0').join('');
        return BigInt('0b' + raw) % max;
      }
  
      // 有限域加法
      function add(a, b, prime) {
        return (a + b) % prime;
      }
  
      // 有限域减法
      function sub(a, b, prime) {
        return (a - b + prime) % prime;
      }
  
      // 有限域乘法
      function mul(a, b, prime) {
        return (a * b) % prime;
      }
  
      // 有限域除法
      function div(a, b, prime) {
        const inv = modInverse(b, prime);
        return (a * inv) % prime;
      }
  
      // 模反元素
      function modInverse(a, m) {
        let [x, y] = [0n, 1n];
        let [lastX, lastY] = [1n, 0n];
        let [mod, quotient] = [m, 0n];
  
        while (mod !== 0n) {
          [quotient, mod] = [a / mod, a % mod];
          [a, x, lastX] = [mod, lastX - quotient * x, x];
          [y, lastY] = [lastY - quotient * y, y];
        }
  
        return (lastX + m) % m;
      }
  
      // 创建 n 个 t 阈值的 Shamir 秘密共享
    export  function encryptMPC(secret, n, t) {
        const prime = BigInt(2)**512n - 1n;
        console.log(prime>secret);
        const coeffs = Array.from({length: t - 1}, () => randomBigInt(prime));
        coeffs.unshift(secret);
  
        return [...Array(n).keys()].map((i) => {
          const x = BigInt(i + 1);
          const y = coeffs.reduce((acc, coeff) => add(mul(acc, x, prime), coeff, prime), 0n);
          return { index: i, value: y };
        });
      }
  
      // 恢复秘密
export      function decryptMPC(shares) {
    const prime = BigInt(2)**512n - 1n;
        let result = 0n;
         for(let i=0;i<shares.length;i++){
            shares[i].index=BigInt(shares[i].index);
         }
        for (let i = 0; i < shares.length; i++) {
          let term = shares[i].value;
          for (let j = 0; j < shares.length; j++) {
            if (i !== j) {
              const diff = sub(shares[j].index, shares[i].index, prime);
              const divisor = sub(shares[j].value, shares[i].value, prime);
              term = mul(term, div(diff, divisor, prime), prime);
            }
          }
          result = add(result, term, prime);
        }
  
        return result;
      }
  