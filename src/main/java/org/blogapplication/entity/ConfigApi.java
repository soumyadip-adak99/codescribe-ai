package org.blogapplication.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "app_api_cache")
public class ConfigApi {
    private String key;
    private String value;
}
