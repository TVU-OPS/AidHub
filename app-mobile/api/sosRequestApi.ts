import axiosConfig from "@/lib/axiosConfig";
import { CreateSosRequest } from "@/types/sos-request";

const sosRequestApi = {
  async createSosRequest(data: CreateSosRequest): Promise<any> {
    const res = await axiosConfig.post("/sos-requests", data);
    return res;
  },
};
export default sosRequestApi;