

// 生成 RSA 密钥对
export const generateRSAKeyPair=async ()=> {
    const algorithm = {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: 'SHA-256'},
      };
      
      // 生成密钥对
      const keyPair = await window.crypto.subtle.generateKey(algorithm, true, ['encrypt', 'decrypt']);
    return keyPair;
  }
  
  // 使用公钥加密数据
  export const encryptWithRSA=async (publicKey, data)=> {
    let result;
    const algorithm = {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    };
   await crypto.subtle.encrypt(
      algorithm,
      publicKey,
      new TextEncoder().encode(data)
    ).then(data=>{
      result=data;
    });
    return btoa(String.fromCharCode(...new Uint8Array(result)));;
  }
  
  // 使用私钥解密数据
 export const decryptWithRSA=async (privateKey, encryptedData)=>{
  let result;
  console.log(privateKey);
  console.log(atob(privateKey));
  await crypto.subtle.importKey(
    'pkcs8',
    new Uint8Array(atob(privateKey)),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  ).then(async (privateK)=>{
    await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateK,
      encryptedData,
    ).then(data=>{
      console.log(data);
      result=data
    });
  })
    return new TextDecoder().decode(result);
  }
