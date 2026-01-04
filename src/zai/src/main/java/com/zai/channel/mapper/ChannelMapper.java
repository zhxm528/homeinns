package com.zai.channel.mapper;

import com.zai.channel.entity.Channel;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Repository
@Mapper
public interface ChannelMapper {
    int insert(Channel channel);
    int deleteByChannelId(@Param("channelId") String channelId);
    int update(Channel channel);
    List<Channel> selectByChannelId(@Param("channelId") String channelId);
    List<Channel> selectAll();
    List<Channel> selectByCondition(@Param("channelName") String channelName, 
                                  @Param("contactEmail") String contactEmail, 
                                  @Param("contactPhone") String contactPhone,
                                  @Param("channelCode") String channelCode);
    
    /**
     * 查询所有渠道
     * 
     * @return 渠道列表
     */
    List<Channel> selectChannelComponent();
} 