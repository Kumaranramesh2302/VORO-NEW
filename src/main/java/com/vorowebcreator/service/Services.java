package com.vorowebcreator.service;

import com.vorowebcreator.dto.*;
import com.vorowebcreator.exception.*;
import com.vorowebcreator.model.*;
import com.vorowebcreator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

// ─── UserService ──────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .company(user.getCompany())
                .bio(user.getBio())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest req, User user) {
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getCompany() != null) user.setCompany(req.getCompany());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getAvatarUrl() != null) user.setAvatarUrl(req.getAvatarUrl());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String current, String newPass, User user) {
        if (!passwordEncoder.matches(current, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
    }
}

// ─── ProjectService ───────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
class ProjectService {

    private final ProjectRepository projectRepository;
    private final PackageRepository packageRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponse create(CreateProjectRequest req, User client) {
        Package pkg = null;
        if (req.getPackageId() != null) {
            pkg = packageRepository.findById(req.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Package not found"));
        }

        Project project = Project.builder()
                .client(client)
                .packageItem(pkg)
                .title(req.getTitle())
                .description(req.getDescription())
                .requirements(req.getRequirements())
                .budget(req.getBudget())
                .deadline(req.getDeadline())
                .build();

        project = projectRepository.save(project);

        // Notify admins
        userRepository.findAllByRole(User.Role.ADMIN).forEach(admin ->
            notificationService.createForUser(admin,
                "New Project Request", "Client " + client.getName() + " submitted: " + req.getTitle(), "INFO")
        );

        // Notify client
        notificationService.createForUser(client, "Project Submitted!",
                "Your project '" + req.getTitle() + "' has been received and is under review.", "SUCCESS");

        return toResponse(project);
    }

    public Page<ProjectResponse> getByClient(User client, int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Project> projects;
        if (status != null && !status.isBlank()) {
            projects = projectRepository.findByClientAndStatus(client,
                    Project.Status.valueOf(status.toUpperCase()), pageable);
        } else {
            projects = projectRepository.findByClient(client, pageable);
        }
        return projects.map(this::toResponse);
    }

    public ProjectResponse getById(Long id, User user) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (user.getRole() != User.Role.ADMIN && !p.getClient().getId().equals(user.getId())) {
            throw new ForbiddenException("Access denied");
        }
        return toResponse(p);
    }

    @Transactional
    public ProjectResponse updateStatus(Long id, Project.Status status) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        p.setStatus(status);
        if (status == Project.Status.IN_PROGRESS && p.getStartDate() == null) {
            p.setStartDate(java.time.LocalDate.now());
        }
        if (status == Project.Status.COMPLETED && p.getEndDate() == null) {
            p.setEndDate(java.time.LocalDate.now());
            p.setProgress(100);
        }
        notificationService.createForUser(p.getClient(), "Project Status Updated",
                "Your project '" + p.getTitle() + "' status changed to " + status.name(), "INFO");
        return toResponse(projectRepository.save(p));
    }

    @Transactional
    public ProjectResponse updateProgress(Long id, int progress) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        p.setProgress(Math.min(100, Math.max(0, progress)));
        return toResponse(projectRepository.save(p));
    }

    public ProjectResponse toResponse(Project p) {
        UserService us = new UserService(null, null); // simplified for compilation
        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .requirements(p.getRequirements())
                .status(p.getStatus().name())
                .priority(p.getPriority().name())
                .budget(p.getBudget())
                .deadline(p.getDeadline())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .progress(p.getProgress())
                .adminNotes(p.getAdminNotes())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}

// ─── NotificationService ──────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createForUser(User user, String title, String message, String type) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(Notification.NotifType.valueOf(type))
                .build();
        notificationRepository.save(n);
    }

    public Page<Object> getForUser(User user, int page) {
        Pageable pageable = PageRequest.of(page, 20, Sort.by("createdAt").descending());
        return notificationRepository.findByUser(user, pageable).map(n -> (Object) n);
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markRead(Long id, User user) {
        notificationRepository.findByIdAndUser(id, user).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllRead(User user) {
        notificationRepository.markAllReadForUser(user.getId());
    }
}

// ─── AdminService ─────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("activeProjects", projectRepository.countByStatus(Project.Status.IN_PROGRESS));
        stats.put("pendingProjects", projectRepository.countByStatus(Project.Status.PENDING));
        stats.put("completedProjects", projectRepository.countByStatus(Project.Status.COMPLETED));
        stats.put("newUsersThisMonth", userRepository.countNewUsersThisMonth());
        stats.put("projectsByStatus", projectRepository.countGroupByStatus());
        return stats;
    }

    public Page<UserResponse> getUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.searchUsers(search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(userService::toResponse);
    }

    public Page<ProjectResponse> getAllProjects(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Project> projects;
        if (status != null && !status.isBlank()) {
            projects = projectRepository.findByStatus(Project.Status.valueOf(status.toUpperCase()), pageable);
        } else {
            projects = projectRepository.findAll(pageable);
        }
        // simplified mapping
        return projects.map(p -> new ProjectResponse());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(!user.getIsActive());
        return userService.toResponse(userRepository.save(user));
    }
}
