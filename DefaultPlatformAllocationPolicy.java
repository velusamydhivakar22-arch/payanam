import java.time.LocalTime;
import java.util.Collection;

public class DefaultPlatformAllocationPolicy
        implements PlatformAllocationPolicy {

    @Override
    public Platform selectPlatform(
            Collection<Platform> platforms,
            PlatformRequest request) {

        // 5 minute clearance buffer
        LocalTime releaseTime =
                request.getDeparture()
                        .plusMinutes(5);

        Platform bestPlatform =
                null;

        for (Platform platform :
                platforms) {

            if (platform.canAllocate(
                    request.getTrain(),
                    request.getArrival(),
                    releaseTime)) {

                /*
                 * Smallest suitable
                 * platform choose pannuvom.
                 */

                if (bestPlatform == null
                        ||
                        platform.getPlatformLength()
                                <
                        bestPlatform
                                .getPlatformLength()) {

                    bestPlatform =
                            platform;
                }
            }
        }

        return bestPlatform;
    }
}
