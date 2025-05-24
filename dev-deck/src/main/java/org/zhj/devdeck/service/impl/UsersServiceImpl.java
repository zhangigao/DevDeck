package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.zhj.devdeck.entity.User;
import org.zhj.devdeck.mapper.UserMapper;
import org.zhj.devdeck.service.UsersService;

import java.util.List;

/**
* @author 86155
* @description 针对表【users】的数据库操作Service实现
* @createDate 2025-05-23 20:55:01
*/
@Service
public class UsersServiceImpl extends ServiceImpl<UserMapper, User>
    implements UsersService{

    @Resource
    private UserMapper userMapper;

    @Override
    public List<User> getUserByRoleId(Integer code, Integer defaultUserTotal) {
        return userMapper.getUserByRole(code, defaultUserTotal);
    }
}




