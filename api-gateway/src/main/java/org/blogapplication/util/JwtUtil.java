package org.blogapplication.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String secretKey;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }


    public String extractRoles(String token) {
        Object authorities = extractAllClaims(token).get("authorities");

        if (authorities == null) {
            return "";
        }

        if (authorities instanceof String) {
            return (String) authorities;
        }

        if (authorities instanceof Collection) {
            @SuppressWarnings("unchecked")
            Collection<String> roles = (Collection<String>) authorities;
            return String.join(",", roles);
        }

        return authorities.toString(); // fallback
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()));
    }

    public String generateToken(UserDetails userDetails) {
    // Flatten the roles cleanly
    Set<String> flatRoles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(role -> role.replace("[", "").replace("]", "")) // Clean any nested junk
            .flatMap(role -> Arrays.stream(role.split(","))) // in case of accidental lists
            .map(String::trim)
            .collect(Collectors.toSet());

    return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("authorities", String.join(",", flatRoles))
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}

}
