package com.did.result;

/**
 * @author lisihan
 * @Description
 * @date 2022/4/11-19:32
 */

public class Result<T>{
    private T data;
    private Boolean result;
    private String message;

    public Result() {
    }

    public Result(T data, Boolean result, String message) {
        this.result = result;
        this.data = data;
        this.message = message;
    }

    public Result(Boolean result, String message) {
        this.data = null;
        this.result = result;
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Boolean getResult() {
        return result;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Result{" +
                "data=" + data +
                ", result=" + result +
                ", message='" + message + '\'' +
                '}';
    }
}
