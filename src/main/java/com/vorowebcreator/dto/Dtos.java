package com.vorowebcreator.dto;

import com.vorowebcreator.model.User;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8)
    private String password;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Size(min = 2, max = 100)
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8, max = 50)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Password must contain uppercase, lowercase and number")
    private String password;
    private String company;
    private String phone;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserResponse user;
}

// ─── User DTOs ────────────────────────────────────────────────────────────────

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
    private String avatarUrl;
    private String phone;
    private String company;
    private String bio;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    @Size(min = 2, max = 100)
    private String name;
    private String phone;
    private String company;
    @Size(max = 500)
    private String bio;
    private String avatarUrl;
}

// ─── Project DTOs ─────────────────────────────────────────────────────────────

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String requirements;
    private Long packageId;
    private java.math.BigDecimal budget;
    private java.time.LocalDate deadline;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String status;
    private String priority;
    private java.math.BigDecimal budget;
    private java.time.LocalDate deadline;
    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;
    private Integer progress;
    private String adminNotes;
    private UserResponse client;
    private PackageResponse packageItem;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// ─── Package DTOs ─────────────────────────────────────────────────────────────

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private java.math.BigDecimal price;
    private Integer deliveryDays;
    private Integer revisions;
    private java.util.List<String> features;
    private Boolean isFeatured;
}

// ─── Contact DTOs ─────────────────────────────────────────────────────────────

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    @NotBlank @Size(min = 2, max = 100)
    private String name;
    @NotBlank @Email
    private String email;
    private String phone;
    @Size(max = 200)
    private String subject;
    @NotBlank @Size(min = 10, max = 2000)
    private String message;
}

// ─── Review DTOs ──────────────────────────────────────────────────────────────

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    @NotNull @Min(1) @Max(5)
    private Integer rating;
    @Size(max = 200)
    private String title;
    @Size(max = 1000)
    private String content;
    @NotNull
    private Long projectId;
}

// ─── API Response wrapper ────────────────────────────────────────────────────

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder().success(true).data(data).build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder().success(false).message(message).build();
    }
}
