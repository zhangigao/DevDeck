package org.zhj.devdeck.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.zhj.devdeck.dto.UserPageDTO;
import org.zhj.devdeck.model.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.zhj.devdeck.vo.UserDetailVO;
import org.zhj.devdeck.vo.UserVO;

import java.util.List;

/**
* @author 86155
* @description 针对表【users】的数据库操作Service
* @createDate 2025-05-23 20:55:01
*/
public interface UsersService extends IService<User> {

    List<User> getUserByRoleId(Integer code, Integer defaultUserTotal);

    UserDetailVO getUserDetail(String uuid);

    IPage<UserVO> voPage(UserPageDTO dto);
}
