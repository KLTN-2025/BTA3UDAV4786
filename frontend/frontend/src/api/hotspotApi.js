import { API_BASE_URL } from "./config";

export const HotspotAPI = {
  async getByPanorama(panoId) {
    const res = await fetch(`${API_BASE_URL}/hotspots/from/${panoId}`);
    return res.json();
  },
};
