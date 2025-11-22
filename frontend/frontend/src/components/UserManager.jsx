import { useState, useEffect } from 'react';


const mockUsers = [
  { id: "user-1", username: "An Nguyễn", email: "an.nguyen@google.com", role: "admin", createdAt: "2025-10-20T10:00:00Z" },
  { id: "user-2", username: "Bình Lê", email: "binh.le@google.com", role: "user", createdAt: "2025-10-21T11:30:00Z" },
  { id: "user-3", username: "Cường Trần", email: "cuong.tran@google.com", role: "user", createdAt: "2025-10-22T14:15:00Z" },
  { id: "user-4", username: "Dũng Phạm", email: "dung.pham@google.com", role: "user", createdAt: "2025-10-22T15:00:00Z" },
  { id: "user-5", username: "Giang Hồ", email: "giang.ho@google.com", role: "user", createdAt: "2025-10-23T09:00:00Z" },
  { id: "user-6", username: "Hương Vũ", email: "huong.vu@google.com", role: "user", createdAt: "2025-10-23T10:00:00Z" },
  { id: "user-7", username: "Khánh Đặng", email: "khanh.dang@google.com", role: "user", createdAt: "2025-10-24T11:00:00Z" },
  { id: "user-8", username: "Linh Bùi", email: "linh.bui@google.com", role: "admin", createdAt: "2025-10-24T12:00:00Z" },
  { id: "user-9", username: "Minh Nguyễn", email: "minh.nguyen@google.com", role: "user", createdAt: "2025-10-25T13:00:00Z" },
  { id: "user-10", username: "Nam Trần", email: "nam.tran@google.com", role: "user", createdAt: "2025-10-25T14:00:00Z" },
  { id: "user-11", username: "Oanh Lê", email: "oanh.le@google.com", role: "user", createdAt: "2025-10-26T15:00:00Z" },
  { id: "user-12", username: "Phúc Hoàng", email: "phuc.hoang@google.com", role: "user", createdAt: "2025-10-26T16:00:00Z" },
  { id: "user-13", username: "Quân Võ", email: "quan.vo@google.com", role: "user", createdAt: "2025-10-27T17:00:00Z" },
  { id: "user-14", username: "Sơn Phan", email: "son.phan@google.com", role: "user", createdAt: "2025-10-28T18:00:00Z" },
  { id: "user-15", username: "Tâm Đỗ", email: "tam.do@google.com", role: "user", createdAt: "2025-10-28T19:00:00Z" },
];

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ id: '', username: '', email: '', role: 'user' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);


  const [selectedUsers, setSelectedUsers] = useState(new Set());

  useEffect(() => {
    setUsers(mockUsers);
  }, []);


  useEffect(() => {
    setSelectedUsers(new Set()); 
  }, [currentPage, searchTerm]);


  const handleEditClick = (user) => setEditingUser(user);
  const handleCancelEdit = () => setEditingUser(null);
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => (u.id === editingUser.id ? { ...u, role: formData.role } : u)));
    alert(" Đã cập nhật vai trò (giả lập)!");
    handleCancelEdit();
  };
  
 
  const handleDeleteUser = (userId) => {
    if (editingUser?.id === userId) return alert("Vui lòng Hủy bỏ sửa trước khi xóa.");
    
   
    if (!window.confirm("Bạn có muốn 'Xóa Mềm' người dùng này? (Giả lập)\n(Họ sẽ bị ẩn đi nhưng vẫn còn trong CSDL)")) return;
    
    setUsers((current) => current.filter((user) => user.id !== userId));
    setSelectedUsers(prev => { 
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };


  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handlePrevPage = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const handleNextPage = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));


  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      const next = new Set(prev); 
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSelectAllOnPage = () => {
    const allOnPage = paginatedUsers.every(u => selectedUsers.has(u.id));
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (allOnPage) {
        // Nếu tất cả đã chọn -> Bỏ chọn
        paginatedUsers.forEach(u => next.delete(u.id));
      } else {
        // Nếu chưa -> Chọn tất cả
        paginatedUsers.forEach(u => next.add(u.id));
      }
      return next;
    });
  };

  const handleBulkEmail = () => {
    const selectedCount = selectedUsers.size;
    if (selectedCount === 0) return;
    
    if (window.confirm(`Giả lập gửi email hàng loạt cho ${selectedCount} người dùng đã chọn?`)) {
      alert("✅ Đã gửi (giả lập)!");
      setSelectedUsers(new Set()); 
    }
  };
  

  const isAllOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.has(u.id));

  return (
    <main style={{ padding: "20px" }}>
      <section style={{...sectionStyle, flex: 1, maxWidth: '1000px', margin: '0 auto'}}>
        
        {editingUser && (
          <div style={editFormContainerStyle}>
          
            <h3>✏️ Chỉnh sửa vai trò cho: {editingUser.username}</h3>
            <form onSubmit={handleUpdateUser}>
              <div style={formGroupStyle}><label>Email</label><input type="email" value={formData.email} style={inputStyle} disabled /></div>
              <div style={formGroupStyle}>
                <label>Vai trò (Role)</label>
                <select name="role" value={formData.role} onChange={handleFormChange} style={inputStyle}>
                  <option value="user">User</option><option value="admin">Admin</option>
                </select>
              </div>
              <div><button type="submit" style={btnBrown}>Lưu thay đổi</button><button type="button" onClick={handleCancelEdit} style={btnGray}>Hủy bỏ</button></div>
            </form>
          </div>
        )}

       
        {selectedUsers.size > 0 && (
          <div style={bulkActionBarStyle}>
            <span>Đã chọn: <strong>{selectedUsers.size}</strong> người dùng</span>
            <button style={btnBrown} onClick={handleBulkEmail}>
              📧 Gửi Email Hàng Loạt
            </button>
          </div>
        )}

        <div style={toolbarStyle}>
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={searchInputStyle}
          />
          <div style={totalCountStyle}>
            Tổng: <strong>{filteredUsers.length}</strong> / {users.length} người dùng
          </div>
        </div>

        <h3>👥 Danh sách Người dùng</h3>
        <table style={{ ...tableStyle, fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#efebe9" }}>
             
              <th style={checkboxCellStyle}>
                <input 
                  type="checkbox" 
                  checked={isAllOnPageSelected}
                  onChange={handleSelectAllOnPage}
                />
              </th>
              <th>Username</th>
              <th>Email</th>
              <th>Vai trò (Role)</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} style={{background: selectedUsers.has(user.id) ? '#fff8e1' : 'transparent'}}>
              
                <td style={checkboxCellStyle}>
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td style={{fontWeight: user.role === 'admin' ? 'bold' : 'normal'}}>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: "center", display: 'flex', justifyContent: 'center', gap: '5px' }}>
                  <button onClick={() => handleEditClick(user)} style={btnEditStyle} disabled={!!editingUser}>
                    ✏️ Sửa
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} style={deleteBtnStyle} disabled={!!editingUser}>
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                Không tìm thấy người dùng nào.
              </td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={paginationStyle}>
          
            <button style={pageBtnStyle} onClick={handlePrevPage} disabled={currentPage === 1}>&laquo; Trang trước</button>
            <span style={{padding: '0 15px', color: '#333'}}>Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong></span>
            <button style={pageBtnStyle} onClick={handleNextPage} disabled={currentPage === totalPages}>Trang sau &raquo;</button>
          </div>
        )}

      </section>
    </main>
  );
}


