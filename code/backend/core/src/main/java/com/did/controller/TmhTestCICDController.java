package com.did.controller;

import com.did.result.R;
import com.did.result.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * @author lisihan
 * @date 2023/5/23 0:13
 * @description
 */
@RestController
public class TmhTestCICDController {
    @GetMapping("/get")
    public Result<String> get() {
        System.out.println(2111);
        return R.success("0.0-本项目的cicd项目部署成功了");
    }
    @GetMapping("/get1")
    public Result<String> get1() {
        System.out.println(2111);
        return R.success("0.0-本项目的cicd项目部署成功了11111");
    }
}
