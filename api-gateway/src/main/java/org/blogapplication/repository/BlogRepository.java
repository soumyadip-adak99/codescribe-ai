package org.blogapplication.repository;


import org.blogapplication.entity.BlogEntries;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends MongoRepository<BlogEntries, String> {
    Optional<BlogEntries> findBlogById(String id);
}
