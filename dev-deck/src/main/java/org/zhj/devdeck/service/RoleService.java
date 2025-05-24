package org.zhj.devdeck.service;

import org.zhj.devdeck.entity.Role;
import com.baomidou.mybatisplus.extension.service.IService;
import org.zhj.devdeck.vo.RoleVO;

/**
* @author 86155
* @description 针对表【role】的数据库操作Service
* @createDate 2025-05-23 20:52:16
*/
public interface RoleService extends IService<Role> {

    RoleVO getRoleDetail(Integer id);
}
