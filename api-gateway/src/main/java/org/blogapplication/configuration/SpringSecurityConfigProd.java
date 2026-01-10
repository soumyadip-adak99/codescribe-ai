package org.blogapplication.configuration;

import lombok.RequiredArgsConstructor;
import org.blogapplication.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.PrintWriter;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Profile("prod")
@EnableMethodSecurity
public class SpringSecurityConfigProd {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordConfig passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-resources/**", "/webjars/**"
                        ).permitAll()
                        // Permit all OPTIONS requests first
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Permit all requests to public API endpoints
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/error", "/app/error").permitAll()

                        .requestMatchers("/api/user/**").authenticated()
                        // Require ADMIN role for admin APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Require USER or ADMIN role for user APIs

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )
                // Handle authentication exceptions
                .exceptionHandling(e -> e.authenticationEntryPoint(unauthorizedEntryPoint()))
                // Add JWT filter before Spring Security's default UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        System.out.println("=== SPRING SECURITY PROD CONFIG LOADED ===");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow your frontend origin
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://n02cslhf-5173.inc1.devtunnels.ms/", "https://codescribeai.pages.dev/"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control"
        ));
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Additional CORS filter as fallback, though the .cors() configuration above is usually sufficient.
    // This can be useful if you need to apply CORS very early in the filter chain,
    // before Spring Security's own filter chain.
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder.passwordEncoder());
        return new ProviderManager(authProvider);
    }

    @Bean
    public AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(401);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter writer = response.getWriter();
            writer.write("{\n" +
                    "  \"error\": \"Unauthorized\",\n" +
                    "  \"message\": \"" + authException.getMessage() + "\",\n" +
                    "  \"path\": \"" + request.getRequestURI() + "\"\n" +
                    "}");
        };
    }
}