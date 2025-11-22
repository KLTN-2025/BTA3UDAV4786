import { useState, useEffect } from 'react';


const richMockAttempts = [
 
  { id: "attempt-1", score: 9, totalQuestions: 10, createdAt: "2025-10-28T09:00:00Z", User: { id: "user-1", username: "An Nguyễn" },
    details: [
      { question: "Câu 1 là gì?", yourAnswer: "A", correctAnswer: "A" },
      { question: "Câu 2 là gì?", yourAnswer: "B", correctAnswer: "C" }, 
      { question: "Câu 3 là gì?", yourAnswer: "D", correctAnswer: "D" },
      { question: "Câu 4 là gì?", yourAnswer: "A", correctAnswer: "A" },
      { question: "Câu 5 là gì?", yourAnswer: "B", correctAnswer: "B" },
      { question: "Câu 6 là gì?", yourAnswer: "C", correctAnswer: "C" },
      { question: "Câu 7 là gì?", yourAnswer: "D", correctAnswer: "D" },
      { question: "Câu 8 là gì?", yourAnswer: "A", correctAnswer: "A" },
      { question: "Câu 9 là gì?", yourAnswer: "B", correctAnswer: "B" },
      { question: "Câu 10 là gì?", yourAnswer: "C", correctAnswer: "C" },
    ]
  },
 
  { id: "attempt-2", score: 10, totalQuestions: 10, createdAt: "2025-10-28T15:00:00Z", User: { id: "user-2", username: "Bình Lê" }, details: [ /* ... */ ] },
  { id: "attempt-3", score: 7, totalQuestions: 10, createdAt: "2025-10-26T10:00:00Z", User: { id: "user-2", username: "Bình Lê" }, details: [ /* ... */ ] },

  { id: "attempt-4", score: 9, totalQuestions: 10, createdAt: "2025-10-27T11:00:00Z", User: { id: "user-3", username: "Cường Trần" }, details: [ /* ... */ ] },
  { id: "attempt-5", score: 5, totalQuestions: 10, createdAt: "2025-10-25T14:00:00Z", User: { id: "user-3", username: "Cường Trần" }, details: [ /* ... */ ] },

  { id: "attempt-6", score: 8, totalQuestions: 10, createdAt: "2025-10-28T11:00:00Z", User: { id: "user-4", username: "Dũng Phạm" }, details: [ /* ... */ ] },

  { id: "attempt-7", score: 10, totalQuestions: 10, createdAt: "2025-10-27T18:00:00Z", User: { id: "user-5", username: "Giang Hồ" }, details: [ /* ... */ ] },
  { id: "attempt-8", score: 3, totalQuestions: 10, createdAt: "2025-10-27T19:00:00Z", User: { id: "user-6", username: "Hương Vũ" }, details: [ /* ... */ ] },
  { id: "attempt-9", score: 8, totalQuestions: 10, createdAt: "2025-10-26T08:00:00Z", User: { id: "user-7", username: "Khánh Đặng" }, details: [ /* ... */ ] },
  { id: "attempt-10", score: 9, totalQuestions: 10, createdAt: "2025-10-26T09:00:00Z", User: { id: "user-1", username: "An Nguyễn" }, details: [ /* ... */ ] },
  { id: "attempt-11", score: 6, totalQuestions: 10, createdAt: "2025-10-25T10:00:00Z", User: { id: "user-2", username: "Bình Lê" }, details: [ /* ... */ ] },
  { id: "attempt-12", score: 7, totalQuestions: 10, createdAt: "2025-10-25T11:00:00Z", User: { id: "user-8", username: "Linh Bùi" }, details: [ /* ... */ ] },
  { id: "attempt-13", score: 10, totalQuestions: 10, createdAt: "2025-10-24T12:00:00Z", User: { id: "user-9", username: "Minh Nguyễn" }, details: [ /* ... */ ] },
  { id: "attempt-14", score: 8, totalQuestions: 10, createdAt: "2025-10-24T13:00:00Z", User: { id: "user-10", username: "Nam Trần" }, details: [ /* ... */ ] },
  { id: "attempt-15", score: 4, totalQuestions: 10, createdAt: "2025-10-23T14:00:00Z", User: { id: "user-11", username: "Oanh Lê" }, details: [ /* ... */ ] },
].sort((a, b) => b.score - a.score || new Date(a.createdAt) - new Date(b.createdAt)); 

