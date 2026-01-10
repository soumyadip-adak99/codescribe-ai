package org.blogapplication.Service;

import org.blogapplication.entity.User;
import org.blogapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DataTest {

    @Autowired
    private UserRepository userRepository;

//    @Disabled
//    @Test
//    void saveData(){
//        User user =  new User(null, null, null, null, null, null, null, null);
//
//        user.setFirstname("Team");
//        user.setLastname("Davis");
//        user.setEmail("gamil@gamil.com");
//        user.setPassword("gamil");
//        user.setPhoneNumber("gamil");
//        user.setRole("USER");
//        userRepository.save(user);
//    }
}

