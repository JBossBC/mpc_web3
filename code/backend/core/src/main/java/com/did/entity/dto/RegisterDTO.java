package com.did.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.io.Serializable;

/**
 * @author lisihan
 * @Description
 * @date 2023/5/22-20:36
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO implements Serializable {
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(max = 16, min = 5, message = "账号应为长度6-16的字符串")
    private String username;
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 30, message = "密码长度需大于6小于30")
    private String password;
    @NotBlank(message = "邮箱验证码不能为空")
    private String verifyCode;
    private String key;
}