export default function Leaderboard() {
  // State chính
  const [allAttempts, setAllAttempts] = useState([]);
  
  // State cho công cụ
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [attemptsPerPage] = useState(5); 

  
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    
    const sortedData = richMockAttempts.sort((a, b) => 
      b.score - a.score || new Date(a.createdAt) - new Date(b.createdAt)
    );
    setAllAttempts(sortedData);
  }, []);

  
  const filteredAttempts = allAttempts
    .filter(attempt => {
     
      if (filterScore === 'pass') return (attempt.score / attempt.totalQuestions) >= 0.8;
      if (filterScore === 'fail') return (attempt.score / attempt.totalQuestions) < 0.8;
      return true; 
    })
    .filter(attempt => {
    
      return attempt.User.username.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
 
  const totalPages = Math.ceil(filteredAttempts.length / attemptsPerPage);
  const paginatedAttempts = filteredAttempts.slice(
    (currentPage - 1) * attemptsPerPage,
    currentPage * attemptsPerPage
  );

 
  const totalFilteredAttempts = filteredAttempts.length;
  const averageScore = totalFilteredAttempts > 0 
    ? (filteredAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalFilteredAttempts).toFixed(1) 
    : 'N/A';
  const highScore = totalFilteredAttempts > 0 
    ? Math.max(...filteredAttempts.map(a => a.score)) 
    : 'N/A';


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleFilterChange = (e) => {
    setFilterScore(e.target.value);
    setCurrentPage(1); 
  };

  const handleExport = () => {
    alert(`Giả lập xuất ${filteredAttempts.length} kết quả ra file CSV...`);
  };

  const handlePrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const handleNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <main style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <section style={{...sectionStyle, flex: 2}}>
        <h3>🏆 Bảng Xếp Hạng</h3>

       
        {/* <div style={toolbarStyle}>
          <input 
            type="text"
            placeholder="Tìm theo tên người chơi..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={searchInputStyle}
          />
          <select 
            value={filterScore}
            onChange={handleFilterChange}
            style={filterSelectStyle}
          >
            <option value="all">Tất cả điểm</option>
            <option value="pass">Chỉ bài đạt (>= 80%)</option>
            <option value="fail">Chỉ bài trượt (< 80%)</option>
          </select>
          <button style={btnBrown} onClick={handleExport}>
            📤 Xuất Báo Cáo
          </button>
        </div> */}

        {/* BẢNG DỮ LIỆU */}
        <table style={{ ...tableStyle, fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#efebe9" }}>
              <th>Hạng</th>
              <th>Người chơi</th>
              <th>Điểm số</th>
              <th>Ngày làm bài</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAttempts.map((attempt, index) => {
              
              const rank = (currentPage - 1) * attemptsPerPage + index + 1;
              return (
                <tr key={attempt.id}>
                  <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </td>
                  <td>{attempt.User?.username || '(Không rõ)'}</td>
                  <td style={{textAlign: 'center', fontWeight: 'bold'}}>{attempt.score} / {attempt.totalQuestions}</td>
                  <td>{new Date(attempt.createdAt).toLocaleString()}</td>
                  <td style={{textAlign: 'center'}}>
                    <button 
                      style={btnViewStyle}
                      onClick={() => setSelectedAttempt(attempt)}
                    >
                      👁️ Xem chi tiết
                    </button>
                  </td>
                </tr>
              )
            })}
             {filteredAttempts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                  Không tìm thấy kết quả nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      
        {totalPages > 1 && (
          <div style={paginationStyle}>
            <button style={pageBtnStyle} onClick={handlePrevPage} disabled={currentPage === 1}>
              &laquo; Trang trước
            </button>
            <span style={{padding: '0 15px', color: '#333'}}>
              Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
            </span>
            <button style={pageBtnStyle} onClick={handleNextPage} disabled={currentPage === totalPages}>
              Trang sau &raquo;
            </button>
          </div>
        )}
      </section>

   
      <section style={{...sectionStyle, flex: 1}}>
        <h3>📊 Thống kê (Theo bộ lọc)</h3>
        <div style={statBoxStyle}>
          <h4>Tổng số lượt làm bài</h4>
          <p style={statNumberStyle}>{totalFilteredAttempts}</p>
          <small>(Tổng cộng có {allAttempts.length} lượt)</small>
        </div>
        <div style={statBoxStyle}>
          <h4>Điểm trung bình (lọc)</h4>
          <p style={statNumberStyle}>{averageScore}</p>
        </div>
        <div style={statBoxStyle}>
          <h4>Điểm cao nhất (lọc)</h4>
          <p style={statNumberStyle}>{highScore}</p>
        </div>
      </section>

     
      {selectedAttempt && (
        <div style={modalOverlayStyle} onClick={() => setSelectedAttempt(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3>Chi tiết bài làm</h3>
              <button style={closeBtnStyle} onClick={() => setSelectedAttempt(null)}>✖️</button>
            </div>
            <div style={modalBodyStyle}>
              <p><strong>Người chơi:</strong> {selectedAttempt.User.username}</p>
              <p><strong>Ngày làm:</strong> {new Date(selectedAttempt.createdAt).toLocaleString()}</p>
              <p><strong>Kết quả:</strong> {selectedAttempt.score} / {selectedAttempt.totalQuestions}</p>
              
              <h4>Chi tiết câu trả lời (Giả lập):</h4>
              <table style={detailsTableStyle}>
                <thead>
                  <tr>
                    <th>Câu hỏi</th>
                    <th>Bạn chọn</th>
                    <th>Đáp án đúng</th>
                    <th>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedAttempt.details || []).map((detail, i) => (
                    <tr key={i} style={{background: detail.yourAnswer !== detail.correctAnswer ? '#ffebee' : '#f1f8e9'}}>
                      <td>{detail.question}</td>
                      <td>{detail.yourAnswer}</td>
                      <td>{detail.correctAnswer}</td>
                      <td>{detail.yourAnswer === detail.correctAnswer ? '✅' : '❌'}</td>
                    </tr>
                  ))}
                  {/* Nếu không có data chi tiết */}
                  {(!selectedAttempt.details || selectedAttempt.details.length === 0) && (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>Không có dữ liệu chi tiết (mock)</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={modalFooterStyle}>
              <button style={btnGray} onClick={() => setSelectedAttempt(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


const sectionStyle = {
  flex: 1,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  padding: 20,
  alignSelf: 'flex-start',
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};
const statBoxStyle = {
  background: '#fafafa',
  border: '1px solid #efebe9',
  borderRadius: '8px',
  padding: '10px 15px',
  marginBottom: '10px',
};
const statNumberStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#4e342e',
  margin: '5px 0 0 0',
};
const btnBrown = {
  padding: "10px 15px", 
  background: "#6d4c41",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: '14px',
};
const btnGray = {
  ...btnBrown,
  background: "#757575",
  marginRight: '10px'
};
const btnViewStyle = {
  background: "#546e7a",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  padding: '5px 8px',
  borderRadius: '4px',
};
const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  gap: '10px',
};
const searchInputStyle = {
  flex: 1,
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};
const filterSelectStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  background: 'white',
};
const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
};
const pageBtnStyle = {
  padding: '8px 12px',
  background: '#6d4c41',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '0 5px',
};
pageBtnStyle[':disabled'] = { background: '#9e9e9e', cursor: 'not-allowed' };










const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const modalContentStyle = {
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
};
const modalHeaderStyle = {
  padding: '15px 20px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const modalBodyStyle = {
  padding: '20px',
  overflowY: 'auto', 
};
const modalFooterStyle = {
  padding: '15px 20px',
  borderTop: '1px solid #eee',
  textAlign: 'right',
};
const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};
const detailsTableStyle = {
  ...tableStyle,
  fontSize: '13px',
};
detailsTableStyle['th'] = {
  background: '#f9f9f9',
  padding: '8px',
  textAlign: 'left'
};
detailsTableStyle['td'] = {
  padding: '8px',
  borderBottom: '1px solid #eee'
};