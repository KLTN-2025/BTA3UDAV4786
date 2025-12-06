import db from "../models/index.js";

const User = db.User;

//sắp xếp mới nhất trước
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['googleId'] } // Ẩn thông tin nhạy cảm
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//Cập nhật vai trò
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    user.role = role;
    await user.save();

    res.json({ message: "Cập nhật thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    await user.destroy(); 
    
    res.json({ message: "Đã xóa user (Soft Delete)" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa user", error: error.message });
  }
};