package org.blogapplication.services.Implementations;

import org.blogapplication.constants.Roles;
import org.blogapplication.constants.UserStatus;
import org.blogapplication.dto.AuthenticationRequest;
import org.blogapplication.dto.AuthenticationResponse;
import org.blogapplication.dto.UserRequest;
import org.blogapplication.dto.UserResponse;
import org.blogapplication.entity.User;
import org.blogapplication.repository.UserRepository;
import org.blogapplication.services.AuthenticationService;
import org.blogapplication.util.JwtUtil;
import org.blogapplication.util.UserUtilityService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserUtilityService userUtilityService;

    @Override
    public UserResponse registerNewUser(UserRequest request) {
        User newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);

        // send email
        emailService.sendSuccessfulEmail(request.getEmail(), request.getFirstname() + " " + request.getLastname(), "/templates/successfulEmailMessage.html");

        return convertToResponse(newUser);
    }

    @Override
    public UserResponse getLoggedUser() {
        String email = userUtilityService.getLoggedUserName();
        User user = findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return convertToResponse(user);
    }

    private Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private User convertToEntity(UserRequest request) {
        return User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(List.of(Roles.ROLE_USER.toString()))
                .userStatus(UserStatus.ACTIVE)
                .profileImage(null)
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private UserResponse convertToResponse(User registeredUser) {
        return UserResponse.builder()
                .id(registeredUser.getId())
                .firstname((registeredUser.getFirstname()))
                .lastName(registeredUser.getLastname())
                .email(registeredUser.getEmail())
                .role(registeredUser.getRole())
                .blogs(registeredUser.getBlogEntries())
                .profileImage(registeredUser.getProfileImage())
                .created_at(registeredUser.getCreatedAt())
                .build();
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest authrequest) {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authrequest.getEmail(), authrequest.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authrequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);

        return new AuthenticationResponse(authrequest.getEmail(), jwtToken);
    }
}
