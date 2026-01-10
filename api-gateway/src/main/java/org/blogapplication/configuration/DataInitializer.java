package org.blogapplication.configuration;

import org.blogapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import org.blogapplication.constants.Roles;
import org.blogapplication.constants.UserStatus;
import org.blogapplication.entity.User;

@Configuration
public class DataInitializer {

  @Value("${app.default.admin.email}")
  private String adminEmail;

  @Value("${app.default.admin.password}")
  private String adminPassword;

  @Value("${app.default.admin.mob}")
  private String phone_number;

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = User.builder()
                        .firstname("MasterAdmin")
                        .lastname("io.codeScribe")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword)) // change in production
                        //.phoneNumber(phone_number)
                        .userStatus(UserStatus.ACTIVE)
                        .role(List.of(Roles.ROLE_ADMIN.toString()))
                        .build();
                userRepository.save(admin);
                System.out.println(" Admin user created: " + adminEmail);
            } else {
                System.out.println("ℹ Admin user already exists.");
            }
        };
    }
}
