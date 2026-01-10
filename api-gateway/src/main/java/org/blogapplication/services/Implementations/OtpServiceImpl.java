package org.blogapplication.services.Implementations;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.dto.OtpEntry;
import org.blogapplication.services.OtpService;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final EmailService emailService;

    private String otpTemplateFilePath= "/templates/myotpTemplate.html";


    private final Map<String, OtpEntry> otpCache = new HashMap<>();
    private final Random random = new Random();
  

    @Override
    public String generateOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Override
    public void generateAndSendOtp(String email) {
        String otp = generateOtp();
        long expiry = System.currentTimeMillis() + 5 * 60 * 1000; // 5 minutes
        otpCache.put(email, new OtpEntry(otp, expiry));

        emailService.sendOtpEmail(email, otp, otpTemplateFilePath);
        
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpCache.get(email);
        if (entry == null) return false;

        long now = System.currentTimeMillis();
        if (now > entry.getExpiryTimeMillis()) {
            otpCache.remove(email); // clean up expired
            return false; // OTP expired
        }

        return entry.getOtp().equals(otp);
    }

    @Override
    public void clearOtp(String phone) {
        otpCache.remove(phone);
    }

    
}
