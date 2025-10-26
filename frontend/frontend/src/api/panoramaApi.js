import { API_BASE_URL } from "./config";

export const PanoramaAPI = {
  async getByRoom(roomId) {
    const res = await fetch(`${API_BASE_URL}/panoramas/room/${roomId}`);
    return res.json();
  },
  async getById(panoId) {
    const res = await fetch(`${API_BASE_URL}/panoramas/${panoId}`);
    return res.json();
  },
};
