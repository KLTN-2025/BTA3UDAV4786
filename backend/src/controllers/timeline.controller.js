import models from "../models/index.js";

export const listEvents = async (req, res) => {
  try {
    const events = await models.TimelineEvent.findAll({
      order: [['year', 'ASC'], ['order', 'ASC']] // Xếp tăng dần theo năm
    });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const createEvent = async (req, res) => {
  try {
    const { year, title, description, order } = req.body;
    
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => 
        `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`
      );
    }

    const event = await models.TimelineEvent.create({ 
      year, 
      title, 
      description, 
      images: imageUrls, 
      order 
    });
    
    res.status(201).json(event);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


export const updateEvent = async (req, res) => {
  try {
    const event = await models.TimelineEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Not found" });

    const { year, title, description, order } = req.body;
    
    // Mặc định giữ nguyên danh sách ảnh cũ
    let imageUrls = event.images;

    // Nếu có upload ảnh mới -> Thay thế hoàn toàn danh sách cũ
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => 
        `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`
      );
    }

    await event.update({ 
      year, 
      title, 
      description, 
      images: imageUrls, 
      order 
    });
    
    res.json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteEvent = async (req, res) => {
    try {
        await models.TimelineEvent.destroy({ where: { id: req.params.id } });
        res.json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};