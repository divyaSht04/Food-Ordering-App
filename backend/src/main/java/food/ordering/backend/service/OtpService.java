package food.ordering.backend.service;

import food.ordering.backend.entity.OtpVerification;
import food.ordering.backend.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {
    
    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    
    @Value("${app.otp.expiration.minutes:5}")
    private int otpExpirationMinutes;
    
    @Value("${app.otp.length:6}")
    private int otpLength;
    
    private static final int MAX_ATTEMPTS = 3;
    
    @Transactional
    public void generateAndSendOtp(String email, String userName) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);
        
        // Generate new OTP
        String otpCode = generateOtp();
        
        // Create OTP record
        OtpVerification otp = new OtpVerification();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
        
        otpRepository.save(otp);
        
        // Send email
        emailService.sendOtpEmail(email, otpCode, userName);
        
        log.info("OTP generated and sent for email: {}", email);
    }
    
    @Transactional
    public boolean verifyOtp(String email, String otpCode, String userName) {
        Optional<OtpVerification> otpOpt = otpRepository.findByEmailAndVerifiedFalse(email);
        
        if (otpOpt.isEmpty()) {
            log.warn("No pending OTP found for email: {}", email);
            return false;
        }
        
        OtpVerification otp = otpOpt.get();
        
        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            log.warn("OTP expired for email: {}", email);
            otpRepository.delete(otp);
            return false;
        }
        
        // Check attempts
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            log.warn("Maximum OTP attempts exceeded for email: {}", email);
            otpRepository.delete(otp);
            return false;
        }
        
        // Increment attempts
        otp.setAttempts(otp.getAttempts() + 1);
        
        // Check OTP code
        if (!otp.getOtpCode().equals(otpCode)) {
            otpRepository.save(otp);
            log.warn("Invalid OTP provided for email: {}", email);
            return false;
        }
        
        // Mark as verified
        otp.setVerified(true);
        otpRepository.save(otp);
        
        // Send welcome email after successful verification
        try {
            emailService.sendWelcomeEmail(email, userName);
            log.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", email, e);
            // Don't fail the verification process if welcome email fails
        }
        
        log.info("OTP verified successfully for email: {}", email);
        return true;
    }
    
    public boolean isEmailVerified(String email) {
        return otpRepository.existsByEmailAndVerifiedTrue(email);
    }
    
    public int getRemainingAttempts(String email) {
        Optional<OtpVerification> otpOpt = otpRepository.findByEmailAndVerifiedFalse(email);
        if (otpOpt.isPresent()) {
            return Math.max(0, MAX_ATTEMPTS - otpOpt.get().getAttempts());
        }
        return 0;
    }
    
    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }
    
    // Clean up expired OTPs every hour
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.debug("Cleaned up expired OTPs");
    }
}
