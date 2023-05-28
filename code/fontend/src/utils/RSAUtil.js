import { base64 } from "ethers/lib/utils";

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
   await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      new TextEncoder().encode(data)
    ).then(data=>{
      result=btoa(data);
    });
    return result;
  }
  
  // 使用私钥解密数据
 export const decryptWithRSA=async (privateKey, encryptedData)=>{
  let result;
    await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedData
    ).then(data=>{
      result=data
    });
    return new TextDecoder().decode(result);
  }
