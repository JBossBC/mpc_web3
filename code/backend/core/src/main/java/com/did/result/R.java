package com.did.result;


/**
 * @author lisihan
 * @Description
 * @date 2022/4/11-19:29
 */
public class R {
    public R() {
    }

    public static Result<String> success() {
        return new Result(true, "成功");
    }

    public static <T> Result<T> success(T data) {
        return new Result(data, true, "成功");
    }

    public static Result<String> fail() {
        return new Result(false, "未知错误，联系管理员");
    }

    public static Result<String> fail(String message) {
        return new Result(false, message);
    }
}
