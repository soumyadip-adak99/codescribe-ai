package org.blogapplication.repository;

import org.blogapplication.entity.ConfigApi;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigApiRepository extends MongoRepository<ConfigApi, String> {
}
