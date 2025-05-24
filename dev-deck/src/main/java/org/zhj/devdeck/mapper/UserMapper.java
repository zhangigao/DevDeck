package org.zhj.devdeck.mapper;

import org.zhj.devdeck.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
* @author 86155
* @description 针对表【users】的数据库操作Mapper
* @createDate 2025-05-23 20:55:01
* @Entity org.zhj.devdeck.entity.User
*/
public interface UserMapper extends BaseMapper<User> {

    List<User> getUserByRole(Integer code, Integer defaultUserTotal);
}




