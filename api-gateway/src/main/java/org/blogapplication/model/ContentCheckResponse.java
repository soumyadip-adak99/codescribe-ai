package org.blogapplication.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContentCheckResponse {

    private String input;
    private String moderation_result;

    @JsonProperty("is_inappropriate")
    private boolean inappropriate;

    private List<FlaggedWord> flagged_words;

    @Getter
    @Setter
    public static class FlaggedWord {
        private String word;
        private String explanation;
    }
}
