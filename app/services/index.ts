import { BaseService } from "./BaseService"
import Cifraclub from "./CifraclubService"

export const services: BaseService[] = [new Cifraclub()]
export const getService = (serviceName: string) => {
  return services.find(s => s.name == serviceName)
}