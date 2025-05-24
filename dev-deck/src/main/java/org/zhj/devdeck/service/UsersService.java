package org.zhj.devdeck.service;

import org.springframework.stereotype.Service;
import org.zhj.devdeck.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author 86155
* @description 针对表【users】的数据库操作Service
* @createDate 2025-05-23 20:55:01
*/
public interface UsersService extends IService<User> {

    List<User> getUserByRoleId(Integer code, Integer defaultUserTotal);
}
