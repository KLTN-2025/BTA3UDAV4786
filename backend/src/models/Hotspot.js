export default (sequelize, DataTypes) => {
  const Hotspot = sequelize.define("Hotspot", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fromPanoramaId: { type: DataTypes.UUID, allowNull: false },
    toPanoramaId: { type: DataTypes.UUID, allowNull: false },
    // vị trí hotspot trên "sàn"
    x: { type: DataTypes.FLOAT, allowNull: false },
    y: { type: DataTypes.FLOAT, allowNull: false, defaultValue: -1.499 },
    z: { type: DataTypes.FLOAT, allowNull: false },
    lookAtX: { type: DataTypes.FLOAT, defaultValue: 0 },
    lookAtY: { type: DataTypes.FLOAT, defaultValue: 0 },
    lookAtZ: { type: DataTypes.FLOAT, defaultValue: -1 },
    label: DataTypes.STRING,
    radius: { type: DataTypes.FLOAT, defaultValue: 0.12 } // kích thước vòng tròn
  });
  Hotspot.associate = (models) => {
    Hotspot.belongsTo(models.Panorama, { foreignKey: "fromPanoramaId", as: "from" });
    Hotspot.belongsTo(models.Panorama, { foreignKey: "toPanoramaId", as: "to" });
  };
  return Hotspot;
};
