package food.ordering.backend.configuration;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import food.ordering.backend.entity.Permission;
import food.ordering.backend.entity.Roles;
import food.ordering.backend.entity.User;
import food.ordering.backend.repository.PermissionRepository;
import food.ordering.backend.repository.RoleRepository;
import food.ordering.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");
        
        initializePermissions();
        initializeRoles();
        initializeDefaultAdminUser();
        
        log.info("Data initialization completed successfully!");
    }

    private void initializePermissions() {
        log.info("Initializing permissions...");

        createPermissionIfNotExists("READ_USERS", "Can read user information" );
        createPermissionIfNotExists("WRITE_USERS", "Can create and update users");
        createPermissionIfNotExists("DELETE_USERS", "Can delete users");
        createPermissionIfNotExists("MANAGE_ROLES", "Can manage user roles");
        createPermissionIfNotExists("READ_ORDERS", "Can read order information");
        createPermissionIfNotExists("WRITE_ORDERS", "Can create and update orders");
        createPermissionIfNotExists("DELETE_ORDERS", "Can delete orders");
        createPermissionIfNotExists("MANAGE_MENU", "Can manage menu items");
        createPermissionIfNotExists("MANAGE_RESTAURANTS", "Can manage restaurant information");
        createPermissionIfNotExists("VIEW_ANALYTICS", "Can view system analytics");
        
        log.info("Permissions initialization completed.");
    }

    private void initializeRoles() {
        log.info("Initializing roles...");

        createRoleIfNotExists(
            Roles.RoleType.CUSTOMER, 
            false,
            Set.of("READ_ORDERS", "WRITE_ORDERS")
        );
        
        // Create ADMIN role
        createRoleIfNotExists(
            Roles.RoleType.ADMIN, 
            false,
            Set.of("READ_USERS", "READ_ORDERS", "WRITE_ORDERS", "DELETE_ORDERS", 
                   "MANAGE_MENU", "MANAGE_RESTAURANTS", "VIEW_ANALYTICS")
        );
        
        // Create SUPERADMIN role
        createRoleIfNotExists(
            Roles.RoleType.SUPERADMIN, 
            true,
            Set.of("READ_USERS", "WRITE_USERS", "DELETE_USERS", "MANAGE_ROLES",
                   "READ_ORDERS", "WRITE_ORDERS", "DELETE_ORDERS",
                   "MANAGE_MENU", "MANAGE_RESTAURANTS", "VIEW_ANALYTICS")
        );
        
        log.info("Roles initialization completed.");
    }

    private void initializeDefaultAdminUser() {
        log.info("Initializing default admin user...");
        
        String adminEmail = "admin@fooddelivery.com";
        
        if (!userRepository.findByEmail(adminEmail).isPresent()) {
            User adminUser = new User();
            adminUser.setFullName("System Administrator");
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Change this password in production!

            roleRepository.findByName(Roles.RoleType.SUPERADMIN)
                .ifPresent(adminUser::setRole);
            
            userRepository.save(adminUser);
            log.info("Created default admin user: {} (Password: admin123)", adminEmail);
            log.warn("IMPORTANT: Change the default admin password in production!");
        } else {
            log.debug("Default admin user already exists: {}", adminEmail);
        }
    }

    private void createPermissionIfNotExists(String name, String description) {
        try {
            Optional<Permission> existingPermission = permissionRepository.findByName(name);
            if (existingPermission.isEmpty()) {
                Permission permission = new Permission();
                permission.setName(name);
                permission.setDescription(description);
                permissionRepository.save(permission);
                log.info("Created permission: {}", name);
            } else {
                log.debug("Permission already exists: {}", name);
            }
        } catch (Exception e) {
            log.warn("Error checking/creating permission {}: {}", name, e.getMessage());
        }
    }

    private void createRoleIfNotExists(Roles.RoleType roleType, boolean canManagePermissions, Set<String> permissionNames) {
        try {
            Optional<Roles> existingRole = roleRepository.findByName(roleType);
            if (existingRole.isEmpty()) {
                Roles role = new Roles();
                role.setName(roleType);
                role.setCanManagePermissions(canManagePermissions);

                Set<Permission> permissions = new HashSet<>();
                for (String permissionName : permissionNames) {
                    permissionRepository.findByName(permissionName)
                        .ifPresent(permissions::add);
                }
                role.setPermissions(permissions);
                
                roleRepository.save(role);
                log.info("Created role: {} with {} permissions", roleType, permissions.size());
            } else {
                log.debug("Role already exists: {}", roleType);
            }
        } catch (Exception e) {
            log.warn("Error checking/creating role {}: {}", roleType, e.getMessage());
        }
    }
}
