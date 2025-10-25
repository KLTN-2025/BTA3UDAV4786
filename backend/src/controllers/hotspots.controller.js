import models from "../models/index.js";

// Tạo Hotspot mới
export const createHotspot = async (req, res) => {
  try {
    const data = req.body;
    const hs = await models.Hotspot.create(data);
    res.status(201).json(hs);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Lấy tất cả hotspot
export const listHotspots = async (req, res) => {
  const list = await models.Hotspot.findAll();
  res.json(list);
};

// Lấy hotspot theo panorama nguồn
export const listForPanorama = async (req, res) => {
  const list = await models.Hotspot.findAll({ where: { fromPanoramaId: req.params.panoId } });
  res.json(list);
};

// Cập nhật hotspot
export const updateHotspot = async (req, res) => {
  const hs = await models.Hotspot.findByPk(req.params.id);
  if (!hs) return res.status(404).json({ error: "Not found" });
  await hs.update(req.body);
  res.json(hs);
};

// Xoá hotspot
export const deleteHotspot = async (req, res) => {
  const hs = await models.Hotspot.findByPk(req.params.id);
  if (!hs) return res.status(404).json({ error: "Not found" });
  await hs.destroy();
  res.json({ message: "Hotspot deleted" });
};
