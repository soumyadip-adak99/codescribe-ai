package org.blogapplication.dto;

import lombok.*;
import org.blogapplication.entity.BlogEntries;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponseUser {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private Map<String, String> profileImage;
    private List<BlogEntries> blogEntries;
    private LocalDateTime createdAt;
}
