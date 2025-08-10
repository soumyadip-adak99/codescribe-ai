package org.blogapplication.repository;

import org.blogapplication.entity.ImageEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends MongoRepository<ImageEntity, String> {
    Optional<ImageEntity> findById(String id);
}
