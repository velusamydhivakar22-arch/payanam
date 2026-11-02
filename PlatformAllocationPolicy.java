import java.util.Collection;

public interface PlatformAllocationPolicy {

    Platform selectPlatform(
            Collection<Platform> platforms,
            PlatformRequest request
    );
}
