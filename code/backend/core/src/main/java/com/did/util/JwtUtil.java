package com.did.util;

import io.jsonwebtoken.*;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

/**
 * @author lisihan
 * @Description jwt工具类
 * @date 2022/4/11-21:34
 */
public class JwtUtil {
    /**
     * 密钥
     */
    private static final String KEY = "8%p2MB@LHr9Zj7GPp&wvzF7%QTZCKZ7xJ5f3gxNBvRhG5f@moK53";

    /**
     * 过期时间
     */
    private static final Long TTL = 1000 * 60 * 60 * 10L;
//    private static final Long TTL = 12000 * 1800L;


    /**
     * 获取JWT
     * @param username 用户唯一标识
     * @return 返回一个JWT
     */
    public static String createJwt(String username){
        long nowMillis = System.currentTimeMillis();
        // 设置签名发布时间
        Date now = new Date(nowMillis);
        // 确定签名算法
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        // 生成签名密钥
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(KEY);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
        JwtBuilder jwt = Jwts.builder()
                .setHeaderParam("typ", "jwt")
                .setIssuedAt(now)
                .claim("username", username)
                .signWith(signingKey,signatureAlgorithm);
        if (TTL >= 0){
            long expMillis = nowMillis + TTL;
            jwt.setExpiration(new Date(expMillis));
        }
        return jwt.compact();
    }


    /**
     * 解析JWT
     * @param token JWT
     * @return Claim
     */
    public static Claims parseJwt(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(KEY))
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException ex) {
            return null;
        }
    }
}
