package com.did.service.impl.UserAndAdmin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.did.entity.Shares;
import com.did.entity.User;
import com.did.entity.dto.LoginDTO;
import com.did.entity.dto.RegisterDTO;
import com.did.exception.AppException;
import com.did.mapper.UserMapper;
import com.did.result.PageResult;
import com.did.service.UserAndAdmin.UserService;
import com.did.util.JwtUtil;
import com.did.util.PBKDF2Util;
import com.did.util.RedisServiceImpl;
import com.did.util.UserHolder;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.did.constant.RedisConstants.*;


/**
 * @author lisihan
 * @Description 用户业务实现类
 * @date 2022/10/11-19:15
 */
@Service
public class UserServiceImpl implements UserService {
    @Resource
    UserMapper userMapper;
    @Resource
    RedisServiceImpl redisService;

    /**
     * 用户注册
     * @param registerDTO 用户注册信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(RegisterDTO registerDTO) {
        try {
            QueryWrapper<User> wrapper = new QueryWrapper<>();
            wrapper.eq("username", registerDTO);
            User user = userMapper.selectOne(wrapper);
            if (user != null) {
                throw new AppException("用户名已存在");
            }
            user = new User();
            String regEx = "[ _`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]|\n|\r|\t";
            Pattern p = Pattern.compile(regEx);
            Matcher m = p.matcher(registerDTO.getUsername());
            if (m.find()) {
                throw new AppException("用户名中不能含有特殊字符");
            }
            BeanUtils.copyProperties(registerDTO, user);
            try {
                user.setPassword(PBKDF2Util.generateStringPasswordHash(registerDTO.getPassword()));
            } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
                e.printStackTrace();
            }
            String verifyCode;
            try {
                verifyCode = (String) redisService.get(VERIFY_KEY + registerDTO.getKey());
            } catch (Exception e) {
                throw new AppException("验证码失效或出现其他错误");
            }
            if (!verifyCode.equalsIgnoreCase(registerDTO.getVerifyCode())) {
                redisService.del(VERIFY_KEY + registerDTO.getKey());
                throw new AppException("验证码错误");
            }
            try {
                userMapper.insert(user);
                redisService.del(VERIFY_KEY + registerDTO.getKey());
            } catch (Exception e) {
                throw new AppException("注册失败");
            }
        }catch (Exception e){
            throw new AppException("注册失败");
        }
//        String emailCode;
//        try {
//            emailCode = (String) redisService.get(EMAIL_VERIFY_KEY+user.getEmail());
//        } catch (Exception e) {
//            throw new AppException("邮箱验证码失效或出现其他错误");
//        }
//        if (!emailCode.equals(registerDTO.getEmailCode())) {
//            redisService.del(EMAIL_VERIFY_KEY+user.getEmail());
//            throw new AppException("邮箱验证码错误");
//        }
//        String verifyCode;
//        try {
//            verifyCode = (String) redisService.get(VERIFY_KEY+user.getUsername());
//        } catch (Exception e) {
//            throw new AppException("验证码失效或出现其他错误");
//        }
//        if (!verifyCode.equalsIgnoreCase(registerDTO.getVerifyCode())) {
//            redisService.del(VERIFY_KEY+user.getUsername());
//            throw new AppException("验证码错误");
//        }
//        try {
//            userMapper.insert(user);
////            redisService.del(VERIFY_KEY+user.getUsername());
////            redisService.del(EMAIL_VERIFY_KEY+user.getEmail());
//        } catch (Exception e) {
//            throw new AppException("注册失败");
//        }
    }

    /**
     * 用户登录
     * @param loginDTO 用户登录信息
     * @return token
     */
    @Override
    public String login(LoginDTO loginDTO) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("username", loginDTO.getUsername());
        User user = userMapper.selectOne(wrapper);
        if (user == null) {
            throw new AppException("用户名或密码错误");
        }
        try {
            if (!PBKDF2Util.validatePassword(loginDTO.getPassword(), user.getPassword())) {
                throw new AppException("用户名或密码错误");
            }
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        }
//        String verifyCode;
//        verifyCode = (String) redisService.get(VERIFY_KEY+user.getUsername());
//        if (verifyCode == null) {
//            throw new AppException("验证码失效");
//        }
//
//        if (!verifyCode.equalsIgnoreCase(loginDTO.getVerifyCode())) {
//            redisService.del(VERIFY_KEY+user.getUsername());
//            throw new AppException("验证码错误");
//        }
        String verifyCode;
        verifyCode = (String) redisService.get(VERIFY_KEY + loginDTO.getKey());
        if (verifyCode == null) {
            throw new AppException("验证码失效");
        }

        if (!verifyCode.equalsIgnoreCase(loginDTO.getVerifyCode())) {
            redisService.del(VERIFY_KEY + loginDTO.getKey());
            throw new AppException("验证码错误");
        }
        String token = JwtUtil.createJwt(user.getUsername());
        redisService.set(LOGIN_USER_KEY+user.getUsername(), user, LOGIN_USER_TTL);
        UserHolder.saveUser(user);
        User user1 = UserHolder.getUser();
        System.out.println("user1:" + user1);
        redisService.del(VERIFY_KEY+user.getUsername());
        return token;
    }



//    /**
//     * 查询所有用户
//     * @param currentPage 当前页数
//     * @return 分页结果集
//     */
//    @Override
//    public PageResult showUsers(int currentPage) {
//        Page<User> page = new Page<>(currentPage, 10);
//        QueryWrapper<User> wrapper = new QueryWrapper<>();
//        wrapper.select("username", "nickname", "identity", "phone_number", "email", "age", "true_name").eq("deleted",0);
//        Page<User> selectPage = userMapper.selectPage(page, wrapper);
//        PageResult result = null;
//        if (selectPage != null) {
//            if (selectPage.getRecords().size() != 0 && currentPage > 0) {
//                result = new PageResult(selectPage);
//            } else {
//                throw new AppException("索引越界");
//            }
//        } else {
//            throw new AppException("查询失败");
//        }
//        return result;
//    }

}
