package org.blogapplication.services;

import org.blogapplication.dto.AuthenticationRequest;
import org.blogapplication.dto.AuthenticationResponse;
import org.blogapplication.dto.UserRequest;
import org.blogapplication.dto.UserResponse;

public interface AuthenticationService {
    /**
     * this function for admin controller
     *
     * @param request request containing the user details that's can store the database
     */
    UserResponse registerNewUser(UserRequest request);

    AuthenticationResponse login(AuthenticationRequest authrequest);

    UserResponse getLoggedUser();
}
