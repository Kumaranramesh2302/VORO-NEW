package com.vorowebcreator.controller;

import com.vorowebcreator.dto.*;
import com.vorowebcreator.model.Project;
import com.vorowebcreator.model.User;
import com.vorowebcreator.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

// ─── Project Controller ───────────────────────────────────────────────────────
@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> create(
            @Valid @RequestBody CreateProjectRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Project submitted", projectService.create(req, user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getMyProjects(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getByClient(user, page, size, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getById(id, user)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Project.Status status = Project.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.success(projectService.updateStatus(id, status)));
    }

    @PatchMapping("/{id}/progress")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(ApiResponse.success(projectService.updateProgress(id, body.get("progress"))));
    }
}

// ─── Package Controller ───────────────────────────────────────────────────────
@RestController
@RequestMapping("/packages")
@RequiredArgsConstructor
class PackageController {

    private final PackageService packageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PackageResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(packageService.getAll()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PackageResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(packageService.getBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PackageResponse>> create(@Valid @RequestBody PackageResponse req) {
        return ResponseEntity.ok(ApiResponse.success(packageService.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PackageResponse>> update(
            @PathVariable Long id,
            @RequestBody PackageResponse req) {
        return ResponseEntity.ok(ApiResponse.success(packageService.update(id, req)));
    }
}

// ─── Portfolio Controller ─────────────────────────────────────────────────────
@RestController
@RequestMapping("/portfolio")
@RequiredArgsConstructor
class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Object>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getAll(page, size, category)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Object>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getFeatured()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Object>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody Object req) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.create(req)));
    }
}

// ─── Review Controller ────────────────────────────────────────────────────────
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<Object>>> getPublished() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getPublished()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(
            @Valid @RequestBody CreateReviewRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Review submitted", reviewService.create(req, user)));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> publish(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.publish(id)));
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> reply(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.reply(id, body.get("reply"))));
    }
}

// ─── Contact Controller ───────────────────────────────────────────────────────
@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submit(@Valid @RequestBody ContactRequest req) {
        contactService.submit(req);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", null));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<Object>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(contactService.getAll(page, size)));
    }
}

// ─── File Upload Controller ───────────────────────────────────────────────────
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Long projectId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("File uploaded", fileService.upload(file, projectId, user)));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<Object>>> getByProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(fileService.getByProject(projectId, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        fileService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.success("File deleted", null));
    }
}

// ─── Notification Controller ──────────────────────────────────────────────────
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Object>>> getMyNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getForUser(user, page)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.countUnread(user)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
        notificationService.markRead(id, user);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@AuthenticationPrincipal User user) {
        notificationService.markAllRead(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}

// ─── Admin Dashboard Controller ───────────────────────────────────────────────
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(page, size, search)));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllProjects(page, size, status)));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.toggleUserStatus(id)));
    }
}

// ─── User Profile Controller ──────────────────────────────────────────────────
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.toResponse(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
            @Valid @RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(req, user)));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        userService.changePassword(body.get("currentPassword"), body.get("newPassword"), user);
        return ResponseEntity.ok(ApiResponse.success("Password updated", null));
    }
}

// ─── Chat Controller ──────────────────────────────────────────────────────────
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
class ChatController {

    private final ChatService chatService;

    @GetMapping("/project/{projectId}/messages")
    public ResponseEntity<ApiResponse<Page<Object>>> getMessages(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(chatService.getMessages(projectId, page, user)));
    }

    @PostMapping("/project/{projectId}/messages")
    public ResponseEntity<ApiResponse<Object>> sendMessage(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(chatService.send(projectId, body.get("content"), user)));
    }
}
