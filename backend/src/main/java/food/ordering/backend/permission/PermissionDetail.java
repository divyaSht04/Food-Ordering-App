package food.ordering.backend.permission;

import food.ordering.backend.enums.PermissionSection;

public record PermissionDetail(String permissionName, String permissionDescription, PermissionSection section) {

}
