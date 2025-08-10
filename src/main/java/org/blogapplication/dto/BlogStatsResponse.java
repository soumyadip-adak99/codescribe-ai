package org.blogapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BlogStatsResponse {
    private long totalBlogs;
    private long approvedBlogs;
    private long rejectedBlogs;
    private long aiApprovedBlogs;
    private long blogsToday;
    private long blogsThisMonth;
}
