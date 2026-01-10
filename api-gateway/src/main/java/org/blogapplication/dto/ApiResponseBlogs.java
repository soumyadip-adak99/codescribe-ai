package org.blogapplication.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.blogapplication.constants.BlogStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseBlogs {

    private String id;
    private String title;
    private String authorName;
    private String content;
    private Map<String, String> authorProfileImage;

    private Map<String, String> image;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("create_at")
    private LocalDateTime createdDate;

    @JsonProperty("is_ai_approved")
    private boolean isAiApproved;

    private BlogStatus status;
}
