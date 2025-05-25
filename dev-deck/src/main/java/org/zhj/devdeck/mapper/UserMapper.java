package org.zhj.devdeck.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import org.zhj.devdeck.dto.UserPageDTO;
import org.zhj.devdeck.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.zhj.devdeck.vo.UserDetailVO;
import org.zhj.devdeck.vo.UserVO;

import java.util.List;

/**
* @author 86155
* @description 针对表【users】的数据库操作Mapper
* @createDate 2025-05-23 20:55:01
* @Entity org.zhj.devdeck.entity.User
*/
public interface UserMapper extends BaseMapper<User> {

    List<User> getUserByRole(Integer code, Integer defaultUserTotal);

    UserDetailVO getUserDetail(String uuid);

    IPage<UserVO> voPage(@Param("page") Page<UserVO> page,
                         @Param("query") UserPageDTO query);
}




