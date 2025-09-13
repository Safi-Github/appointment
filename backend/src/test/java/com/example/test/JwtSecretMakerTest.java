package com.example.test;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import java.util.Base64;

import javax.crypto.SecretKey;

public class JwtSecretMakerTest {

    @Test
    public void generateSecretKey() {
        // Generate a secure secret key for HS512 algorithm
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

        // Encode the key as a Base64 string
        String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());

        // Print the generated secret key
        System.out.printf("\nGenerated Secret Key: [%s]\n", encodedKey);
        
    }
}