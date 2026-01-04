package com.zai.channel.service.impl;

import com.zai.channel.entity.Channel;
import com.zai.channel.mapper.ChannelMapper;
import com.zai.channel.service.ChannelService;
import com.zai.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Service
public class ChannelServiceImpl implements ChannelService {
    private static final Logger logger = LoggerFactory.getLogger(ChannelServiceImpl.class);

    @Qualifier("channelMapper")
    @Autowired
    private ChannelMapper channelMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    

    @Override
    public int addChannel(Channel channel) {
        logger.debug("Adding new channel: {}", channel);
        // 生成64位唯一ID
        String channelId = IdGenerator.generate64BitId();
        channel.setChannelId(channelId);
        logger.debug("Generated channelID: {}", channelId);
        return channelMapper.insert(channel);
    }

    @Override
    public boolean deleteChannel(String channelId) {
        logger.debug("Deleting channel with ID: {}", channelId);
        return channelMapper.deleteByChannelId(channelId) > 0;
    }

    @Override
    public int updateChannel(Channel channel) {
        logger.debug("Updating channel: {}", channel);
        return channelMapper.update(channel);
    }

    @Override
    public Channel getChannelById(String channelId) {
        logger.debug("Fetching channel by channelId: {}", channelId);
        try {
            List<Channel> channels = channelMapper.selectByChannelId(channelId);
            if (channels != null && !channels.isEmpty()) {
                Channel channel = channels.get(0);
                logger.debug("Found channel: {}", channel);
                return channel;
            } else {
                logger.debug("No channel found with channelId: {}", channelId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error fetching channel by channelId: {}", channelId, e);
            throw e;
        }
    }

    

    @Override
    public List<Channel> getAllChannels() {
        logger.debug("Fetching all channels");
        try {
            List<Channel> channels = channelMapper.selectAll();
            logger.debug("Found {} channels", channels.size());
            return channels;
        } catch (Exception e) {
            logger.error("Error fetching all channels", e);
            throw e;
        }
    }

    @Override
    public List<Channel> getChannelsByCondition(String channelName, String contactEmail, String contactPhone, String channelCode) {
        logger.debug("Searching channels with channelName: {}, contactEmail: {}, contactPhone: {}, channelCode: {}", 
            channelName, contactEmail, contactPhone, channelCode);
        try {
            List<Channel> channels = channelMapper.selectByCondition(channelName, contactEmail, contactPhone, channelCode);
            logger.debug("Found {} channels matching criteria", channels.size());
            return channels;
        } catch (Exception e) {
            logger.error("Error searching channels", e);
            throw e;
        }
    }

    @Override
    public List<Channel> selectChannelComponent() {
        try {
            logger.debug("开始查询所有渠道");
            List<Channel> channels = channelMapper.selectChannelComponent();
            logger.debug("查询到 {} 条渠道记录", channels.size());
            return channels;
        } catch (Exception e) {
            logger.error("查询渠道失败: {}", e.getMessage(), e);
            throw new RuntimeException("查询渠道失败: " + e.getMessage());
        }
    }
} 