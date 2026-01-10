package org.blogapplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OtpRequest {
  @JsonProperty("email")
  private String email;
}