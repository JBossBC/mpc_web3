package com.did;

import com.did.util.RSAOAEPUtils;
import com.did.util.RSAUtil;
import com.did.util.RedisServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

@SpringBootTest
class CoreApplicationTests {
    @Resource
    RedisServiceImpl redisService;

    @Test
    void contextLoads() throws Exception {
//        KeyPair keyPair = RSAOAEPUtils.generateKeyPair();
//        PublicKey publicKey = keyPair.getPublic();
//        PrivateKey privateKey = keyPair.getPrivate();
//        redisService.set("publicKey",RSAOAEPUtils.publicKeyToString(publicKey));
//        redisService.set("privateKey",RSAOAEPUtils.privateKeyToString(privateKey));
        String publicKey = (String) redisService.get("publicKey");
        String privateKey = (String) redisService.get("privateKey");
        // 将公钥字符串转换为公钥对象
        PublicKey restoredPublicKey = RSAOAEPUtils.publicKeyFromString(publicKey);

        // 将私钥字符串转换为私钥对象
        PrivateKey restoredPrivateKey = RSAOAEPUtils.privateKeyFromString(privateKey);
        // 转换公钥为字符串
        String publicKeyString = RSAOAEPUtils.publicKeyToString(restoredPublicKey);
        System.out.println("Public key string: " + publicKeyString);
        redisService.set("publicKey",publicKeyString);

        // 转换私钥为字符串
        String privateKeyString = RSAOAEPUtils.privateKeyToString(restoredPrivateKey);
        System.out.println("Private key string: " + privateKeyString);
        redisService.set("privateKey",privateKeyString);

        // 要加密的数据
        byte[] data = "assgjk68jnm568".getBytes();

        // 加密
        byte[] encryptedData = RSAOAEPUtils.encrypt(data, restoredPublicKey);
        String encryptedDataString = Base64.getEncoder().encodeToString(encryptedData);
        System.out.println("Encrypted data: " + encryptedDataString);

        // 解密
        byte[] decryptedData = RSAOAEPUtils.decrypt(Base64.getDecoder().decode(encryptedDataString), restoredPrivateKey);
        String decryptedDataString = new String(decryptedData);
        System.out.println("Decrypted data: " + decryptedDataString);

    }
}


