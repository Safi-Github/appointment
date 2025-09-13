package com.example.test.service;

import com.example.test.entity.MyUser;
import com.example.test.entity.Role;
import com.example.test.repository.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private MyUserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Loading user: {}", username);

        Optional<MyUser> userOpt = repository.findByUsername(username);

        if (userOpt.isEmpty()) {
            log.error("User not found: {}", username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        MyUser user = userOpt.get();
        System.out.println("User roles from DB before mapping: " + user.getRoles());

        // Convert roles into GrantedAuthorities
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(Role::getName)               // get the RoleEnum
                .map(Enum::name)                  // convert enum to String
                .map(SimpleGrantedAuthority::new) // wrap in SimpleGrantedAuthority
                .collect(Collectors.toList());
        System.out.println("Fetched user roles: " + user.getRoles());

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}
