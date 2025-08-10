package org.blogapplication.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.blogapplication.constants.UserStatus;
import org.blogapplication.dto.BlogResponse;
import org.blogapplication.dto.BlogStatsResponse;
import org.blogapplication.dto.PlatformStatsResponse;
import org.blogapplication.dto.UserActivityResponse;
import org.blogapplication.dto.UserStatsResponse;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.User;
import org.blogapplication.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")              // secures the whole class
public class AdminController {

   private final AdminService adminService;

    /* ----------------------------------------------------------------
     * USER MANAGEMENT
     * ---------------------------------------------------------------- */

    /** Get every registered user */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/blogs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogEntries>> getAllBlogs() {
        return ResponseEntity.ok(adminService.getAllBlogs());
    }

    /** Promote a user to ADMIN */
    @PatchMapping("/users/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> promoteToAdmin(@PathVariable String id) {
        adminService.promoteToAdmin(id);
        return ResponseEntity.noContent().build();
    }

    /** Suspend (temporary) */
    @PatchMapping("/users/{id}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> suspendUser(@PathVariable String id) {
        adminService.suspendUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Deactivate / block */
    @PatchMapping("/users/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateUser(@PathVariable String id) {
        adminService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Reactivate */
    @PatchMapping("/users/{id}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reactivateUser(@PathVariable String id) {
        adminService.reactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Soft delete */
    @PatchMapping("/users/{id}/soft-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDeleteUser(@PathVariable String id) {
        adminService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Hard delete (irreversible) */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> hardDeleteUser(@PathVariable String id) {
        adminService.hardDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Update roles list */
    @PutMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateRoles(
            @PathVariable String id,
            @RequestBody List<String> roles) {
        adminService.updateUserRoles(id, roles);
        return ResponseEntity.noContent().build();
    }

    /** Users filtered by status */
    @GetMapping("/users/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable UserStatus status) {
        return ResponseEntity.ok(adminService.getUsersByStatus(status));
    }

    /** Users filtered by role */
    @GetMapping("/users/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(adminService.getUsersByRole(role));
    }

    /** Quick status check */
    @GetMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserStatsResponse> getUserStatus(@PathVariable String id) {
        return ResponseEntity.ok(
                UserStatsResponse.builder()
                        .status(UserStatus.valueOf(adminService.getUserStats(id)))
                        .build()
        );
    }

    /* ----------------------------------------------------------------
     * BLOG MANAGEMENT
     * ---------------------------------------------------------------- */

    /** All blogs written by a given user */
    @GetMapping("/users/{id}/blogs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponse>> getUserBlogs(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserBlogs(id));
    }

    /** Reject a blog with reason */
    @PatchMapping("/blogs/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectBlog(
            @PathVariable String id,
            @RequestBody String reason) {
        adminService.rejectBlog(id, reason);
        return ResponseEntity.noContent().build();
    }

    /** Delete blog permanently */
    @DeleteMapping("/blogs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable String id) {
        adminService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    /* ----------------------------------------------------------------
     * ANALYTICS / DASHBOARD
     * ---------------------------------------------------------------- */

    /** Blog‑specific stats (approved, rejected, today, etc.) */
    @GetMapping("/stats/blogs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogStatsResponse> getBlogStats() {
        return ResponseEntity.ok(adminService.getBlogStats());
    }

    /** Platform‑wide stats (users + blogs) */
    @GetMapping("/stats/platform")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlatformStatsResponse> getPlatformStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    /** Top contributors by blog count */
    @GetMapping("/stats/top-contributors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserActivityResponse>> getTopContributors() {
        return ResponseEntity.ok(adminService.getTopContributors());
    }
}
