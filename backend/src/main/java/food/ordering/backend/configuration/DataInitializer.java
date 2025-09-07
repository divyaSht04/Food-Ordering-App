package food.ordering.backend.configuration;

import food.ordering.backend.entity.User;
import food.ordering.backend.enums.RoleType;
import food.ordering.backend.permission.Permission;
import food.ordering.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${system.admin.email}")
    private String adminEmail;

    @Value("${system.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");
        initializeDefaultAdminUser();
        log.info("Data initialization completed.");
    }

    private void initializeDefaultAdminUser() {
        log.info("Initializing default admin user...");

        if (adminEmail == null || adminEmail.trim().isEmpty() || adminPassword == null || adminPassword.trim().isEmpty()) {
            log.error("system.admin.email and/or system.admin.password properties are not set. Skipping default admin user creation.");
            return;
        }

        if (!userRepository.findByEmail(adminEmail).isPresent()) {
            User adminUser = new User();
            adminUser.setFullName("System Administrator");
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(RoleType.SUPERADMIN);

            // Super admin gets all permissions
            List<String> allPermissions = new ArrayList<>();
            Permission.ALL_PERMISSIONS.forEach(perm -> allPermissions.add(perm.permissionName()));
            adminUser.setPermissions(allPermissions);

            userRepository.save(adminUser);
            log.info("Created default admin user: {}", adminEmail);
            log.warn("IMPORTANT: Change the default admin password in production!");
        } else {
            log.debug("Default admin user already exists: {}", adminEmail);
        }
    }
}
