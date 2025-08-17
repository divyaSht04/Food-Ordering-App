package food.ordering.backend.controller;

import food.ordering.backend.service.EmailService;
import food.ordering.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/otp")
@RequiredArgsConstructor
@Slf4j
public class OtpController {
    
    private final OtpService otpService;
    private final EmailService emailService;
    
    @PostMapping("/send")
    @ResponseBody
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String userName = request.get("userName");
            
            if (email == null || userName == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email and userName are required"));
            }
            
            otpService.generateAndSendOtp(email, userName);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent successfully to " + email
            ));
            
        } catch (Exception e) {
            log.error("Error sending OTP", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Failed to send OTP"));
        }
    }
    
    @PostMapping("/verify")
    @ResponseBody
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otpCode = request.get("otpCode");
            String userName = request.get("userName");
            
            if (email == null || otpCode == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email and OTP code are required"));
            }
            
            boolean isValid = otpService.verifyOtp(email, otpCode, userName != null ? userName : "User");
            
            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP verified successfully"
                ));
            } else {
                int remainingAttempts = otpService.getRemainingAttempts(email);
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid OTP",
                    "remainingAttempts", remainingAttempts
                ));
            }
            
        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Failed to verify OTP"));
        }
    }
    
    @GetMapping("/verification-page")
    public String showOtpVerificationPage(@RequestParam String email, 
                                         @RequestParam(required = false) String userName,
                                         Model model) {
        model.addAttribute("email", email);
        model.addAttribute("userName", userName != null ? userName : "User");
        model.addAttribute("maxAttempts", 3);
        return "otp-verification";
    }
    
    @PostMapping("/resend")
    @ResponseBody
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String userName = request.get("userName");
            
            if (email == null || userName == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email and userName are required"));
            }
            
            otpService.generateAndSendOtp(email, userName);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP resent successfully"
            ));
            
        } catch (Exception e) {
            log.error("Error resending OTP", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Failed to resend OTP"));
        }
    }
}
