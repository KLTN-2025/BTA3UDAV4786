import { useState, useEffect } from 'react';
import { QuizAPI } from '../api/quizApi';

export default function Leaderboard() {
  const [allAttempts, setAllAttempts] = useState([]);
  const [loading, setLoading] = useState(false); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [attemptsPerPage] = useState(5); 

  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await QuizAPI.getLeaderboard();
        // Backend trả về đã sort sẵn, nhưng ta set vào state để render
        setAllAttempts(data);
      } catch (error) {
        console.error("Lỗi tải BXH:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredAttempts = allAttempts
    .filter(attempt => {
      if (filterScore === 'pass') return (attempt.score / attempt.totalQuestions) >= 0.8;
      if (filterScore === 'fail') return (attempt.score / attempt.totalQuestions) < 0.8;
      return true; 
    })
    .filter(attempt => {
      const username = attempt.user?.username || "";
      return username.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
  // Phân trang
  const totalPages = Math.ceil(filteredAttempts.length / attemptsPerPage);
  const paginatedAttempts = filteredAttempts.slice(
    (currentPage - 1) * attemptsPerPage,
    currentPage * attemptsPerPage
  );

  // Thống kê
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
    alert(`Tính năng xuất báo cáo chưa kết nối backend!`);
  };

  const handlePrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const handleNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <main style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <section style={{...sectionStyle, flex: 2}}>
        <h3>🏆 Bảng Xếp Hạng (Top 10)</h3>

         <div style={toolbarStyle}>
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
            <option value="fail">Chỉ bài trượt (&lt; 80%)</option>
          </select>
        </div>

        {loading && <p style={{textAlign: 'center', color: '#666'}}>⏳ Đang tải dữ liệu...</p>}

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
                <tr key={attempt.id || index}> 
                  <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
                
                        
                        {attempt.user?.username || '(Ẩn danh)'}
                    </div>
                  </td>
                  <td style={{textAlign: 'center', fontWeight: 'bold', color: '#d84315'}}>
                      {attempt.score} / {attempt.totalQuestions}
                  </td>
                  <td>{new Date(attempt.createdAt).toLocaleString('vi-VN')}</td>
                  <td style={{textAlign: 'center'}}>
                    <button 
                      style={btnViewStyle}
                      onClick={() => setSelectedAttempt(attempt)}
                    >
                      👁️ Xem
                    </button>
                  </td>
                </tr>
              )
            })}
             {!loading && filteredAttempts.length === 0 && (
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
          <h4>Số người hiển thị</h4>
          <p style={statNumberStyle}>{totalFilteredAttempts}</p>
          <small>(Tổng Top Server: {allAttempts.length})</small>
        </div>
        <div style={statBoxStyle}>
          <h4>Điểm trung bình</h4>
          <p style={statNumberStyle}>{averageScore}</p>
        </div>
        <div style={statBoxStyle}>
          <h4>Điểm cao nhất</h4>
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
              <p><strong>Người chơi:</strong> {selectedAttempt.user?.username}</p>
              <p><strong>Ngày làm:</strong> {new Date(selectedAttempt.createdAt).toLocaleString('vi-VN')}</p>
              <p><strong>Kết quả:</strong> {selectedAttempt.score} / {selectedAttempt.totalQuestions}</p>
              
              <hr style={{margin: '15px 0', borderTop: '1px solid #eee'}} />
              
              <div style={{background: '#fff3e0', padding: '10px', borderRadius: '4px', fontSize: '13px', color: '#e65100'}}>
                 ⚠️ <strong>Lưu ý:</strong> Hệ thống hiện tại chỉ lưu điểm số cuối cùng, chưa hỗ trợ lưu lại lịch sử chọn đáp án chi tiết của từng câu hỏi trong quá khứ.
              </div>

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

const sectionStyle = { flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: 20, alignSelf: 'flex-start' };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const statBoxStyle = { background: '#fafafa', border: '1px solid #efebe9', borderRadius: '8px', padding: '10px 15px', marginBottom: '10px' };
const statNumberStyle = { fontSize: '24px', fontWeight: 'bold', color: '#4e342e', margin: '5px 0 0 0' };
const btnBrown = { padding: "10px 15px", background: "#6d4c41", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: '14px' };
const btnGray = { ...btnBrown, background: "#757575", marginRight: '10px' };
const btnViewStyle = { background: "#546e7a", color: "white", border: "none", cursor: "pointer", fontSize: "13px", padding: '5px 8px', borderRadius: '4px' };
const toolbarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px' };
const searchInputStyle = { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' };
const filterSelectStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', background: 'white' };
const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' };
const pageBtnStyle = { padding: '8px 12px', background: '#6d4c41', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', margin: '0 5px' };
pageBtnStyle[':disabled'] = { background: '#9e9e9e', cursor: 'not-allowed' };
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle = { background: '#fff', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' };
const modalHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const modalBodyStyle = { padding: '20px', overflowY: 'auto' };
const modalFooterStyle = { padding: '15px 20px', borderTop: '1px solid #eee', textAlign: 'right' };
const closeBtnStyle = { background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' };