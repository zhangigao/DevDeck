package org.zhj.devdeck.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zhj.devdeck.common.Result;

/**
 * @Author 86155
 * @Date 2025/5/18
 */
@RestController
@RequestMapping("/well-being-check")
public class WellBeingCheck {

    @GetMapping("/success")
    public Result<String> check() {
        return Result.success("一切正常");
    }

}
