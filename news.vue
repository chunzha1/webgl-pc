<template>
  <div class="news-reader">
    <h1>今日新闻</h1>
    <div class="news-grid">
      <div v-for="(article, index) in articles" :key="index" class="news-card" :class="{ 'expanded': article.expanded }">
        <div class="card-content">
          <h2>{{ article.title }}</h2>
          <p class="preview">{{ article.preview }}</p>
          <div v-if="article.expanded" class="full-content">
            <p>{{ article.fullContent }}</p>
          </div>
        </div>
        <div class="card-actions">
          <button @click="toggleExpand(index)" class="action-btn expand">
            {{ article.expanded ? '收起' : '展开' }}
          </button>
          <button @click="toggleFavorite(index)" class="action-btn favorite" :class="{ 'active': article.favorite }">
            {{ article.favorite ? '已收藏' : '收藏' }}
          </button>
          <button @click="shareArticle(article)" class="action-btn share">
            分享
          </button>
          <button @click="markAsRead(index)" class="action-btn delete">
            标记已读
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'NewsReader',
  setup() {
    const articles = ref([
      {
        title: "科技创新推动经济发展",
        preview: "最新研究显示，科技创新对经济增长的贡献率持续上升...",
        fullContent: "最新研究显示，科技创新对经济增长的贡献率持续上升。专家指出，人工智能、5G通信、量子计算等前沿技术的突破和应用，正在重塑全球经济格局。各国政府和企业纷纷加大研发投入，以期在新一轮科技革命中占据先机。",
        expanded: false,
        favorite: false
      },
      {
        title: "全球气候变化引发关注",
        preview: "联合国最新报告指出，全球平均气温继续上升，极端天气事件频发...",
        fullContent: "联合国最新报告指出，全球平均气温继续上升，极端天气事件频发。报告呼吁各国采取更加积极的减排措施，并加强气候适应能力建设。同时，可再生能源技术的快速发展为应对气候变化带来新的希望。",
        expanded: false,
        favorite: false
      },
      {
        title: "数字化转型助力企业创新",
        preview: "越来越多的传统企业开始拥抱数字化转型，以应对市场变化...",
        fullContent: "越来越多的传统企业开始拥抱数字化转型，以应对市场变化。从制造业到服务业，数字技术正在重塑业务流程和商业模式。专家表示，成功的数字化转型不仅需要技术升级，还需要组织文化和管理方式的相应变革。",
        expanded: false,
        favorite: false
      },
      {
        title: "健康生活方式成为新趋势",
        preview: "随着人们对生活质量的追求提高，健康生活方式日益受到重视...",
        fullContent: "随着人们对生活质量的追求提高，健康生活方式日益受到重视。越来越多的人开始关注饮食均衡、规律运动和心理健康。与此同时，健康科技产品和服务市场也迎来了快速增长，从智能穿戴设备到个性化营养方案，为人们的健康管理提供了新的选择。",
        expanded: false,
        favorite: false
      },
      {
        title: "远程办公改变工作模式",
        preview: "新冠疫情加速了远程办公的普及，越来越多的公司开始重新思考工作方式...",
        fullContent: "新冠疫情加速了远程办公的普及，越来越多的公司开始重新思考工作方式。灵活的工作安排不仅提高了员工满意度，也为企业带来了成本节约和人才吸引等优势。然而，如何在远程环境下保持团队协作和公司文化，成为管理者面临的新挑战。",
        expanded: false,
        favorite: false
      },
      {
        title: "教育创新助力终身学习",
        preview: "在知识经济时代，终身学习成为必要。教育行业正在经历深刻变革...",
        fullContent: "在知识经济时代，终身学习成为必要。教育行业正在经历深刻变革，在线教育平台、微课程、个性化学习等新模式不断涌现。专家指出，未来的教育将更加注重培养学习者的创新能力和适应能力，以应对快速变化的社会需求。",
        expanded: false,
        favorite: false
      }
    ]);

    const toggleExpand = (index) => {
      articles.value[index].expanded = !articles.value[index].expanded;
    };

    const toggleFavorite = (index) => {
      articles.value[index].favorite = !articles.value[index].favorite;
    };

    const shareArticle = (article) => {
      // 实现分享功能，这里只是一个示例
      alert(`分享文章: ${article.title}`);
    };

    const markAsRead = (index) => {
      articles.value.splice(index, 1);
    };

    return {
      articles,
      toggleExpand,
      toggleFavorite,
      shareArticle,
      markAsRead
    };
  }
};
</script>

<style scoped>
.news-reader {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.news-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 20px;
}

h2 {
  color: #34495e;
  margin-top: 0;
  font-size: 1.2em;
}

.preview {
  color: #7f8c8d;
  font-size: 0.9em;
  line-height: 1.6;
}

.full-content {
  margin-top: 15px;
  color: #2c3e50;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #f8f9fa;
}

.action-btn {
  background-color: transparent;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 10px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #2980b9;
}

.action-btn.favorite.active {
  color: #e74c3c;
}

.action-btn.delete {
  color: #95a5a6;
}

.action-btn.delete:hover {
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
