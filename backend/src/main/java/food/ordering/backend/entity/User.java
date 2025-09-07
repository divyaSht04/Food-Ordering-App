package food.ordering.backend.entity;

import food.ordering.backend.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "permission")
    private List<String> permissions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.permissions == null) {
            this.permissions = new ArrayList<>();
        }
    }
}
