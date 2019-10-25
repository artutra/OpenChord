import { BaseService } from "./BaseService"
import OpenChordService from "./OpenChordService"

export const services: BaseService[] = [new OpenChordService()]
export const getService = (serviceName: string) => {
  return services.find(s => s.name == serviceName)
}