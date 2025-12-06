import models from "../models/index.js";

export const createRoom = async (req, res) => {
  try {
    const room = await models.Room.create(req.body);
    res.status(201).json(room);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const listRooms = async (req, res) => {
  const rooms = await models.Room.findAll();
  res.json(rooms);
};

// Lấy chi tiết Room (kèm panoramas)
export const getRoom = async (req, res) => {
  const room = await models.Room.findByPk(req.params.id, {
    include: [{ model: models.Panorama, as: "panoramas" }],
  });
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
};

export const updateRoom = async (req, res) => {
  const room = await models.Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  await room.update(req.body);
  res.json(room);
};

export const deleteRoom = async (req, res) => {
  const room = await models.Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  await room.destroy();
  res.json({ message: "Room deleted" });
};

// Đồ thị di chuyển của 1 Room
export const getRoomGraph = async (req, res) => {
  const pans = await models.Panorama.findAll({
    where: { roomId: req.params.id },
    include: [{ model: models.Hotspot, as: "hotspots" }],
  });
  res.json({ roomId: req.params.id, panoramas: pans });
};
