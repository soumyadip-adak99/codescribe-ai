package org.blogapplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.blogapplication.entity.BlogEntries;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String firstname;
    private String lastName;
    private String email;
    private Map<String, String> profileImage;
    private List<BlogEntries> blogs;
    private List<String> role;
    private LocalDateTime created_at;
}
