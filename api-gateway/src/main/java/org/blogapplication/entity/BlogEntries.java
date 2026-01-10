package org.blogapplication.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import org.blogapplication.constants.BlogStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "Blog_data")
public class BlogEntries {

    @Id
    private String id;

    @NonNull
    private String title;

    @NonNull
    private String authorName;

        // id  url
    private Map<String, String> authorProfileImage;

    @NonNull
    private String content;

    //       id,    url
    private Map<String, String> image;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("create_at")
    private LocalDateTime createdDate;
    private boolean isAiApproved;

    private BlogStatus status;
}
