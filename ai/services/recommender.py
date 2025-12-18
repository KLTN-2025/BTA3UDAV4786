from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd

class RecommenderSystem:
    def __init__(self):
        self.df = None
        self.cosine_sim = None
        self.indices = None

    def fit(self, raw_data):
        if not raw_data:
            return

        # Chuyển list dict thành Pandas DataFrame để dễ xử lý
        self.df = pd.DataFrame(raw_data)
        
        self.df['features'] = self.df['tags'].apply(lambda x: " ".join(x) if isinstance(x, list) else "") 
        self.df['features'] = self.df['features'] + " " + self.df['description'].fillna("")

        #ma trận TF-IDF
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.df['features'])

        # ma trận tương đồng
        self.cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        # Tạo mapping từ ID -> Index để tra cứu nhanh
        self.df['_id'] = self.df['_id'].astype(str) # Ép kiểu ID thành string
        self.indices = pd.Series(self.df.index, index=self.df['_id']).drop_duplicates()
        
        print("Đã huấn luyện hệ thống gợi ý.")

    def get_recommendations(self, artifact_id, top_k=3):
        if self.cosine_sim is None or str(artifact_id) not in self.indices:
            return []
        idx = self.indices[str(artifact_id)]

        sim_scores = list(enumerate(self.cosine_sim[idx]))

        # Sắp xếp giảm dần theo điểm
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Lấy top k (bỏ qua phần tử đầu tiên là chính nó)
        sim_scores = sim_scores[1:top_k+1]

        # Lấy thông tin artifact
        artifact_indices = [i[0] for i in sim_scores]
        
        return self.df.iloc[artifact_indices][['_id', 'name', 'imageUrl']].to_dict('records')