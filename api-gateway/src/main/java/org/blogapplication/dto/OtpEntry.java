package org.blogapplication.dto;

public class OtpEntry {
   private String otp;
    private long expiryTimeMillis; 

    public OtpEntry(String otp, long expiryTimeMillis) {
        this.otp = otp;
        this.expiryTimeMillis = expiryTimeMillis;
    }

    public String getOtp() {
        return otp;
    }

    public long getExpiryTimeMillis() {
        return expiryTimeMillis;
    }
}
