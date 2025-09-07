package food.ordering.backend.service;

import food.ordering.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
public class CustomUserDetails implements UserDetails {

    public User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        
        // Add role authority
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        
        // Add permission authorities
        if (user.getPermissions() != null) {
            user.getPermissions().forEach(
                permission -> authorities.add(new SimpleGrantedAuthority(permission))
            );
        }
        
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }
}
