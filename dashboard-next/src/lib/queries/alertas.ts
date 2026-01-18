import { getCoordinatorsWithActiveRisk } from "./coordinadores";
import { getWalksWithActiveRisk } from "./caminatas";
import { getEconomicRisks } from "./economia";

export async function getActiveAlerts() {
    const [coordinators, walks, economy] = await Promise.all([
        getCoordinatorsWithActiveRisk(),
        getWalksWithActiveRisk(),
        getEconomicRisks(),
    ]);

    return [...coordinators, ...walks, ...economy];
}
