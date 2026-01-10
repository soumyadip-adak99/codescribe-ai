package org.blogapplication.services;

public interface OtpService {
  String generateOtp();
  void generateAndSendOtp(String email);
  boolean verifyOtp(String email, String otp);
  void clearOtp(String email);
}
