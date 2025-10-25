export default (sequelize, DataTypes) => {
  const Panorama = sequelize.define("Panorama", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    roomId: { type: DataTypes.UUID, allowNull: false },
    title: DataTypes.STRING,
    // đường dẫn ảnh equirectangular (để Sphere map)
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    // vị trí camera (nếu cần, mặc định [0,0,0])
    camX: { type: DataTypes.FLOAT, defaultValue: 0 },
    camY: { type: DataTypes.FLOAT, defaultValue: 0 },
    camZ: { type: DataTypes.FLOAT, defaultValue: 0 },
    // hướng nhìn mặc định (target)
    targetX: { type: DataTypes.FLOAT, defaultValue: 0 },
    targetY: { type: DataTypes.FLOAT, defaultValue: 0 },
    targetZ: { type: DataTypes.FLOAT, defaultValue: -1 },
    // (tuỳ chọn) vector embedding cho search
    // embedding: sequelize.getQueryInterface().sequelize.dialect.name === 'postgres' ? DataTypes.VECTOR(1536) : null
  });
  Panorama.associate = (models) => {
    Panorama.belongsTo(models.Room, { foreignKey: "roomId" });
    Panorama.hasMany(models.Hotspot, { foreignKey: "fromPanoramaId", as: "hotspots" });
  };
  return Panorama;
};
