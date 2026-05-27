package com.vorowebcreator.service;

import com.vorowebcreator.dto.*;
import com.vorowebcreator.exception.*;
import com.vorowebcreator.model.User;
import com.vorowebcreator.repository.*;
import com.vorowebcreator.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// ─── AuthService ─────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authManager;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .company(req.getCompany())
                .phone(req.getPhone())
                .role(User.Role.CLIENT)
                .build();

        user = userRepository.save(user);

        // Welcome notification
        notificationService.createForUser(user, "Welcome to VoroWebCreator! 🎉",
                "Your account has been created. Start by submitting a project request.", "INFO");

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        String email = jwtUtils.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (!jwtUtils.isTokenValid(refreshToken, user)) {
            throw new UnauthorizedException("Refresh token expired");
        }
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .accessToken(jwtUtils.generateToken(user))
                .refreshToken(jwtUtils.generateRefreshToken(user))
                .user(userService.toResponse(user))
                .build();
    }
}
