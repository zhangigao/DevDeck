package org.zhj.devdeck.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import org.zhj.devdeck.utils.UserContext;

import java.util.Date;
import java.util.UUID;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createdAt", Date.class, new Date());
        this.strictInsertFill(metaObject, "updatedAt", Date.class, new Date());
        this.strictInsertFill(metaObject, "uuid", String.class, UUID.randomUUID().toString());
        this.strictInsertFill(metaObject, "createdBy", Integer.class, UserContext.require().getId());
        this.strictInsertFill(metaObject, "updatedBy", Integer.class, UserContext.require().getId());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", Date.class, new Date());
        this.strictInsertFill(metaObject, "updatedBy", Integer.class, UserContext.require().getId());
    }
}