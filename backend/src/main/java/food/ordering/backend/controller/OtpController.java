package food.ordering.backend.controller;

import food.ordering.backend.dto.otpDTOs.OtpRequest;
import food.ordering.backend.dto.otpDTOs.OtpResponse;
import food.ordering.backend.dto.otpDTOs.OtpVerificationRequest;
import food.ordering.backend.service.EmailService;
import food.ordering.backend.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/otp")
@RequiredArgsConstructor
@Slf4j
public class OtpController {
    
    private final OtpService otpService;
    private final EmailService emailService;
    
    @PostMapping("/send")
    @ResponseBody
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            otpService.generateAndSendOtp(request.getEmail(), request.getUserName());
            
            return ResponseEntity.ok(OtpResponse.builder()
                    .success(true)
                    .message("OTP sent successfully to " + request.getEmail())
                    .email(request.getEmail())
                    .build());
            
        } catch (Exception e) {
            log.error("Error sending OTP", e);
            return ResponseEntity.internalServerError()
                    .body(OtpResponse.builder()
                            .success(false)
                            .message("Failed to send OTP")
                            .build());
        }
    }

    @PostMapping("/verify")
    @ResponseBody
    public ResponseEntity<OtpResponse> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            String userName = request.getUserName() != null ? request.getUserName() : "User";
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtpCode(), userName);
            
            if (isValid) {
                return ResponseEntity.ok(OtpResponse.builder()
                        .success(true)
                        .message("OTP verified successfully")
                        .email(request.getEmail())
                        .build());
            } else {
                int remainingAttempts = otpService.getRemainingAttempts(request.getEmail());
                return ResponseEntity.badRequest().body(OtpResponse.builder()
                        .success(false)
                        .message("Invalid OTP")
                        .remainingAttempts(remainingAttempts)
                        .email(request.getEmail())
                        .build());
            }
            
        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.internalServerError()
                    .body(OtpResponse.builder()
                            .success(false)
                            .message("Failed to verify OTP")
                            .build());
        }
    }    @GetMapping("/verification-page")
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
    public ResponseEntity<OtpResponse> resendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            otpService.generateAndSendOtp(request.getEmail(), request.getUserName());
            
            return ResponseEntity.ok(OtpResponse.builder()
                    .success(true)
                    .message("OTP resent successfully")
                    .email(request.getEmail())
                    .build());
            
        } catch (Exception e) {
            log.error("Error resending OTP", e);
            return ResponseEntity.internalServerError()
                    .body(OtpResponse.builder()
                            .success(false)
                            .message("Failed to resend OTP")
                            .build());
        }
    }
}
