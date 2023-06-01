package com.did.service.UserAndAdmin;



import com.did.entity.dto.LoginDTO;
import com.did.entity.dto.RegisterDTO;


/**
 * @author lisihan
 * @Description 用户业务接口
 * @date 2023/5/22-20:45
 */

public interface UserService {
    /**
     * 用户注册
     * @param registerDTO 用户注册信息
     */
    void register(RegisterDTO registerDTO);

    /**
     * 用户登录
     * @param loginDTO 用户登录信息
     * @return token
     */
    String login(LoginDTO loginDTO);

}
