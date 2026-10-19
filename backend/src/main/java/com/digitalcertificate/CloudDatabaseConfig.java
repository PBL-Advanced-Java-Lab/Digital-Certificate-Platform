package com.digitalcertificate;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Automatically adapts cloud database URLs (postgres:// or postgresql://)
 * provided by Render, Heroku, Railway, or Supabase into standard JDBC format.
 */
@Configuration
public class CloudDatabaseConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/digital_certificate_db}")
    private String defaultUrl;

    @Value("${spring.datasource.username:postgres}")
    private String defaultUsername;

    @Value("${spring.datasource.password:pikachu}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = defaultUrl;
        }

        String envUser = System.getenv("SPRING_DATASOURCE_USERNAME");
        String envPass = System.getenv("SPRING_DATASOURCE_PASSWORD");
        String finalUser = (envUser != null && !envUser.isBlank()) ? envUser : defaultUsername;
        String finalPass = (envPass != null && !envPass.isBlank()) ? envPass : defaultPassword;

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(dbUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                config.setJdbcUrl(jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    config.setUsername(userInfo[0]);
                    if (userInfo.length > 1) {
                        config.setPassword(userInfo[1]);
                    }
                } else {
                    config.setUsername(finalUser);
                    config.setPassword(finalPass);
                }
            } catch (Exception e) {
                config.setJdbcUrl(dbUrl);
                config.setUsername(finalUser);
                config.setPassword(finalPass);
            }
        } else {
            config.setJdbcUrl(dbUrl);
            config.setUsername(finalUser);
            config.setPassword(finalPass);
        }

        // Connection pool defaults
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);

        return new HikariDataSource(config);
    }
}
