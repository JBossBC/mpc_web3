package com.did.service.UserAndAdmin;

import com.did.entity.Shares;

/**
 * @author lisihan
 * @Description TODO
 * @date 2023/5/22-21:24
 */
public interface ShareService {
    /**
     * 添加分享
     * @param shares 分享实体类
     */
    void createShare(Shares shares) throws Exception;

    /**
     * 获得分享
     * @param publicKey
     * @param username
     * @return
     */
    String getShare(String publicKey,String username) throws Exception;
}
