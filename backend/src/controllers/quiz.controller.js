import models from '../models/index.js'; 

const Question = models.Question;

export const listQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [['createdAt', 'DESC']] // Sắp xếp câu mới nhất lên đầu
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    // Validate
    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: 'Thiếu thông tin câu hỏi, đáp án hoặc đáp án đúng.' });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Đáp án phải là một mảng 4 phần tử.' });
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi.' });
    }

    await question.destroy();
    res.json({ message: 'Đã xóa câu hỏi.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};