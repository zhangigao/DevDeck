package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.zhj.devdeck.dto.UserPageDTO;
import org.zhj.devdeck.model.User;
import org.zhj.devdeck.mapper.UserMapper;
import org.zhj.devdeck.service.UsersService;
import org.zhj.devdeck.vo.UserDetailVO;
import org.zhj.devdeck.vo.UserVO;

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


    @Override
    public UserDetailVO getUserDetail(String uuid) {
        return userMapper.getUserDetail(uuid);
    }

    @Override
    public IPage<UserVO> voPage(UserPageDTO dto) {
        Page<UserVO> page = new Page<>(dto.getPageNo(), dto.getPageSize());
        return userMapper.voPage(page,dto);
    }
}




