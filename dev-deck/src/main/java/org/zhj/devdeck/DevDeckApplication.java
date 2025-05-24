package org.zhj.devdeck;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "org.zhj.devdeck.mapper")
public class DevDeckApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevDeckApplication.class, args);
    }

}
