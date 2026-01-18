import { getCoordinatorsWithActiveRisk } from "@/lib/queries/coordinadores";
import { getWalksWithActiveRisk } from "@/lib/queries/caminatas";
import { getEconomicRisks } from "@/lib/queries/economia";

export async function getActiveAlerts() {
    const [coordinators, walks, economy] = await Promise.all([
        getCoordinatorsWithActiveRisk(),
        getWalksWithActiveRisk(),
        getEconomicRisks(),
    ]);

    return [...coordinators, ...walks, ...economy];
}
