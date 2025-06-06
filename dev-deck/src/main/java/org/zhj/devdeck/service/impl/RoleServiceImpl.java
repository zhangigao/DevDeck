package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.zhj.devdeck.model.Role;
import org.zhj.devdeck.service.RoleService;
import org.zhj.devdeck.mapper.RoleMapper;
import org.springframework.stereotype.Service;
import org.zhj.devdeck.vo.RoleVO;

/**
 * @author 86155
 * @description 针对表【role】的数据库操作Service实现
 * @createDate 2025-05-23 20:52:16
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role>
        implements RoleService {

    @Resource
    private RoleMapper roleMapper;

    @Override
    public RoleVO getRoleDetail(Integer id) {
        return roleMapper.getRoleDetail(id);
    }
}




