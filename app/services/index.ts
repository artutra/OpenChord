import { BaseService } from "./BaseService"
import Cifraclub from "./CifraclubService"
import OpenChordService from "./OpenChordService"

export const services: BaseService[] = [new Cifraclub(), new OpenChordService()]
export const getService = (serviceName: string) => {
  return services.find(s => s.name == serviceName)
}