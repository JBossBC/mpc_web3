package com.did.controller;


import com.did.entity.Shares;
import com.did.entity.dto.LoginDTO;
import com.did.entity.dto.RegisterDTO;
import com.did.result.R;
import com.did.result.Result;
import com.did.service.UserAndAdmin.ShareService;
import com.did.service.UserAndAdmin.UserService;
import com.did.util.RedisServiceImpl;
import com.wf.captcha.SpecCaptcha;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static com.did.constant.RedisConstants.VERIFY_KEY;
import static com.did.constant.RedisConstants.VERIFY_KEY_TTL;


/**
 * @author lisihan
 * @Description UserController
 * @date 2022/10/11-19:46
 */
@RestController
@RequestMapping("/did")
public class UserController {
    @Resource
    UserService userService;
    @Resource
    RedisServiceImpl redisService;
    @Resource
    ShareService shareService;

    @Resource
    JavaMailSenderImpl mailSender;

    /**
     * 用户注册
     *
     * @param registerDTO 用户注册信息类
     * @return Result
     */
    @PostMapping("/register")
    public Result<String> userRegister(@Valid @RequestBody RegisterDTO registerDTO) {
        userService.register(registerDTO);
        return R.success();
    }

    @PostMapping("/login")
    public Result<String> userLogin(@Valid @RequestBody LoginDTO loginDTO) {
        String token = userService.login(loginDTO);
        return R.success(token);
    }

    @GetMapping("/getPK")
    public Result<String> getPK() {
        String publicKey = (String) redisService.get("publicKey");
        return R.success(publicKey);
    }

    @PostMapping("/getShare")
    public Result<String> getShare(@RequestParam("publicKey") String publicKey, @RequestParam("username") String username) throws Exception {
        String share = shareService.getShare(publicKey, username);
        return R.success(share);
    }

    @PostMapping("/create")
    public Result<String> createShare(@RequestBody Shares shares) throws Exception {
        shareService.createShare(shares);
        return R.success();
    }
    /**
     * 获取验证码
     * @param response HttpServletResponse
     */
    @GetMapping("/getCode")
    public Result<String> getCode(HttpServletResponse response, String key){
        redisService.del(VERIFY_KEY+key);
        ServletOutputStream outputStream = null;
        try {
            outputStream = response.getOutputStream();
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
        SpecCaptcha captcha = new SpecCaptcha(120, 40);
        captcha.setLen(4);
        String text = captcha.text();
        System.out.println("图片验证码"+text);
        redisService.set(VERIFY_KEY+key,text,VERIFY_KEY_TTL);
        return R.success(captcha.toBase64());
    }

    /**
     * 获取验证码
     * @param response HttpServletResponse
     */
    @GetMapping("/getCode1")
    public void getCode1(HttpServletResponse response,String key){
        redisService.del(VERIFY_KEY+key);
        ServletOutputStream outputStream = null;
        try {
            outputStream = response.getOutputStream();
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
        SpecCaptcha captcha = new SpecCaptcha(120, 40);
        captcha.setLen(4);
        String text = captcha.text();
        System.out.println("图片验证码"+text);
        redisService.set(VERIFY_KEY+key,text,VERIFY_KEY_TTL);
        captcha.out(outputStream);
    }
}
