package org.blogapplication.services.Implementations;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.cache.AppCache;
import org.blogapplication.model.ContentCheckResponse;
import org.blogapplication.model.PromptRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentCheckerService {

    private final RestTemplate restTemplate;
    private final AppCache appCache;


    protected ContentCheckResponse sendPrompt(PromptRequest promptRequest) throws RuntimeException {
        String API = appCache.cache.get(AppCache.key.AI_API.toString());


        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(APPLICATION_JSON);

        // Create the request with headers
        HttpEntity<PromptRequest> request = new HttpEntity<>(promptRequest, headers);

        try {
            return restTemplate.exchange(API, HttpMethod.POST, request, ContentCheckResponse.class).getBody();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("Error calling AI API: " + e.getMessage(), e);
        }
    }
}
