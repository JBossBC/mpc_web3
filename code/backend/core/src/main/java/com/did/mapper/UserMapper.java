package com.did.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.did.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author lisihan
 * @Description UserMapper
 * @date 2023/5/22-20:40
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
