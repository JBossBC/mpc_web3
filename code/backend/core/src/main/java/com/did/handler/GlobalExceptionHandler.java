package com.did.handler;


import com.did.exception.AppException;
import com.did.result.R;
import com.did.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author lisihan
 * @Description 全局异常
 * @date 2022/3/26-20:27
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Result error(Exception e) {
        log.error(e.getMessage());
        e.printStackTrace();
        return R.fail("出现未知错误");
    }

    @ExceptionHandler(AppException.class)
    @ResponseBody
    public Result error(AppException e) {
        log.error(e.getMessage());
        e.printStackTrace();
        return R.fail(e.getMessage());
    }

}
