package food.ordering.backend.controller;

import food.ordering.backend.permission.HasPermissionService;
import food.ordering.backend.permission.Permission;
import food.ordering.backend.permission.PermissionDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/permissions")
@RequiredArgsConstructor
@Slf4j
public class PermissionController {

    private final HasPermissionService hasPermissionService;

    @GetMapping("/all")
    @PreAuthorize("@hasPermissionService.hasPermission('" + Permission.GET_ALL_PERMISSIONS_LIST + "')")
    public ResponseEntity<List<PermissionDetail>> getAllPermissions() {
        log.info("Getting all permissions list");
        return ResponseEntity.ok(Permission.ALL_PERMISSIONS);
    }

    @PostMapping("/assign/{userId}")
    @PreAuthorize("@hasPermissionService.hasPermission('" + Permission.ADMIN_ASSIGN_PERMISSIONS + "')")
    public ResponseEntity<String> assignPermission(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        
        String permission = request.get("permission");
        hasPermissionService.setPermission(userId, permission);
        log.info("Permission {} assigned to user {}", permission, userId);
        
        return ResponseEntity.ok("Permission assigned successfully");
    }

    @PostMapping("/assign-multiple/{userId}")
    @PreAuthorize("@hasPermissionService.hasPermission('" + Permission.ADMIN_ASSIGN_PERMISSIONS + "')")
    public ResponseEntity<String> assignPermissions(
            @PathVariable String userId,
            @RequestBody Map<String, List<String>> request) {
        
        List<String> permissions = request.get("permissions");
        hasPermissionService.setPermissions(userId, permissions);
        log.info("Permissions {} assigned to user {}", permissions, userId);
        
        return ResponseEntity.ok("Permissions assigned successfully");
    }

    @DeleteMapping("/remove/{userId}")
    @PreAuthorize("@hasPermissionService.hasPermission('" + Permission.ADMIN_ASSIGN_PERMISSIONS + "')")
    public ResponseEntity<String> removePermission(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        
        String permission = request.get("permission");
        hasPermissionService.removePermission(userId, permission);
        log.info("Permission {} removed from user {}", permission, userId);
        
        return ResponseEntity.ok("Permission removed successfully");
    }

    @GetMapping("/test")
    @PreAuthorize("@hasPermissionService.hasPermission('" + Permission.USER_READ + "')")
    public ResponseEntity<String> testPermission() {
        return ResponseEntity.ok("Permission test successful! You have USER_READ permission.");
    }
}
