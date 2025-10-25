import React, { useState } from "react";

const museumsData = [
  {
    id: 1,
    name: "Bảo tàng Lịch sử Quốc gia",
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1581091012184-7c3e5e29d4e6",
    description: `Bảo tàng Lịch sử Quốc gia là một hành trình ngược dòng thời gian đưa bạn trở về
    với những thời khắc khai sinh của dân tộc Việt Nam. Tại đây, từng cổ vật, từng mảnh gốm vỡ, 
    từng thanh kiếm cổ đều mang trong mình câu chuyện hàng nghìn năm lịch sử. Những triều đại đã 
    qua không chỉ hiện hữu qua sách vở mà còn sống động qua từng hiện vật được trưng bày trong 
    không gian cổ kính. Đây không chỉ là nơi lưu giữ quá khứ mà còn là ngọn đèn soi sáng tương lai.`,
  },
  {
    id: 2,
    name: "Bảo tàng Chứng tích Chiến tranh",
    location: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1563720222848-ef4976e83f62",
    description: `Một không gian trầm mặc và đầy xúc cảm, nơi mỗi bức ảnh, mỗi trang tài liệu 
    là một lời kể chân thực về những năm tháng chiến tranh khốc liệt. Bảo tàng Chứng tích Chiến tranh 
    không chỉ tái hiện lại quá khứ đau thương mà còn gửi gắm một thông điệp sâu sắc về giá trị của hòa bình. 
    Ánh sáng mờ len lỏi qua những khung cửa cổ, soi rọi lên từng hiện vật như lời nhắc nhở về sự hy sinh 
    và lòng kiên cường của con người Việt Nam.`,
  },
  {
    id: 3,
    name: "Bảo tàng Mỹ thuật Đà Nẵng",
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1549887534-3db1bd59dcca",
    description: `Nơi hội tụ của những tinh hoa nghệ thuật Việt Nam, từ những bức tranh sơn dầu cổ điển 
    cho đến các tác phẩm điêu khắc hiện đại đầy sáng tạo. Không gian nơi đây như một bản giao hưởng 
    giữa ánh sáng và bóng tối, giữa quá khứ và hiện tại, đưa người xem vào hành trình khám phá tâm hồn 
    Việt qua từng nét cọ, từng đường chạm khắc. Đây không chỉ là nơi trưng bày mà còn là nơi nuôi dưỡng 
    cảm hứng sáng tạo và tôn vinh nghệ thuật.`,
  },
  {
    id: 4,
    name: "Bảo tàng Dân tộc học Việt Nam",
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135",
    description: `Một bức tranh sống động về đời sống văn hóa của 54 dân tộc anh em. 
    Từng bộ trang phục, từng căn nhà sàn, từng nhạc cụ đều là minh chứng cho sự phong phú và đa dạng 
    của nền văn hóa Việt Nam. Dạo bước trong không gian trưng bày, bạn sẽ cảm nhận được nhịp sống, 
    tín ngưỡng và tâm hồn của mỗi cộng đồng, như thể đang lạc bước vào những miền đất xa xưa, nơi văn hóa 
    và con người hòa quyện vào nhau.`,
  },
];

export default function Explore() {
  const [search, setSearch] = useState("");

  const filteredMuseums = museumsData.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white font-serif relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601297183309-23be8e6e5a04')] bg-cover bg-center opacity-30 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/95 via-[#0b0f1a]/90 to-[#0b0f1a]/95"></div>

      {/* Banner */}
      <section className="relative h-[500px] flex flex-col items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1596210395254-2873a42f9b75')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#0b0f1a]/70"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-6xl font-extrabold text-[#f5e6c8] drop-shadow-[0_0_15px_rgba(245,230,200,0.6)]">
            🏛 Khám Phá Bảo Tàng
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto text-[#d1c7af] italic">
            “Hãy để hơi thở của quá khứ dẫn lối bạn qua những bức tường cổ kính, nơi từng món hiện vật kể lại câu chuyện của thời gian.”
          </p>
        </div>
      </section>

      {/* Mô tả tổng quan */}
      <section className="relative max-w-4xl mx-auto text-center mt-20 px-6">
        <h2 className="text-4xl font-bold text-[#f5e6c8] mb-6">✨ Hành trình về miền ký ức</h2>
        <p className="text-[#d1c7af] text-lg leading-relaxed">
          Khám phá những bảo tàng cổ kính – nơi lưu giữ linh hồn của quá khứ.  
          Mỗi bước chân tại đây không chỉ đưa bạn đến gần hơn với lịch sử, mà còn giúp bạn cảm nhận sâu sắc những giá trị trường tồn của văn hóa dân tộc.  
          Hãy chuẩn bị để đắm mình trong bầu không khí mờ ảo, nơi thời gian như ngừng trôi và những câu chuyện ngàn năm được kể lại qua từng hiện vật.
        </p>
      </section>

      {/* Thanh tìm kiếm */}
      <section className="relative max-w-2xl mx-auto mt-12 px-6">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm bảo tàng theo tên hoặc địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 px-5 rounded-lg bg-[#1a1f2d]/70 border border-[#c4b998]/30 placeholder-[#c0b69a] text-[#f5e6c8] focus:outline-none focus:ring-2 focus:ring-[#d4b76a] shadow-[0_0_15px_rgba(212,183,106,0.2)]"
        />
      </section>

      {/* Danh sách bảo tàng dạng dọc toàn màn hình */}
      <section className="relative max-w-6xl mx-auto mt-20 space-y-32 px-6 pb-32">
        {filteredMuseums.map((museum, index) => (
          <div
            key={museum.id}
            className={`flex flex-col md:flex-row items-center bg-[#1a1f2d]/80 border border-[#c4b998]/30 rounded-3xl shadow-[0_0_40px_rgba(196,185,152,0.2)] overflow-hidden backdrop-blur-md transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,183,106,0.4)] hover:-translate-y-3 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Ảnh lớn */}
            <div className="md:w-1/2 h-[500px] relative overflow-hidden">
              <img
                src={museum.image}
                alt={museum.name}
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-[2000ms] brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/90 via-transparent to-transparent"></div>
              <div className="absolute top-5 left-5 bg-[#d4b76a]/90 text-[#1a1f2d] text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                {museum.location}
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="md:w-1/2 p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-4xl font-bold text-[#f5e6c8] mb-4">{museum.name}</h3>
                <p className="text-[#d1c7af] text-lg leading-relaxed whitespace-pre-line">
                  {museum.description}
                </p>
              </div>
              <div className="mt-8">
                <button className="py-3 px-8 bg-[#d4b76a]/90 text-[#1a1f2d] font-bold text-lg rounded-lg hover:bg-[#e6cb8e] transition transform hover:scale-105 shadow-[0_0_20px_rgba(212,183,106,0.3)]">
                  🔎 Khám phá chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer cổ kính */}
      <footer className="relative text-center py-10 text-[#c0b69a] border-t border-[#c4b998]/30 mt-20">
        <p className="text-sm">© 2025 Khám Phá Bảo Tàng – Một hành trình ngược dòng thời gian</p>
        <p className="text-xs mt-2 italic">
          “Lịch sử không nằm trong sách vở – nó sống trong từng bức tường cổ kính này.”
        </p>
      </footer>

      {/* Hiệu ứng sương khói */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#f5e6c8]/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[#d4b76a]/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 animate-pulse"></div>
    </div>
  );
}
