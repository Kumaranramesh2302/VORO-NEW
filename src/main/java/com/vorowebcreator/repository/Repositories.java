package com.vorowebcreator.repository;

import com.vorowebcreator.model.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByRole(User.Role role);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:q% OR u.email LIKE %:q% OR u.company LIKE %:q%")
    Page<User> searchUsers(@Param("q") String query, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE MONTH(u.createdAt) = MONTH(CURRENT_DATE) AND YEAR(u.createdAt) = YEAR(CURRENT_DATE)")
    long countNewUsersThisMonth();
}

@Repository
interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByClient(User client, Pageable pageable);
    Page<Project> findByClientAndStatus(User client, Project.Status status, Pageable pageable);
    Page<Project> findByStatus(Project.Status status, Pageable pageable);
    long countByStatus(Project.Status status);

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countGroupByStatus();
}

@Repository
interface PackageRepository extends JpaRepository<Package, Long> {
    Optional<Package> findBySlug(String slug);
    List<Package> findByIsActiveTrueOrderByPriceAsc();
}

@Repository
interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUser(User user, Pageable pageable);
    long countByUserAndIsReadFalse(User user);
    Optional<Notification> findByIdAndUser(Long id, User user);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllReadForUser(@Param("userId") Long userId);
}

@Repository
interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByIsPublishedTrueOrderByCreatedAtDesc();

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.isPublished = true")
    Double getAverageRating();
}

@Repository
interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByRoomIdOrderByCreatedAtDesc(Long roomId, Pageable pageable);
    long countByRoomIdAndIsReadFalseAndSenderIdNot(Long roomId, Long senderId);
}

@Repository
interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByProjectId(Long projectId);
}

@Repository
interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(ContactMessage.Status status);
}

@Repository
interface PortfolioRepository extends JpaRepository<PortfolioItem, Long> {
    Optional<PortfolioItem> findBySlugAndIsPublishedTrue(String slug);
    List<PortfolioItem> findByIsFeaturedTrueAndIsPublishedTrueOrderBySortOrderAsc();
    Page<PortfolioItem> findByIsPublishedTrue(Pageable pageable);
    Page<PortfolioItem> findByCategoryAndIsPublishedTrue(String category, Pageable pageable);
}

@Repository
interface TemplateRepository extends JpaRepository<Template, Long> {
    Page<Template> findByIsActiveTrueOrderBySortOrderDesc(Pageable pageable);
    Page<Template> findByCategoryAndIsActiveTrue(String category, Pageable pageable);
}

@Repository
interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientOrderByCreatedAtDesc(User client);
    Optional<Invoice> findByInvoiceNumber(String number);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PAID'")
    java.math.BigDecimal getTotalRevenue();
}

@Repository
interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjectOrderBySortOrderAsc(Project project);
}
