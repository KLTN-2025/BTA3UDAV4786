import { API_BASE_URL } from "./config";

export const RoomAPI = {
  async list() {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    return res.json();
  },

  async getGraph(roomId) {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/graph`);
    return res.json();
  },
};
