package com.did.exception;

/**
 * @author lisihan
 * @Description 自定义异常
 * @date 2022/3/26-19:33
 */
public class AppException extends RuntimeException {
    public AppException(String message, Throwable cause) {
        super(message, cause);
    }

    public AppException(String message) {
        super(message);
    }
}
