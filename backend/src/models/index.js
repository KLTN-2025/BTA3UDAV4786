import { sequelize } from "../config/db.postgres.js";
import Sequelize from "sequelize";
import RoomModel from "./Room.js";
import PanoramaModel from "./Panorama.js";
import HotspotModel from "./Hotspot.js";
import QuestionModel from "./Question.js";

const models = {};
const DataTypes = Sequelize.DataTypes;

models.Room = RoomModel(sequelize, DataTypes);
models.Panorama = PanoramaModel(sequelize, DataTypes);
models.Hotspot = HotspotModel(sequelize, DataTypes);
models.Question = QuestionModel(sequelize, DataTypes);

// associations
Object.values(models).forEach((m) => m.associate && m.associate(models));

export { sequelize };
export default models;
