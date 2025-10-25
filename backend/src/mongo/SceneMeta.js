import mongoose from "mongoose";
const SceneMetaSchema = new mongoose.Schema({
  panoramaId: String,
  // JSON tùy biến: bố cục, UI state, các mesh phụ
  metadata: Object,
}, { timestamps: true });

export default mongoose.model("SceneMeta", SceneMetaSchema);
