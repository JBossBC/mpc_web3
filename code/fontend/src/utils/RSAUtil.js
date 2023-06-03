

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
  // const privateKeyObj= await crypto.subtle.importKey('pkcs8',privateKey,{
  //   name:"RSA-OAEP",
  //   hash:"SHA-256",
  // },true,['decrypt'])
   console.log(privateKey);
   console.log(typeof privateKey == CryptoKey);
   const binaryStr = atob(encryptedData);
   const arrayBuffer = new Uint8Array(binaryStr.length);

for (let i = 0; i < binaryStr.length; i++) {
  arrayBuffer[i] = binaryStr.charCodeAt(i);
}
    await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      arrayBuffer
    ).then(data=>{
      console.log(data);
      result=data
    });
    console.log(result);
const uint8Array = new Uint8Array(result);
const textDecoder = new TextDecoder('utf-8');
const jsonString = textDecoder.decode(uint8Array);
const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  }