const sectionStyle = { flex: 1, background: "#fff", borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", padding: 20, alignSelf: 'flex-start' };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const deleteBtnStyle = { background: "#c62828", color: "white", border: "none", cursor: "pointer", fontSize: "14px", padding: '6px 10px', borderRadius: '4px' };
const btnEditStyle = { background: "#0277bd", color: "white", border: "none", cursor: "pointer", fontSize: "14px", padding: '6px 10px', borderRadius: '4px' };
const btnBrown = { padding: "8px 12px", background: "#6d4c41", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: '14px', marginRight: '10px' };
const btnGray = { ...btnBrown, background: "#757575" };
const editFormContainerStyle = { background: '#fafafa', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' };
const formGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' };
const toolbarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '20px' };
const searchInputStyle = { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' };
const totalCountStyle = { fontSize: '14px', color: '#333', whiteSpace: 'nowrap' };
const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' };
const pageBtnStyle = { padding: '8px 12px', background: '#6d4c41', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', margin: '0 5px' };


const bulkActionBarStyle = {
  background: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: '8px',
  padding: '15px 20px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#6d4c41',
  fontWeight: 'bold',
};
const checkboxCellStyle = {
  width: '30px',
  textAlign: 'center',
  padding: '0 10px'
};


btnEditStyle[':disabled'] = { background: '#9e9e9e', cursor: 'not-allowed' };
deleteBtnStyle[':disabled'] = { background: '#9e9e9e', cursor: 'not-allowed' };
pageBtnStyle[':disabled'] = { background: '#9e9e9e', cursor: 'not-allowed' };