package org.blogapplication.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ChangePasswordRequest {
    String oldPassword;
    String newPassword;
}
