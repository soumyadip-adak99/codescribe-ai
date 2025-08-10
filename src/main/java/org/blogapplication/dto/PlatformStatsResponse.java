package org.blogapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlatformStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalBlogs;
    private long approvedBlogs;
    private long aiApprovedBlogs;
    private long blogsToday;
}
