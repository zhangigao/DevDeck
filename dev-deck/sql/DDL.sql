-- 创建所有序列
CREATE SEQUENCE category_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE permission_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE question_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE role_permissions_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE role_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE user_roles_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

CREATE SEQUENCE users_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1;

-- 分类表
CREATE TABLE "category"
(
    id          INTEGER DEFAULT nextval('category_id_seq') NOT NULL,
    name        VARCHAR(64)                                  NOT NULL,
    slug        VARCHAR(64)                                  NOT NULL,
    parent_id   INTEGER                                     NOT NULL,
    sort_weight INTEGER                                     NOT NULL,
    description TEXT                                        NOT NULL,
    icon        VARCHAR(255),
    is_enabled  VARCHAR(255)                                NOT NULL,
    created_by  INTEGER                                     NOT NULL,
    created_at  TIMESTAMP                                   NOT NULL,
    updated_at  TIMESTAMP                                   NOT NULL,
    deleted_at  TIMESTAMP,
    updated_by  INTEGER                                     NOT NULL,
    CONSTRAINT category_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN category.id IS '自增主键';
COMMENT ON COLUMN category.name IS '分类名称（如“后端开发”）';
COMMENT ON COLUMN category.slug IS '分类英文标识（URL友好，如“fontend”）';
COMMENT ON COLUMN category.parent_id IS '负分类ID';
COMMENT ON COLUMN category.sort_weight IS '排序权重';
COMMENT ON COLUMN category.description IS '分类描述';
COMMENT ON COLUMN category.icon IS '分类图标';
COMMENT ON COLUMN category.is_enabled IS '是否启用';
COMMENT ON COLUMN category.created_by IS '创建人ID';
COMMENT ON COLUMN category.created_at IS '创建日期时间';
COMMENT ON COLUMN category.updated_at IS '修改日期时间';
COMMENT ON COLUMN category.deleted_at IS '删除日期时间';
COMMENT ON COLUMN category.updated_by IS '修改人ID';

ALTER TABLE "category" OWNER TO postgres;

-- 权限表
CREATE TABLE "permission"
(
    id          INTEGER DEFAULT nextval('permission_id_seq') NOT NULL,
    name        VARCHAR(255)                                NOT NULL,
    code        VARCHAR(255)                                NOT NULL,
    description VARCHAR(255)                                NOT NULL,
    created_by  INTEGER                                     NOT NULL,
    created_at  TIMESTAMP                                   NOT NULL,
    updated_by  INTEGER                                     NOT NULL,
    updated_at  TIMESTAMP                                   NOT NULL,
    deleted_at  TIMESTAMP,
    CONSTRAINT permission_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN permission.id IS '自增主键';
COMMENT ON COLUMN permission.name IS '权限名称';
COMMENT ON COLUMN permission.code IS '权限编码';
COMMENT ON COLUMN permission.description IS '权限描述';
COMMENT ON COLUMN permission.created_by IS '创建人ID';
COMMENT ON COLUMN permission.created_at IS '创建日期时间';
COMMENT ON COLUMN permission.updated_by IS '修改人ID';
COMMENT ON COLUMN permission.updated_at IS '修改日期时间';
COMMENT ON COLUMN permission.deleted_at IS '删除日期时间';

ALTER TABLE "permission" OWNER TO postgres;

-- 刷题表
CREATE TABLE "question"
(
    id              INTEGER DEFAULT nextval('question_id_seq') NOT NULL,
    uuid            CHAR(36)                                  NOT NULL,
    title           VARCHAR(255)                              NOT NULL,
    slug            VARCHAR(255)                              NOT NULL,
    content         TEXT                                      NOT NULL,
    answer_template TEXT                                      NOT NULL,
    correct_answer  JSON                                     NOT NULL,
    type            SMALLINT                                 NOT NULL,
    difficulty      SMALLINT                                 NOT NULL,
    submit_count    INTEGER                                  NOT NULL,
    hint            TEXT,
    source          VARCHAR(255),
    is_official     BOOLEAN                                  NOT NULL,
    is_enabled      BOOLEAN                                  NOT NULL,
    created_by      INTEGER                                  NOT NULL,
    created_at      TIMESTAMP                                NOT NULL,
    updated_at      TIMESTAMP                                NOT NULL,
    deleted_at      TIMESTAMP,
    updated_by      INTEGER                                  NOT NULL,
    CONSTRAINT question_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN question.id IS '自增主键';
COMMENT ON COLUMN question.uuid IS '对外暴露，防爬';
COMMENT ON COLUMN question.title IS '题目标题';
COMMENT ON COLUMN question.slug IS 'URL 友好标识';
COMMENT ON COLUMN question.content IS '题目描述';
COMMENT ON COLUMN question.answer_template IS '答案模板';
COMMENT ON COLUMN question.correct_answer IS '正确答案';
COMMENT ON COLUMN question.type IS '题型 （1=单选，2=多选，3=填空，4=编程，5=设计题，6=问答题）';
COMMENT ON COLUMN question.difficulty IS '难度 （1=简单，2=中等，3=困难，4=地狱）';
COMMENT ON COLUMN question.submit_count IS '提交次数';
COMMENT ON COLUMN question.hint IS '解题提示';
COMMENT ON COLUMN question.source IS '题目来源';
COMMENT ON COLUMN question.is_official IS '是否官方题目';
COMMENT ON COLUMN question.is_enabled IS '是否启用';
COMMENT ON COLUMN question.created_by IS '创建人ID';
COMMENT ON COLUMN question.created_at IS '创建日期时间';
COMMENT ON COLUMN question.updated_at IS '修改日期时间';
COMMENT ON COLUMN question.deleted_at IS '删除日期时间';
COMMENT ON COLUMN question.updated_by IS '修改人ID';

ALTER TABLE "question" OWNER TO postgres;

-- 角色表
CREATE TABLE "role"
(
    id          INTEGER DEFAULT nextval('role_id_seq') NOT NULL,
    name        VARCHAR(64)                           NOT NULL,
    description VARCHAR(255)                          NOT NULL,
    created_by  INTEGER                                NOT NULL,
    created_at  TIMESTAMP                              NOT NULL,
    updated_by  INTEGER                                NOT NULL,
    updated_at  TIMESTAMP                              NOT NULL,
    deleted_at  TIMESTAMP,
    CONSTRAINT role_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN role.id IS '自增主键';
COMMENT ON COLUMN role.name IS '角色名称';
COMMENT ON COLUMN role.description IS '角色描述';
COMMENT ON COLUMN role.created_by IS '创建人ID';
COMMENT ON COLUMN role.created_at IS '创建日期时间';
COMMENT ON COLUMN role.updated_by IS '修改人ID';
COMMENT ON COLUMN role.updated_at IS '修改日期时间';
COMMENT ON COLUMN role.deleted_at IS '删除日期时间';

ALTER TABLE "role" OWNER TO postgres;

-- 角色权限表
CREATE TABLE "role_permissions"
(
    id            INTEGER DEFAULT nextval('role_permissions_id_seq') NOT NULL,
    role_id       INTEGER                                           NOT NULL,
    permission_id INTEGER                                           NOT NULL,
    created_by    INTEGER                                           NOT NULL,
    created_at    TIMESTAMP                                         NOT NULL,
    updated_by    INTEGER                                           NOT NULL,
    updated_at    TIMESTAMP                                         NOT NULL,
    deleted_at    TIMESTAMP,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE UNIQUE INDEX uk_role_permission ON public.role_permissions USING btree (role_id, permission_id);

COMMENT ON COLUMN role_permissions.id IS '自增主键';
COMMENT ON COLUMN role_permissions.role_id IS '角色ID';
COMMENT ON COLUMN role_permissions.permission_id IS '权限ID';
COMMENT ON COLUMN role_permissions.created_by IS '创建人ID';
COMMENT ON COLUMN role_permissions.created_at IS '创建日期时间';
COMMENT ON COLUMN role_permissions.updated_by IS '修改人ID';
COMMENT ON COLUMN role_permissions.updated_at IS '修改日期时间';
COMMENT ON COLUMN role_permissions.deleted_at IS '删除日期时间';

ALTER TABLE "role_permissions" OWNER TO postgres;

-- 用户角色表
CREATE TABLE "user_roles"
(
    id         INTEGER DEFAULT nextval('user_roles_id_seq') NOT NULL,
    user_id    INTEGER                                     NOT NULL,
    role_id    INTEGER                                     NOT NULL,
    created_by INTEGER                                     NOT NULL,
    created_at TIMESTAMP                                   NOT NULL,
    updated_by INTEGER                                     NOT NULL,
    updated_at TIMESTAMP                                   NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT user_roles_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN user_roles.id IS '主键ID';
COMMENT ON COLUMN user_roles.user_id IS '用户ID';
COMMENT ON COLUMN user_roles.role_id IS '角色ID';
COMMENT ON COLUMN user_roles.created_by IS '创建人ID';
COMMENT ON COLUMN user_roles.created_at IS '创建日期时间';
COMMENT ON COLUMN user_roles.updated_by IS '修改人ID';
COMMENT ON COLUMN user_roles.updated_at IS '修改日期时间';
COMMENT ON COLUMN user_roles.deleted_at IS '删除日期时间';

ALTER TABLE "user_roles" OWNER TO postgres;

-- 用户表
CREATE TABLE "users"
(
    id           INTEGER DEFAULT nextval('users_id_seq') NOT NULL,
    email        VARCHAR(255)                            NOT NULL,
    password     VARCHAR(255)                            NOT NULL,
    nickname     VARCHAR(255)                            NOT NULL,
    created_at   TIMESTAMP(0)                            NOT NULL,
    updated_at   TIMESTAMP(0)                            NOT NULL,
    deleted_at   TIMESTAMP(0),
    avatar_url   VARCHAR(255),
    github_id    VARCHAR(255),
    github_login VARCHAR(255),
    uuid         VARCHAR(36)                             NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

COMMENT ON COLUMN users.id IS '自增主键';
COMMENT ON COLUMN users.email IS '账户邮箱';
COMMENT ON COLUMN users.password IS '账户密码';
COMMENT ON COLUMN users.nickname IS '用户名称';
COMMENT ON COLUMN users.created_at IS '注册日期';
COMMENT ON COLUMN users.updated_at IS '最后一次登录日期';
COMMENT ON COLUMN users.deleted_at IS '删除日期';
COMMENT ON COLUMN users.avatar_url IS '头像';
COMMENT ON COLUMN users.uuid IS '对外暴露';

ALTER TABLE "users" OWNER TO postgres;