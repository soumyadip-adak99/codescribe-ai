package org.blogapplication.entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import org.blogapplication.constants.UserStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "user_data")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @NonNull
    private String firstname;

    @NonNull
    private String lastname;

    @Indexed(unique = true)
    @NonNull
    private String email;

    // private String phoneNumber;

    @NonNull
    private String password;

    private List<String> role;

    // store image id and url
    private Map<String, String> profileImage;

    private UserStatus userStatus; // ACTIVE , INACTIVE, PENDING, BLOCKED,DELETED,SUSPENDED,BANNED,UNVERIFIED, LOCKED

    @DBRef // this annotation using for make a reference of another collections
    @JsonProperty("Blog_data")
    @Builder.Default
    private List<BlogEntries> blogEntries = new ArrayList<>();

    @JsonProperty("create_at")
    private LocalDateTime createdAt;
}
