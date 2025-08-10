package org.blogapplication.entity;


import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Data
@Document(collection = "image_data")
public class ImageEntity {
    @Id
    private String id;
    private String publicId;
    private String imageUrl;
    private String imageType;
}
