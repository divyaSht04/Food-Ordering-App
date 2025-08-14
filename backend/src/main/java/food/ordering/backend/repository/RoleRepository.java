package food.ordering.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import food.ordering.backend.entity.Roles;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Long> {
    Optional<Roles> findByName(Roles.RoleType name);
    boolean existsByName(Roles.RoleType name);
}
