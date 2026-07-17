import { api } from "@/services";

export class DashboardService {

    async getDashboard() {

        const { data } = await api.get("/dashboard");

        return data;

    }

}

export const dashboardService = new DashboardService();