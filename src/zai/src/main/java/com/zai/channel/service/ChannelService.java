package com.zai.channel.service;

import com.zai.channel.entity.Channel;
import java.util.List;

public interface ChannelService {
    int addChannel(Channel channel);
    boolean deleteChannel(String channelId);
    int updateChannel(Channel channel);
    Channel getChannelById(String channelId);
    List<Channel> getAllChannels();
    List<Channel> getChannelsByCondition(String channelName, String contactEmail, String contactPhone, String channelCode);

    /**
     * 查询所有渠道
     * 
     * @return 渠道列表
     */
    List<Channel> selectChannelComponent();
} 