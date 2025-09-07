package food.ordering.backend.repository;

import food.ordering.backend.entity.PendingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PendingUserRepository extends JpaRepository<PendingUser, Long> {
    
    Optional<PendingUser> findByEmail(String email);
    
    void deleteByEmail(String email);
    
    @Modifying
    @Query("DELETE FROM PendingUser p WHERE p.expiresAt < :now")
    void deleteExpiredPendingUsers(LocalDateTime now);
    
    boolean existsByEmail(String email);
}
