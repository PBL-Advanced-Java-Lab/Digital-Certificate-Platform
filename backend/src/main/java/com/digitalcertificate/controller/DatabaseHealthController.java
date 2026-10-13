
package com.digitalcertificate.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class DatabaseHealthController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseHealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/database")
    public Map<String, String> databaseHealth() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);

            return Map.of(
                    "database", "PostgreSQL",
                    "status", "UP",
                    "message", "Database connection successful"
            );
        } catch (Exception exception) {
            return Map.of(
                    "database", "PostgreSQL",
                    "status", "DOWN",
                    "message", "Database connection failed"
            );
        }
    }
}
