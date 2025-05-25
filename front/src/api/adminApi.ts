import api from './config';

// 权限管理接口
export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionRequest {
  name: string;
  code: string;
  description: string;
}

// 角色管理接口
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface BindRolePermissionRequest {
  roleId: number;
  permissionIds: number[];
}

// 权限VO接口
export interface PermissionVO {
  id: number;
  name: string;
  code: string;
  description: string;
}

// 角色VO接口
export interface RoleVO {
  id: number;
  name: string;
  description: string;
  permissions: PermissionVO[];
}

// 用户详情接口
export interface UserDetail {
  uuid: string;
  email: string;
  nickName: string;
  avatarUrl: string;
  roles: RoleVO[];
  createdAt: string;
  updatedAt: string;
}

// 用户列表项接口
export interface UserListItem {
  uuid: string;
  email: string;
  nickName: string;
  avatarUrl: string;
  role: RoleVO;
}

// 用户列表查询参数
export interface UserListParams {
  pageNo: number;
  pageSize: number;
  nickName?: string;
  email?: string;
}

// 用户角色接口
export interface UserRole {
  uuid: string;
  email: string;
  nickName: string;
  roles: Role[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

// 分页响应接口
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 权限管理API
export const createPermission = async (data: CreatePermissionRequest) => {
  return api.post('/admin/permission', data);
};

export const getPermissionList = async (pageNo: number, pageSize: number) => {
  return api.get('/admin/permission/list', {
    params: { pageNo, pageSize }
  });
};

// 角色管理API
export const createRole = async (data: CreateRoleRequest) => {
  return api.post('/admin/role', data);
};

export const getRoleList = async (pageNo: number, pageSize: number) => {
  return api.get('/admin/role/list', {
    params: { pageNo, pageSize }
  });
};

export const getRoleDetail = async (id: number) => {
  return api.get(`/admin/role/${id}`);
};

export const bindRolePermission = async (data: BindRolePermissionRequest) => {
  return api.post('/admin/role/permission', data);
};

// 用户管理API
export const getUserDetail = async (uuid: string) => {
  return api.get(`/admin/user/${uuid}`);
};

export const getUserList = async (params: UserListParams) => {
  return api.post('/admin/user/list', params);
}; 