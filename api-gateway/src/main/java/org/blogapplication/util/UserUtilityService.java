package org.blogapplication.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtilityService {


    /**
     * @return curren_logged_username
     * this function use for getting the logged user username
     * */
    public String getLoggedUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
