package com.vorowebcreator.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// ─── Package ──────────────────────────────────────────────────────────────────
@Entity
@Table(name = "packages")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class Package {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true) private String slug;
    @Column(columnDefinition = "TEXT") private String description;
    private BigDecimal price;
    private Integer deliveryDays;
    private Integer revisions;
    @JdbcTypeCode(SqlTypes.JSON) private List<String> features;
    @Builder.Default private Boolean isFeatured = false;
    @Builder.Default private Boolean isActive = true;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}

// ─── Milestone ────────────────────────────────────────────────────────────────
@Entity
@Table(name = "milestones")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class Milestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id") private Project project;
    private String title;
    @Column(columnDefinition = "TEXT") private String description;
    private LocalDate dueDate;
    @Builder.Default private Boolean completed = false;
    private LocalDateTime completedAt;
    private Integer sortOrder;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}

// ─── ChatMessage ──────────────────────────────────────────────────────────────
@Entity
@Table(name = "chat_messages")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class ChatMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "room_id") private Long roomId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id") private User sender;
    @Column(columnDefinition = "TEXT") private String content;
    @Enumerated(EnumType.STRING)
    @Builder.Default private MessageType messageType = MessageType.TEXT;
    @Builder.Default private Boolean isRead = false;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();

    public enum MessageType { TEXT, FILE, SYSTEM }
}

// ─── Notification ─────────────────────────────────────────────────────────────
@Entity
@Table(name = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") private User user;
    private String title;
    @Column(columnDefinition = "TEXT") private String message;
    @Enumerated(EnumType.STRING)
    @Builder.Default private NotifType type = NotifType.INFO;
    private String category;
    private Long referenceId;
    private String referenceType;
    @Builder.Default private Boolean isRead = false;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotifType { INFO, SUCCESS, WARNING, ERROR }
}

// ─── Review ───────────────────────────────────────────────────────────────────
@Entity
@Table(name = "reviews")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id") private User client;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id") private Project project;
    private Integer rating;
    private String title;
    @Column(columnDefinition = "TEXT") private String content;
    @Builder.Default private Boolean isPublished = false;
    @Column(columnDefinition = "TEXT") private String adminReply;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
