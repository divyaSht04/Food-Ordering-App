package food.ordering.backend.permission;

import food.ordering.backend.entity.User;
import food.ordering.backend.enums.RoleType;
import food.ordering.backend.exception.ApiPermissionException;
import food.ordering.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HasPermissionService {

    private final UserRepository userRepository;

    public boolean hasPermission(String permission) {
        try {
            User currentUser = getCurrentUser();
            
            if (currentUser == null) {
                log.warn("No authenticated user found");
                throw new ApiPermissionException("Access Denied. User not authenticated");
            }

            // Super admin has all permissions
            if (currentUser.getRole() == RoleType.SUPERADMIN) {
                log.debug("Super admin access granted for permission: {}", permission);
                return true;
            }

            // Check if user has the specific permission
            boolean hasPermission = currentUser.getPermissions().contains(permission);
            
            if (!hasPermission) {
                log.warn("User {} denied access for permission: {}", currentUser.getEmail(), permission);
                throw new ApiPermissionException("Access Denied. No proper permissions: " + permission);
            }

            log.debug("User {} granted access for permission: {}", currentUser.getEmail(), permission);
            return true;

        } catch (Exception e) {
            log.error("Error checking permission: {}", permission, e);
            throw new ApiPermissionException("Access Denied. Error checking permissions: " + permission);
        }
    }

    public void setPermission(String userId, String permission) {
        User currentUser = getCurrentUser();

        assert currentUser != null;
        if (currentUser.getRole() != RoleType.SUPERADMIN &&
            !currentUser.getPermissions().contains(Permission.ADMIN_ASSIGN_PERMISSIONS)) {
            throw new ApiPermissionException("Access Denied. Cannot assign permissions");
        }

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!targetUser.getPermissions().contains(permission)) {
            targetUser.getPermissions().add(permission);
            userRepository.save(targetUser);
            log.info("Permission {} assigned to user {}", permission, targetUser.getEmail());
        }
    }

    public void removePermission(String userId, String permission) {
        User currentUser = getCurrentUser();
        
        // Only super admin or admin with ADMIN_ASSIGN_PERMISSIONS can remove permissions
        if (currentUser.getRole() != RoleType.SUPERADMIN &&
            !currentUser.getPermissions().contains(Permission.ADMIN_ASSIGN_PERMISSIONS)) {
            throw new ApiPermissionException("Access Denied. Cannot remove permissions");
        }

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetUser.getPermissions().contains(permission)) {
            targetUser.getPermissions().remove(permission);
            userRepository.save(targetUser);
            log.info("Permission {} removed from user {}", permission, targetUser.getEmail());
        }
    }

    public void setPermissions(String userId, List<String> permissions) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != RoleType.SUPERADMIN &&
            !currentUser.getPermissions().contains(Permission.ADMIN_ASSIGN_PERMISSIONS)) {
            throw new ApiPermissionException("Access Denied. Cannot assign permissions");
        }

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        targetUser.getPermissions().clear();
        targetUser.getPermissions().addAll(permissions);
        userRepository.save(targetUser);
        log.info("Permissions updated for user {}: {}", targetUser.getEmail(), permissions);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}
