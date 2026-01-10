package org.blogapplication.scheduling;

// TODO: this class will create for testing when it is full fetch host then this class will be deleted


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class APIcall {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ai.api}")
    private String AI_API_URL;

    @Value("${app.run.api}")
    private String RUN_API_URL;


    @Scheduled(cron = "0 */10 * * * *")
    //@Scheduled(cron = "0 * * * * *")
    public void callApiEveryTenMinutes() {
        try {
            String response = restTemplate.getForObject(AI_API_URL, String.class);
            log.info("API response: {}", response);
        } catch (Exception e) {
            log.error("AI API response error: {}", e.getMessage());
        }
    }

    @Scheduled(cron = "0 */5 * * * *")
//    @Scheduled(cron = "0 * * * * *")
    public void runAPI() {
        try {
            String response = restTemplate.getForObject(RUN_API_URL, String.class);
            log.info("RUN API response: {}", response);
        } catch (Exception e) {
            log.error("API response error on function runAPI: {}", e.getMessage());
        }
    }
}
