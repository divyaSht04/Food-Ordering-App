package food.ordering.backend.permission;

import food.ordering.backend.enums.PermissionSection;

import java.util.List;

public class Permission {
    
    // User Management Permissions
    public static final String USER_CREATE = "USER_CREATE";
    public static final String USER_READ = "USER_READ";
    public static final String USER_UPDATE = "USER_UPDATE";
    public static final String USER_DELETE = "USER_DELETE";
    public static final String USER_LIST = "USER_LIST";
    
    // Admin Management Permissions
    public static final String ADMIN_CREATE = "ADMIN_CREATE";
    public static final String ADMIN_READ = "ADMIN_READ";
    public static final String ADMIN_UPDATE = "ADMIN_UPDATE";
    public static final String ADMIN_DELETE = "ADMIN_DELETE";
    public static final String ADMIN_LIST = "ADMIN_LIST";
    public static final String ADMIN_ASSIGN_PERMISSIONS = "ADMIN_ASSIGN_PERMISSIONS";
    
    // Customer Management Permissions
    public static final String CUSTOMER_CREATE = "CUSTOMER_CREATE";
    public static final String CUSTOMER_READ = "CUSTOMER_READ";
    public static final String CUSTOMER_UPDATE = "CUSTOMER_UPDATE";
    public static final String CUSTOMER_DELETE = "CUSTOMER_DELETE";
    public static final String CUSTOMER_LIST = "CUSTOMER_LIST";
    
    // Menu Management Permissions
    public static final String MENU_CREATE = "MENU_CREATE";
    public static final String MENU_READ = "MENU_READ";
    public static final String MENU_UPDATE = "MENU_UPDATE";
    public static final String MENU_DELETE = "MENU_DELETE";
    public static final String MENU_LIST = "MENU_LIST";
    
    // Food Management Permissions
    public static final String FOOD_CREATE = "FOOD_CREATE";
    public static final String FOOD_READ = "FOOD_READ";
    public static final String FOOD_UPDATE = "FOOD_UPDATE";
    public static final String FOOD_DELETE = "FOOD_DELETE";
    public static final String FOOD_LIST = "FOOD_LIST";
    
    // General Permissions
    public static final String GET_ALL_PERMISSIONS_LIST = "GET_ALL_PERMISSIONS_LIST";
    
    public static final List<PermissionDetail> ALL_PERMISSIONS = List.of(
        // User permissions
        new PermissionDetail(USER_CREATE, "Create new users", PermissionSection.USER),
        new PermissionDetail(USER_READ, "Read user information", PermissionSection.USER),
        new PermissionDetail(USER_UPDATE, "Update user information", PermissionSection.USER),
        new PermissionDetail(USER_DELETE, "Delete users", PermissionSection.USER),
        new PermissionDetail(USER_LIST, "List all users", PermissionSection.USER),
        
        // Admin permissions
        new PermissionDetail(ADMIN_CREATE, "Create new admins", PermissionSection.ADMIN),
        new PermissionDetail(ADMIN_READ, "Read admin information", PermissionSection.ADMIN),
        new PermissionDetail(ADMIN_UPDATE, "Update admin information", PermissionSection.ADMIN),
        new PermissionDetail(ADMIN_DELETE, "Delete admins", PermissionSection.ADMIN),
        new PermissionDetail(ADMIN_LIST, "List all admins", PermissionSection.ADMIN),
        new PermissionDetail(ADMIN_ASSIGN_PERMISSIONS, "Assign permissions to admins", PermissionSection.ADMIN),
        
        // Customer permissions
        new PermissionDetail(CUSTOMER_CREATE, "Create new customers", PermissionSection.CUSTOMER),
        new PermissionDetail(CUSTOMER_READ, "Read customer information", PermissionSection.CUSTOMER),
        new PermissionDetail(CUSTOMER_UPDATE, "Update customer information", PermissionSection.CUSTOMER),
        new PermissionDetail(CUSTOMER_DELETE, "Delete customers", PermissionSection.CUSTOMER),
        new PermissionDetail(CUSTOMER_LIST, "List all customers", PermissionSection.CUSTOMER),
        
        // Menu permissions
        new PermissionDetail(MENU_CREATE, "Create new menu items", PermissionSection.MENU),
        new PermissionDetail(MENU_READ, "Read menu information", PermissionSection.MENU),
        new PermissionDetail(MENU_UPDATE, "Update menu items", PermissionSection.MENU),
        new PermissionDetail(MENU_DELETE, "Delete menu items", PermissionSection.MENU),
        new PermissionDetail(MENU_LIST, "List all menu items", PermissionSection.MENU),
        
        // Food permissions
        new PermissionDetail(FOOD_CREATE, "Create new food items", PermissionSection.FOOD),
        new PermissionDetail(FOOD_READ, "Read food information", PermissionSection.FOOD),
        new PermissionDetail(FOOD_UPDATE, "Update food items", PermissionSection.FOOD),
        new PermissionDetail(FOOD_DELETE, "Delete food items", PermissionSection.FOOD),
        new PermissionDetail(FOOD_LIST, "List all food items", PermissionSection.FOOD),
        
        // General permissions
        new PermissionDetail(GET_ALL_PERMISSIONS_LIST, "Get list of all permissions", PermissionSection.ADMIN)
    );
}
