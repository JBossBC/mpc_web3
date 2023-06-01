package com.did.util;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class RSAOAEPUtils {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException, NoSuchProviderException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA", "BC");
        keyPairGenerator.initialize(2048);
        return keyPairGenerator.generateKeyPair();
    }

    public static byte[] encrypt(byte[] data, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(data);
    }

    public static byte[] decrypt(byte[] encryptedData, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding", "BC");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return cipher.doFinal(encryptedData);
    }

    public static String publicKeyToString(PublicKey publicKey) {
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    public static PublicKey publicKeyFromString(String publicKeyString) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(publicKeyString);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", "BC");
        return keyFactory.generatePublic(new X509EncodedKeySpec(keyBytes));
    }

    public static String privateKeyToString(PrivateKey privateKey) {
        return Base64.getEncoder().encodeToString(privateKey.getEncoded());
    }

    public static PrivateKey privateKeyFromString(String privateKeyString) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(privateKeyString);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA", "BC");
        return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    public static void main(String[] args) {
        try {
            // 生成密钥对
            KeyPair keyPair = RSAOAEPUtils.generateKeyPair();
            PublicKey publicKey = keyPair.getPublic();
            PrivateKey privateKey = keyPair.getPrivate();

            // 将公钥转换为字符串
            String publicKeyString = RSAOAEPUtils.publicKeyToString(publicKey);
            System.out.println("Public key string: " + publicKeyString);

            // 将私钥转换为字符串
            String privateKeyString = RSAOAEPUtils.privateKeyToString(privateKey);
            System.out.println("Private key string: " + privateKeyString);

            // 将公钥字符串转换为公钥对象
            PublicKey restoredPublicKey = RSAOAEPUtils.publicKeyFromString(publicKeyString);

            // 将私钥字符串转换为私钥对象
            PrivateKey restoredPrivateKey = RSAOAEPUtils.privateKeyFromString(privateKeyString);

            // 要加密的数据
            byte[] data = "Hello, RSA-OAEP!".getBytes();

            // 加密
            byte[] encryptedData = RSAOAEPUtils.encrypt(data, restoredPublicKey);
            String encryptedDataString = Base64.getEncoder().encodeToString(encryptedData);
            System.out.println("Encrypted data: " + encryptedDataString);

            // 解密
            byte[] decryptedData = RSAOAEPUtils.decrypt(Base64.getDecoder().decode(encryptedDataString), restoredPrivateKey);
            String decryptedDataString = new String(decryptedData);
            System.out.println("Decrypted data: " + decryptedDataString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
