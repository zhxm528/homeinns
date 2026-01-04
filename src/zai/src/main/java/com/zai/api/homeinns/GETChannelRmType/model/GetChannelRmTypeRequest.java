package com.zai.api.homeinns.GETChannelRmType.model;

import lombok.Data;

@Data
public class GetChannelRmTypeRequest {
    private String Type;
    private String Terminal_License;
    private String Terminal_Seq;
    private String Terminal_OprId;
} 