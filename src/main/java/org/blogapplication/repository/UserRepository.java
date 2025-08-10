package org.blogapplication.repository;

import java.util.List;
import java.util.Optional;

import org.blogapplication.constants.UserStatus;
import org.blogapplication.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    List<User> findByUserStatus(UserStatus status);
    List<User> findByRole(List<String> role);
    long countByUserStatus(UserStatus active);
}
