package food.ordering.backend.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Slf4j
// @Configuration // Disabled - now using application-sensitive.yml instead of .env
public class EnvironmentConfig {

    // This class is no longer needed as we've moved to Spring's native property files
    // Keeping for reference, but commented out to avoid conflicts
    
    /*
    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .filename(".env")
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();

                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                    log.info("Set system property: {}", key);
                    log.debug("Loaded environment variable: {}", key);
                }
            });
            
            log.info("Environment variables loaded successfully from .env file");
        } catch (Exception e) {
            log.warn("Could not load .env file: {}", e.getMessage());
            log.info("Application will use system environment variables or default values");
        }
    }
    */
}
