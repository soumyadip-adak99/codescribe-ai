package org.blogapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.blogapplication.constants.BlogStatus;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogResponse {
    private String id;
    private String title;
    private String content;
    private String author;
    private BlogStatus status;
    private LocalDateTime createdDate;
}
