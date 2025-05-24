package org.zhj.devdeck.mapper;

import org.zhj.devdeck.entity.Role;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.zhj.devdeck.vo.RoleVO;

/**
* @author 86155
* @description 针对表【role】的数据库操作Mapper
* @createDate 2025-05-23 20:52:16
* @Entity org.zhj.devdeck.entity.Role
*/
public interface RoleMapper extends BaseMapper<Role> {

    RoleVO getRoleDetail(Integer id);
}




