package org.blogapplication.cache;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.blogapplication.entity.ConfigApi;
import org.blogapplication.repository.ConfigApiRepository;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AppCache {

    private final ConfigApiRepository configApiRepository;

    public enum key {
        AI_API;
    }

    public Map<String, String> cache;

    @PostConstruct
    public void init() {
        cache = new HashMap<>();

        List<ConfigApi> all = configApiRepository.findAll();

        for (ConfigApi configApi : all) {
            cache.put(configApi.getKey(), configApi.getValue());
        }
    }
}
