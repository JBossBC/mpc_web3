package com.did.service.impl.UserAndAdmin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.did.entity.Shares;
import com.did.entity.User;
import com.did.exception.AppException;
import com.did.mapper.ShareMapper;
import com.did.result.Result;
import com.did.service.UserAndAdmin.ShareService;
import com.did.util.RSAOAEPUtils;
import com.did.util.RSAUtil;
import com.did.util.RedisServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

/**
 * @author lisihan
 * @Description ShareService实现类
 * @date 2023/5/22-21:24
 */
@Service
public class ShareServiceImpl implements ShareService {
    @Resource
    ShareMapper shareMapper;
    @Resource
    RedisServiceImpl redisService;

    @Override
    public void createShare(Shares shares) throws Exception {

            QueryWrapper<Shares> wrapper = new QueryWrapper<>();
            wrapper.eq("username", shares);
            Shares myShare = shareMapper.selectOne(wrapper);
            if (myShare != null) {
                throw new AppException("用户名已存在");
            }
            myShare = new Shares();
            // 将私钥字符串转换为私钥对象
            PrivateKey restoredPrivateKey = RSAOAEPUtils.privateKeyFromString((String) redisService.get("privateKey"));
            System.out.println("1111111");
            String encryptedDataString = shares.getShare();
            System.out.println("encryptedDataString:" + encryptedDataString);
            byte[] decryptedData = RSAOAEPUtils.decrypt(Base64.getDecoder().decode(encryptedDataString), restoredPrivateKey);
            String deShares = new String(decryptedData);
            System.out.println("解密后的shares:" + deShares);
            shares.setShare(deShares);
            System.out.println("解密后的shares类：" + shares);
            BeanUtils.copyProperties(shares, myShare);
            shareMapper.insert(myShare);


    }

    @Override
    public String getShare(String publicKey, String username, String alias) throws Exception {
        QueryWrapper<Shares> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username).eq("alias", alias);
        Shares shares = shareMapper.selectOne(wrapper);
        if (shares == null) {
            throw new AppException("密钥不存在");
        }
        // 将公钥字符串转换为公钥对象
        PublicKey restoredPublicKey = RSAOAEPUtils.publicKeyFromString(publicKey);
        byte[] data = shares.getShare().getBytes();
        // 加密
        byte[] encryptedData = RSAOAEPUtils.encrypt(data, restoredPublicKey);
        String encryptedDataString = Base64.getEncoder().encodeToString(encryptedData);
        return encryptedDataString;
    }
}
