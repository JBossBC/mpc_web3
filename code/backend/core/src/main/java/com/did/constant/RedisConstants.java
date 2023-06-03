package com.did.constant;

/**
 * @author lisihan
 * @Description 常量
 * @date 2022/11/24-14:06
 */
public class RedisConstants {
    public static final String VERIFY_KEY = "verify:code:";
    public static final Long VERIFY_KEY_TTL = 60 * 5L;
    public static final String LOGIN_USER_KEY = "login:user:";
    public static final Long LOGIN_USER_TTL = 1000 * 60 * 60 * 10L;
}
