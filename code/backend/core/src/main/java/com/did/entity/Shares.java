package com.did.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author lisihan
 * @Description
 * @date 2023/5/22-21:17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName(value = "t_shares")
public class Shares implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer shareId;
    private String username;
    private String share;
    private String alias;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 更新时间
     */
    private Date updateTime;
}
