// 管理后台业务逻辑（精准对齐截图1与新增服务跟踪栏目）
window.AdminModule = {
  // 当前后台活动Tab（用于方案二的多Tab切换）
  currentAdminTab: 'list', // 'list' | 'templates' | 'bindings' | 'statistics'

  // 当前表格筛选条件
  filters: {
    dateQuick: 'custom',
    bizType: 'all',
    keyword: '',
    statusTab: 'all'
  },

  // 方案二统计看板当前选中模版
  currentStatsTplId: 'TPL-HK-001',

  init() {
    this.renderHeaderAndTabs();
    this.renderActiveTabContent();
  },

  // 切换方案一/方案二时刷新后台结构
  refreshForScheme() {
    this.currentAdminTab = 'list';
    this.renderHeaderAndTabs();
    this.renderActiveTabContent();
  },

  // 渲染顶部面包屑与Tab栏
  renderHeaderAndTabs() {
    const tabsContainer = document.getElementById('admin-tabs-container');
    if (!tabsContainer) return;

    // 面包屑联动
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) {
      if (this.currentAdminTab === 'list') {
        breadcrumbCurrent.innerText = '服务跟踪';
      } else if (this.currentAdminTab === 'templates') {
        breadcrumbCurrent.innerText = '问卷模版';
      } else if (this.currentAdminTab === 'bindings') {
        breadcrumbCurrent.innerText = '业务模版绑定';
      } else if (this.currentAdminTab === 'statistics') {
        breadcrumbCurrent.innerText = '问卷模版 / 模版数据统计';
      } else if (this.currentAdminTab === 'editor') {
        const isEdit = this.editingTemplate && this.editingTemplate.id;
        breadcrumbCurrent.innerText = `问卷模版 / ${isEdit ? '编辑问卷' : '新建问卷'}`;
      }
    }

    // 左侧二级菜单联动高亮（服务跟踪主入口保持激活）
    const menuTracking = document.getElementById('menu-sub-tracking');
    if (menuTracking) {
      menuTracking.classList.add('active');
    }

    if (APP_DATA.currentScheme === 'scheme1') {
      // 方案一：在服务跟踪平级增加一个问卷模版
      tabsContainer.innerHTML = `
        <div class="admin-tab ${this.currentAdminTab === 'list' ? 'active' : ''}" onclick="AdminModule.switchTab('list')">
          服务跟踪
        </div>
        <div class="admin-tab ${this.currentAdminTab === 'templates' ? 'active' : ''}" onclick="AdminModule.switchTab('templates')">
          问卷模版
        </div>
      `;
    } else {
      // 方案二：取消顶部反馈统计看板菜单，统计功能从模版卡片的数据统计按钮进入
      tabsContainer.innerHTML = `
        <div class="admin-tab ${this.currentAdminTab === 'list' ? 'active' : ''}" onclick="AdminModule.switchTab('list')">
          跟踪数据列表
        </div>
        <div class="admin-tab ${this.currentAdminTab === 'templates' || this.currentAdminTab === 'statistics' || this.currentAdminTab === 'editor' ? 'active' : ''}" onclick="AdminModule.switchTab('templates')">
          问卷模版管理
        </div>
        <div class="admin-tab ${this.currentAdminTab === 'bindings' ? 'active' : ''}" onclick="AdminModule.switchTab('bindings')">
          业务模版绑定
        </div>
      `;
    }
  },

  switchTab(tabKey) {
    this.currentAdminTab = tabKey;
    this.renderHeaderAndTabs();
    this.renderActiveTabContent();
  },

  // 渲染当前Tab主体内容
  renderActiveTabContent() {
    const container = document.getElementById('admin-tab-body');
    if (!container) return;

    if (this.currentAdminTab === 'list') {
      this.renderListTab(container);
    } else if (this.currentAdminTab === 'templates') {
      this.renderTemplatesTab(container);
    } else if (this.currentAdminTab === 'bindings') {
      this.renderBindingsTab(container);
    } else if (this.currentAdminTab === 'statistics') {
      this.renderStatisticsTab(container);
    } else if (this.currentAdminTab === 'editor') {
      this.renderTemplateEditor(container);
    }
  },

  // ================= 模块 1: 服务跟踪列表（方案一 & 方案二共用） =================
  renderListTab(container) {
    container.innerHTML = `
      <div class="admin-content-card">
        <!-- 顶部工具与筛选栏（对齐截图1） -->
        <div class="admin-filter-bar">
          <div class="filter-left-actions">
            <button class="admin-btn" onclick="AdminModule.exportData()">
              <span>📥</span> 导出
            </button>
          </div>

          <div class="filter-right-inputs">
            <!-- 快捷日期选择 -->
            <div class="date-quick-pills">
              <div class="date-pill ${this.filters.dateQuick === 'today' ? 'active' : ''}" onclick="AdminModule.setDateQuick('today')">今日</div>
              <div class="date-pill ${this.filters.dateQuick === 'week' ? 'active' : ''}" onclick="AdminModule.setDateQuick('week')">本周</div>
              <div class="date-pill ${this.filters.dateQuick === 'month' ? 'active' : ''}" onclick="AdminModule.setDateQuick('month')">本月</div>
              <div class="date-pill ${this.filters.dateQuick === 'custom' ? 'active' : ''}" onclick="AdminModule.setDateQuick('custom')">自定义</div>
            </div>

            <!-- 日期范围选择器 -->
            <div class="date-range-box">
              <input type="text" value="2026-01-01" placeholder="开始日期" />
              <span>至</span>
              <input type="text" value="2026-09-22" placeholder="结束日期" />
              <span style="color: #c0c4cc;">📅</span>
            </div>

            <!-- 业务类型下拉 -->
            <select class="admin-select" id="filter-biz" onchange="AdminModule.onFilterChange()">
              <option value="all">业务类型: 全部</option>
              <option value="集体户籍首页借用">集体户籍首页借用</option>
              <option value="办公用品">办公用品</option>
            </select>


            <!-- 搜索框与按钮（对齐截图1） -->
            <input type="text" class="admin-input" id="filter-kw" placeholder="输入反馈单号/姓名/手机号" style="width: 180px;" />
            <button class="admin-btn admin-btn-primary" onclick="AdminModule.search()">搜索</button>
            <button class="admin-btn" onclick="AdminModule.resetFilters()">重置</button>
          </div>
        </div>

        <!-- 状态标签页栏（全部、已反馈、未反馈） -->
        <div class="table-status-tabs">
          <div class="table-status-tab ${this.filters.statusTab === 'all' ? 'active' : ''}" onclick="AdminModule.setStatusTab('all')">全部</div>
          <div class="table-status-tab ${this.filters.statusTab === '已反馈' ? 'active' : ''}" onclick="AdminModule.setStatusTab('已反馈')">
            已反馈 <span class="badge-count" id="feedbacked-count" style="background:#52c41a;">4</span>
          </div>
          <div class="table-status-tab ${this.filters.statusTab === '未反馈' ? 'active' : ''}" onclick="AdminModule.setStatusTab('未反馈')">
            未反馈 <span class="badge-count" id="unfeedbacked-count">2</span>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 38px; text-align: center;"><input type="checkbox" /></th>
                <th>反馈单号</th>
                <th>关联业务</th>
                <th>关联订单号</th>
                <th>用户名称</th>
                <th>手机号</th>
                <th>状态</th>
                <th>提交时间</th>
                <th style="width: 120px;">操作</th>
              </tr>
            </thead>
            <tbody id="tracking-table-tbody">
              <!-- 动态插入行 -->
            </tbody>
          </table>
        </div>

        <!-- 底部分页（对齐截图1） -->
        <div class="table-pagination">
          <span id="page-total-text">共 6 条</span>
          <div class="page-btn">&lt;</div>
          <div class="page-btn active">1</div>
          <div class="page-btn">&gt;</div>
          <select class="admin-select" style="height: 28px; padding: 0 4px;">
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>
    `;

    this.renderTable();
  },

  // 渲染表格行
  renderTable() {
    const tbody = document.getElementById('tracking-table-tbody');
    if (!tbody) return;

    let records = APP_DATA.trackingRecords;

    // 过滤逻辑
    if (this.filters.bizType !== 'all') {
      records = records.filter(r => r.bizType === this.filters.bizType);
    }
    if (this.filters.statusTab !== 'all') {
      records = records.filter(r => r.status === this.filters.statusTab);
    }
    if (this.filters.keyword) {
      const kw = this.filters.keyword.toLowerCase();
      records = records.filter(r => 
        r.id.includes(kw) || 
        r.userName.toLowerCase().includes(kw) || 
        r.phone.includes(kw) ||
        r.orderId.toLowerCase().includes(kw)
      );
    }

    // 更新角标数
    const feedbackedCount = APP_DATA.trackingRecords.filter(r => r.status === '已反馈').length;
    const unfeedbackedCount = APP_DATA.trackingRecords.filter(r => r.status === '未反馈').length;
    const fbBadge = document.getElementById('feedbacked-count');
    const ufBadge = document.getElementById('unfeedbacked-count');
    if (fbBadge) fbBadge.innerText = feedbackedCount;
    if (ufBadge) ufBadge.innerText = unfeedbackedCount;

    const totalText = document.getElementById('page-total-text');
    if (totalText) totalText.innerText = `共 ${records.length} 条`;

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 36px; color: #909399;">
            暂无符合条件的服务跟踪记录
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => {
      const isHukou = r.bizType.includes('户籍');
      const bizTagClass = isHukou ? 'tag-biz-hukou' : 'tag-biz-supplies';

      const statusColor = r.status === '已反馈' ? '#52c41a' : '#faad14';

      return `
        <tr>
          <td style="text-align: center;"><input type="checkbox" /></td>
          <td style="font-family: monospace; color: #303133;">${r.id}</td>
          <td><span class="tag-biz ${bizTagClass}">${r.bizType}</span></td>
          <td style="font-family: monospace; color: #1890ff;">${r.orderId}</td>
          <td style="font-weight: 500;">${r.userName}</td>
          <td>${r.phone}</td>
          <td style="color: ${statusColor}; font-weight: 500;">${r.status}</td>
          <td style="color: #909399;">${r.submitTime}</td>
          <td>
            <a class="table-action-link" onclick="AdminModule.openDetailDrawer('${r.id}')">查看</a>
            <a class="table-action-link table-action-danger" onclick="AdminModule.deleteRecord('${r.id}')">删除</a>
          </td>
        </tr>
      `;
    }).join('');
  },

  setDateQuick(val) {
    this.filters.dateQuick = val;
    this.renderListTab(document.getElementById('admin-tab-body'));
  },

  setStatusTab(status) {
    this.filters.statusTab = status;
    this.renderTable();
    this.renderHeaderAndTabs();
  },

  onFilterChange() {
    const bizSelect = document.getElementById('filter-biz');
    if (bizSelect) this.filters.bizType = bizSelect.value;
    this.renderTable();
  },

  search() {
    const kwInput = document.getElementById('filter-kw');
    if (kwInput) this.filters.keyword = kwInput.value.trim();
    this.onFilterChange();
    this.renderTable();
  },

  resetFilters() {
    this.filters = {
      dateQuick: 'custom',
      bizType: 'all',
      keyword: '',
      statusTab: 'all'
    };
    this.renderListTab(document.getElementById('admin-tab-body'));
  },

  exportData() {
    AppModule.showToast('已导出符合筛选条件的服务跟踪数据报表 (.xlsx)', 'success');
  },



  deleteRecord(recordId) {
    if (confirm('确认删除此条服务跟踪记录吗？')) {
      APP_DATA.trackingRecords = APP_DATA.trackingRecords.filter(r => r.id !== recordId);
      AppModule.showToast('删除成功', 'success');
      this.renderTable();
    }
  },

  // 打开服务跟踪详情抽屉
  openDetailDrawer(recordId) {
    const record = APP_DATA.trackingRecords.find(r => r.id === recordId);
    if (!record) return;

    const drawerMask = document.getElementById('admin-drawer-container');
    if (!drawerMask) return;

    const isHukou = record.bizType.includes('户籍');
    const bizKey = isHukou ? 'hukou' : 'supplies';
    const questions = APP_DATA.scheme1Questions[bizKey] || [];

    // 格式化题目与回答
    let answersHtml = '';
    questions.forEach((q, idx) => {
      let rawAns = record.answers[q.id] || '无填报内容';
      if (Array.isArray(rawAns)) {
        rawAns = rawAns.join('； ');
      }

      let tagClass = 'tag-type-choice';
      if (q.type === 'fill') tagClass = 'tag-type-fill';
      if (q.type === 'essay') tagClass = 'tag-type-essay';

      answersHtml += `
        <div class="qa-card">
          <div class="qa-header">
            <span class="qa-type-tag ${tagClass}">${q.typeName}</span>
            <div class="qa-title">${idx + 1}. ${q.title}</div>
          </div>
          <div class="qa-answer">${rawAns}</div>
        </div>
      `;
    });

    drawerMask.innerHTML = `
      <div class="admin-drawer">
        <div class="drawer-header">
          <div class="drawer-title">
            <span>📋 服务跟踪反馈详情</span>
            <span class="tag-biz ${isHukou ? 'tag-biz-hukou' : 'tag-biz-supplies'}">${record.bizType}</span>
          </div>
          <button class="drawer-close" onclick="AdminModule.closeDrawer()">✕</button>
        </div>

        <div class="drawer-body">
          <!-- 基础信息模块 -->
          <div class="drawer-section">
            <div class="drawer-section-title">关联订单与用户基本信息</div>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">反馈单号:</span>
                <span class="detail-value">${record.id}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">关联订单:</span>
                <span class="detail-value" style="color: #1890ff;">${record.orderId}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">填报用户:</span>
                <span class="detail-value">${record.userName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">联系电话:</span>
                <span class="detail-value">${record.phone}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">提交时间:</span>
                <span class="detail-value">${record.submitTime}</span>
              </div>
            </div>
          </div>

          <!-- 问卷作答明细（填空、选择、问答三种题型全展示） -->
          <div class="drawer-section">
            <div class="drawer-section-title">
              <span>问卷填报明细（题型：填空 / 选择 / 问答）</span>
              <span style="font-size: 11px; font-weight: normal; color: #909399;">共 ${questions.length} 题</span>
            </div>
            ${answersHtml}
          </div>

        </div>
      </div>
    `;
    drawerMask.style.display = 'flex';
  },

  closeDrawer() {
    const drawerMask = document.getElementById('admin-drawer-container');
    if (drawerMask) drawerMask.style.display = 'none';
  },

  // ================= 模块 2: 问卷模版管理（方案一与方案二） =================
  renderTemplatesTab(container) {
    if (APP_DATA.currentScheme === 'scheme1') {
      this.renderScheme1TemplatesTab(container);
    } else {
      this.renderScheme2TemplatesTab(container);
    }
  },

  // 方案一：固定模版管理（无“设计题目”，增加“数据统计”，点击查看各题目反馈统计）
  renderScheme1TemplatesTab(container) {
    const templates = APP_DATA.scheme1Templates;
    const cardsHtml = templates.map(tpl => {
      const stats = APP_DATA.statistics.byTemplate[tpl.statsRefId] || { kpis: { totalFeedbacks: 0 } };
      return `
        <div class="template-card" style="border-top: 3px solid #1890ff;">
          <div class="template-header">
            <div>
              <div class="template-name" style="display: flex; align-items: center; gap: 8px;">
                <span>${tpl.name}</span>
              </div>
              <div style="font-size: 11px; color: #1890ff; font-weight: 500; margin-top: 3px;">
                模版性质: <span class="badge-fixed-tpl">固定标准模版</span>
              </div>
            </div>
            <span class="tag-biz tag-biz-supplies">启用中</span>
          </div>
          
          <div class="template-meta" style="margin-top: 6px;">
            <span>固定题目数: <strong>${tpl.questionCount} 题</strong></span>
            <span>题型构成: <strong>填空 / 选择 / 问答</strong></span>
          </div>

          <div class="template-questions-summary">
            <div style="font-weight: 600; margin-bottom: 4px; color: #303133;">适用业务场景:</div>
            <div>${tpl.description}</div>
            <div style="margin-top: 8px; font-weight: 600; color: #303133;">题目题型概览:</div>
            <div style="color: #606266; font-size: 11px; margin-top: 2px; line-height: 1.6;">
              ${tpl.questionsSummary}
            </div>
          </div>

          <div class="template-actions" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 12px; color: #909399;">
              累计反馈: <strong style="color: #1890ff;">${stats.kpis.totalFeedbacks}</strong> 份
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="admin-btn" onclick="AdminModule.previewScheme1Questions('${tpl.bizType}')">
                查看题目
              </button>
              <!-- 重点需求：方案一无设计题目，增加数据统计，点击查看各题目反馈统计 -->
              <button class="admin-btn admin-btn-primary btn-stat-highlight" onclick="AdminModule.openScheme1StatsModal('${tpl.statsRefId}')">
                📊 数据统计
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="admin-content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="font-size: 16px; font-weight: 600; color: #303133; display: flex; align-items: center; gap: 8px;">
              <span>问卷模版</span>
              <span style="font-size: 12px; font-weight: normal; color: #52c41a; background: #f6ffed; border: 1px solid #b7eb8f; padding: 2px 8px; border-radius: 4px;">方案一：固定标准模版</span>
            </div>
            <div style="font-size: 12px; color: #909399; margin-top: 4px;">
              方案一采用统一固定的标准服务跟踪问卷（题型涵盖单选、多选、填空、问答）。点击模版右侧【数据统计】按钮即可查看各题目反馈的统计数据。
            </div>
          </div>
        </div>

        <div class="template-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  // 方案一：打开模版各题目反馈统计数据弹窗
  openScheme1StatsModal(statsRefId) {
    const modalMask = document.getElementById('admin-stats-modal-container');
    if (!modalMask) return;

    const stats = APP_DATA.statistics.byTemplate[statsRefId];
    if (!stats) {
      AppModule.showToast('未找到该模版的统计信息', 'warning');
      return;
    }

    const otherStatsRefId = statsRefId === 'TPL-HK-001' ? 'TPL-SP-002' : 'TPL-HK-001';
    const otherTplName = statsRefId === 'TPL-HK-001' ? '办公用品领用服务跟踪模版' : '集体户籍首页借用服务跟踪模版';

    // 渲染各题目反馈统计条形图（已取消主观问答题，仅统计结构化选择题与填空题）
    const barColors = ['', 'fill-success', 'fill-cyan', 'fill-warning'];
    const validQuestions = (stats.questionStats || []).filter(q => !q.type.includes('问答'));
    const questionItemsHtml = validQuestions.map((q, qi) => {
      const fillClass = barColors[qi % barColors.length];
      let typeBadgeClass = 'stat-type-single';
      if (q.type.includes('多选')) typeBadgeClass = 'stat-type-multi';
      else if (q.type.includes('填空')) typeBadgeClass = 'stat-type-fill';

      return `
        <div class="chart-card" style="margin-bottom: 14px; border: 1px solid #eef1f6;">
          <div class="chart-card-title" style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px; font-weight: 600; color: #303133;">第 ${qi + 1} 题：${q.title}</span>
              <span class="stat-type-badge ${typeBadgeClass}">${q.type}</span>
            </div>
          </div>
          ${q.options.map(opt => `
            <div class="bar-chart-item" style="margin-bottom: 8px;">
              <div class="bar-info" style="font-size: 12px;">
                <span>${opt.label}</span>
                <span style="font-weight: 600; color: #303133;">${opt.percent}% (${opt.count} 人次)</span>
              </div>
              <div class="bar-progress-track" style="height: 7px;">
                <div class="bar-progress-fill ${fillClass}" style="width: ${opt.percent}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    modalMask.innerHTML = `
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <div class="admin-modal-title">
            <span>📊 各题目反馈统计数据 · ${stats.templateName}</span>
          </div>
          <button class="admin-modal-close" onclick="AdminModule.closeStatsModal()">✕</button>
        </div>

        <div class="admin-modal-body">
          <!-- 核心指标摘要条 -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f6f8fb; padding: 12px 18px; border-radius: 6px; margin-bottom: 18px; font-size: 13px;">
            <div>
              <span>模版性质: <strong>固定标准问卷</strong></span>
              <span style="margin: 0 12px; color: #dcdfe6;">|</span>
              <span>累计反馈数: <strong style="color: #1890ff; font-size: 16px;">${stats.kpis.totalFeedbacks}</strong> 份</span>
              <span style="margin: 0 12px; color: #dcdfe6;">|</span>
              <span>填报率: <strong style="color: #52c41a;">${stats.kpis.fillRate}</strong></span>
            </div>
            <div>
              <span style="color: #52c41a;">已反馈: <strong>${stats.kpis.feedbackedCount}</strong></span>
              <span style="margin: 0 8px; color: #dcdfe6;">/</span>
              <span style="color: #faad14;">未反馈: <strong>${stats.kpis.unfeedbackedCount}</strong></span>
            </div>
          </div>

          <!-- 各题目统计列表 -->
          <div style="margin-bottom: 12px; font-size: 14px; font-weight: 600; color: #1f2d3d;">
            📋 各题目反馈数据分布（涵盖选择题与填空题分布统计，已取消问答题）：
          </div>
          ${questionItemsHtml}
        </div>

        <div class="admin-modal-footer">
          <button class="admin-btn" onclick="AdminModule.openScheme1StatsModal('${otherStatsRefId}')">
            切换查看: ${otherTplName}
          </button>
          <button class="admin-btn" onclick="AdminModule.exportData()">
            📥 导出各题目统计数据
          </button>
          <button class="admin-btn admin-btn-primary" onclick="AdminModule.closeStatsModal()">
            关闭
          </button>
        </div>
      </div>
    `;

    modalMask.style.display = 'flex';
  },

  closeStatsModal() {
    const modalMask = document.getElementById('admin-stats-modal-container');
    if (modalMask) modalMask.style.display = 'none';
  },

  // 方案一：预览固定模版题目
  previewScheme1Questions(bizType) {
    const questions = APP_DATA.scheme1Questions[bizType];
    if (!questions) return;
    const title = bizType === 'hukou' ? '集体户籍首页借用服务跟踪固定题目' : '办公用品领用服务跟踪固定题目';

    const itemsHtml = questions.map((q, idx) => `
      <div style="background: #f8fafc; border: 1px solid #ebeef5; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <strong style="color: #303133; font-size: 13px;">第 ${idx + 1} 题：${q.title}</strong>
          <span class="qa-type-tag ${q.type.includes('choice') ? 'tag-type-choice' : q.type === 'fill' ? 'tag-type-fill' : 'tag-type-essay'}">${q.typeName}</span>
        </div>
        ${q.options ? `
          <div style="font-size: 12px; color: #606266; margin-top: 6px;">
            ${q.options.map(opt => `<div style="padding: 2px 0;">⚪ ${opt}</div>`).join('')}
          </div>
        ` : `
          <div style="font-size: 12px; color: #909399; margin-top: 4px; font-style: italic;">
            提示占位: ${q.placeholder || '用户根据实际情况作答'}
          </div>
        `}
      </div>
    `).join('');

    const modalMask = document.getElementById('admin-stats-modal-container');
    if (!modalMask) return;

    modalMask.innerHTML = `
      <div class="admin-modal" style="max-width: 680px;" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <div class="admin-modal-title">
            <span>👁️ 查看固定题目 · ${title}</span>
          </div>
          <button class="admin-modal-close" onclick="AdminModule.closeStatsModal()">✕</button>
        </div>
        <div class="admin-modal-body">
          <div style="font-size: 12px; color: #909399; margin-bottom: 12px;">
            方案一固定配置以下 ${questions.length} 道题目（涵盖填空、选择、问答），订单办结后小程序端自动推送：
          </div>
          ${itemsHtml}
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-primary" onclick="AdminModule.closeStatsModal()">关闭</button>
        </div>
      </div>
    `;
    modalMask.style.display = 'flex';
  },

  // 方案二：自定义模版管理
  renderScheme2TemplatesTab(container) {
    const templates = APP_DATA.scheme2Templates;
    const cardsHtml = templates.map(tpl => `
      <div class="template-card">
        <div class="template-header">
          <div>
            <div class="template-name">${tpl.name}</div>
            <div style="font-size: 11px; color: #1890ff; font-weight: 500; margin-top: 2px;">版本: ${tpl.version}</div>
          </div>
          <span class="tag-biz ${tpl.status === '启用' ? 'tag-biz-supplies' : ''}">${tpl.status}</span>
        </div>
        <div class="template-meta">
          <span>题目数: <strong>${tpl.questionCount} 题</strong></span>
          <span>创建时间: ${tpl.createTime}</span>
        </div>
        <div class="template-questions-summary">
          <div style="font-weight: 600; margin-bottom: 4px; color: #303133;">适用说明:</div>
          <div>${tpl.description}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #909399;">
            已绑定业务: <strong>${tpl.boundBiz.length > 0 ? tpl.boundBiz.join('、') : '暂未绑定'}</strong>
          </div>
        </div>
        <div class="template-actions">
          <button class="admin-btn" onclick="AdminModule.previewTemplate('${tpl.id}')">预览题目</button>
          <button class="admin-btn" onclick="AdminModule.editTemplate('${tpl.id}')">设计题目</button>
          <!-- 重点：方案二模版卡片增加数据统计按钮，点击后到达统计页 -->
          <button class="admin-btn admin-btn-primary btn-stat-highlight" onclick="AdminModule.goToTemplateStats('${tpl.id}')">
            📊 数据统计
          </button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="admin-content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="font-size: 16px; font-weight: 600; color: #303133;">问卷模版管理 (方案二)</div>
            <div style="font-size: 12px; color: #909399; margin-top: 4px;">
              支持根据不同业务需求，自由配置【填空题】、【选择题】、【问答题】并生成可复用模版，点击【数据统计】可直达该模版的题目统计页
            </div>
          </div>
          <button class="admin-btn admin-btn-primary" onclick="AdminModule.openCreateTemplatePage()">
            + 新建问卷模版
          </button>
        </div>

        <div class="template-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  // 方案二：点击模版卡片上的数据统计直达统计页
  goToTemplateStats(tplId) {
    this.currentStatsTplId = tplId;
    this.switchTab('statistics');
  },

  // 打开新建问卷页面
  openCreateTemplatePage() {
    this.editingTemplate = {
      id: '',
      name: '',
      version: 'V1.0',
      status: '启用',
      description: '',
      boundBiz: [],
      questions: [
        {
          id: 'q_' + Date.now(),
          type: 'choice_single',
          typeName: '选择题(单选)',
          title: '本次服务办理时效与工作人员态度满意度如何？',
          required: true,
          options: ['非常满意，热情高效', '满意，流程顺畅', '基本满意，耗时略长', '不满意，需改进']
        }
      ]
    };
    this.switchTab('editor');
  },

  // 打开编辑问卷页面
  openEditTemplatePage(tplId) {
    const tpl = APP_DATA.scheme2Templates.find(t => t.id === tplId);
    if (!tpl) {
      AppModule.showToast('未找到指定模版', 'warning');
      return;
    }
    this.editingTemplate = JSON.parse(JSON.stringify(tpl));
    if (!this.editingTemplate.questions) {
      this.editingTemplate.questions = [];
    }
    this.switchTab('editor');
  },

  // 渲染新建/编辑问卷页面
  renderTemplateEditor(container) {
    const tpl = this.editingTemplate;
    if (!tpl) return;
    const isNew = !tpl.id;

    // 题目列表渲染（仅限三种题型：填空、选择、问答）
    const questionsHtml = tpl.questions.map((q, qIdx) => {
      let typeBadgeClass = 'stat-type-single';
      let isChoice = q.type.startsWith('choice');
      let isFill = q.type === 'fill';
      let isEssay = q.type === 'essay';

      if (isChoice) {
        typeBadgeClass = q.type === 'choice_multi' ? 'stat-type-multi' : 'stat-type-single';
      } else if (isFill) {
        typeBadgeClass = 'stat-type-fill';
      } else if (isEssay) {
        typeBadgeClass = 'stat-type-essay';
      }

      // 选择题选项编辑
      let choiceOptionsHtml = '';
      if (isChoice) {
        const optionsList = (q.options || []).map((opt, optIdx) => `
          <div class="option-edit-row">
            <span class="option-seq-circle">${String.fromCharCode(65 + optIdx)}</span>
            <input type="text" 
                   class="admin-input" 
                   style="flex: 1;" 
                   value="${opt}" 
                   placeholder="请输入选项文本" 
                   onchange="AdminModule.editorUpdateOption(${qIdx}, ${optIdx}, this.value)" />
            <button class="admin-btn" style="padding: 2px 8px; font-size: 11px; color: #ff4d4f;" onclick="AdminModule.editorRemoveOption(${qIdx}, ${optIdx})">
              ✕ 删除
            </button>
          </div>
        `).join('');

        choiceOptionsHtml = `
          <div style="background: #f8fafc; border: 1px solid #ebeef5; border-radius: 6px; padding: 12px 14px; margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="font-size: 12px; font-weight: 600; color: #303133;">
                选择类型：
                <label style="margin-left: 8px; cursor: pointer;">
                  <input type="radio" name="choice_type_${qIdx}" value="choice_single" ${q.type === 'choice_single' ? 'checked' : ''} onchange="AdminModule.editorUpdateChoiceType(${qIdx}, 'choice_single')" /> 单选
                </label>
                <label style="margin-left: 12px; cursor: pointer;">
                  <input type="radio" name="choice_type_${qIdx}" value="choice_multi" ${q.type === 'choice_multi' ? 'checked' : ''} onchange="AdminModule.editorUpdateChoiceType(${qIdx}, 'choice_multi')" /> 多选
                </label>
              </div>
              <button class="admin-btn" style="font-size: 11px; color: #1890ff;" onclick="AdminModule.editorAddOption(${qIdx})">
                + 增加选项
              </button>
            </div>
            ${optionsList}
          </div>
        `;
      }

      // 填空题提示配置
      let fillConfigHtml = '';
      if (isFill) {
        fillConfigHtml = `
          <div style="margin-top: 10px;">
            <label style="font-size: 12px; color: #606266; margin-bottom: 4px; display: block;">填空提示引导占位符 (placeholder)：</label>
            <input type="text" 
                   class="admin-input" 
                   value="${q.placeholder || ''}" 
                   placeholder="例如：2026-03-01，借用约3天" 
                   onchange="AdminModule.editorUpdateQuestionField(${qIdx}, 'placeholder', this.value)" />
          </div>
        `;
      }

      // 问答题提示配置
      let essayConfigHtml = '';
      if (isEssay) {
        essayConfigHtml = `
          <div style="margin-top: 10px;">
            <label style="font-size: 12px; color: #606266; margin-bottom: 4px; display: block;">问答文本域提示占位符 (placeholder)：</label>
            <input type="text" 
                   class="admin-input" 
                   value="${q.placeholder || ''}" 
                   placeholder="例如：请输入您的宝贵建议，协助我们持续改进服务流程（限300字）" 
                   onchange="AdminModule.editorUpdateQuestionField(${qIdx}, 'placeholder', this.value)" />
          </div>
        `;
      }

      return `
        <div class="question-edit-card">
          <div class="question-edit-top">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="question-seq-tag">第 ${qIdx + 1} 题</span>
              <span class="stat-type-badge ${typeBadgeClass}">${q.typeName}</span>
              <label style="font-size: 12px; color: #606266; margin-left: 8px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" ${q.required ? 'checked' : ''} onchange="AdminModule.editorUpdateQuestionField(${qIdx}, 'required', this.checked)" />
                <span>必填项</span>
              </label>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="admin-btn" style="padding: 2px 8px; font-size: 12px;" onclick="AdminModule.editorMoveQuestion(${qIdx}, -1)" ${qIdx === 0 ? 'disabled' : ''}>↑ 上移</button>
              <button class="admin-btn" style="padding: 2px 8px; font-size: 12px;" onclick="AdminModule.editorMoveQuestion(${qIdx}, 1)" ${qIdx === tpl.questions.length - 1 ? 'disabled' : ''}>↓ 下移</button>
              <button class="admin-btn" style="padding: 2px 8px; font-size: 12px; color: #ff4d4f;" onclick="AdminModule.editorRemoveQuestion(${qIdx})">🗑️ 删除</button>
            </div>
          </div>

          <div>
            <input type="text" 
                   class="admin-input" 
                   style="width: 100%; font-weight: 500;" 
                   value="${q.title}" 
                   placeholder="请输入题目标题..." 
                   onchange="AdminModule.editorUpdateQuestionField(${qIdx}, 'title', this.value)" />
          </div>

          ${choiceOptionsHtml}
          ${fillConfigHtml}
          ${essayConfigHtml}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="padding-bottom: 30px;">
        <!-- 顶部操作导航栏 -->
        <div class="editor-header-bar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="admin-btn" onclick="AdminModule.switchTab('templates')" style="display: flex; align-items: center; gap: 4px;">
              <span>←</span> <span>返回模版列表</span>
            </button>
            <div>
              <div style="font-size: 16px; font-weight: 700; color: #303133;">
                ${isNew ? '新建问卷模版' : `编辑问卷模版：${tpl.name}`}
              </div>
              <div style="font-size: 12px; color: #909399; margin-top: 2px;">
                题型严格限定为三种：【填空】、【选择】、【问答】，配置保存后小程序端将实时下发对应题型
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="admin-btn" onclick="AdminModule.previewCurrentEditingTemplate()">
              👁️ 预览题目效果
            </button>
            <button class="admin-btn admin-btn-primary" onclick="AdminModule.saveTemplateEditor()">
              💾 保存问卷模版
            </button>
          </div>
        </div>

        <!-- 基础信息配置卡片 -->
        <div class="editor-form-card">
          <div style="font-size: 14px; font-weight: 600; color: #1f2d3d; border-left: 3px solid #1890ff; padding-left: 8px; margin-bottom: 14px;">
            问卷模版基础信息
          </div>
          <div class="editor-form-grid">
            <div class="editor-form-item">
              <label class="editor-form-label"><span style="color: #ff4d4f;">*</span> 模版名称：</label>
              <input type="text" 
                     class="admin-input" 
                     id="editor-tpl-name"
                     value="${tpl.name}" 
                     placeholder="例如：行政办公用品申领满意度与消耗跟踪模版" 
                     onchange="AdminModule.editorUpdateBaseField('name', this.value)" />
            </div>
            <div class="editor-form-item">
              <label class="editor-form-label">版本号：</label>
              <input type="text" 
                     class="admin-input" 
                     id="editor-tpl-version"
                     value="${tpl.version || 'V1.0'}" 
                     placeholder="例如：V1.0" 
                     onchange="AdminModule.editorUpdateBaseField('version', this.value)" />
            </div>
            <div class="editor-form-item">
              <label class="editor-form-label">模版状态：</label>
              <select class="admin-select" onchange="AdminModule.editorUpdateBaseField('status', this.value)">
                <option value="启用" ${tpl.status === '启用' ? 'selected' : ''}>启用</option>
                <option value="未启用" ${tpl.status === '未启用' ? 'selected' : ''}>未启用</option>
              </select>
            </div>
          </div>
          <div class="editor-form-item" style="margin-top: 10px;">
            <label class="editor-form-label">适用说明：</label>
            <input type="text" 
                   class="admin-input" 
                   value="${tpl.description || ''}" 
                   placeholder="例如：涵盖窗口态度、办理时效、证件印章质量、归还计划及开放意见" 
                   onchange="AdminModule.editorUpdateBaseField('description', this.value)" />
          </div>
        </div>

        <!-- 题目设计卡片 -->
        <div class="editor-form-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="font-size: 14px; font-weight: 600; color: #1f2d3d; border-left: 3px solid #1890ff; padding-left: 8px;">
              问卷题目列表（已设计 ${tpl.questions.length} 题）
            </div>
            <span style="font-size: 12px; color: #909399;">题型严格限定为：填空、选择、问答</span>
          </div>

          <!-- 题型添加工具栏 -->
          <div class="editor-type-toolbar">
            <span style="font-size: 13px; font-weight: 600; color: #303133;">➕ 添加题型：</span>
            <button class="admin-btn" style="background: #e6f7ff; color: #1890ff; border-color: #91d5ff; font-weight: 600;" onclick="AdminModule.editorAddQuestion('choice')">
              + 选择题 (单选/多选)
            </button>
            <button class="admin-btn" style="background: #f6ffed; color: #52c41a; border-color: #b7eb8f; font-weight: 600;" onclick="AdminModule.editorAddQuestion('fill')">
              + 填空题
            </button>
            <button class="admin-btn" style="background: #fff7e6; color: #fa8c16; border-color: #ffd591; font-weight: 600;" onclick="AdminModule.editorAddQuestion('essay')">
              + 问答题
            </button>
          </div>

          <!-- 题目列表 -->
          ${questionsHtml.length > 0 ? questionsHtml : `
            <div style="text-align: center; padding: 40px; color: #909399; font-size: 13px;">
              当前暂无题目，请点击上方按钮添加【填空题】、【选择题】或【问答题】
            </div>
          `}
        </div>
      </div>
    `;
  },

  // 更新基础字段
  editorUpdateBaseField(field, val) {
    if (this.editingTemplate) {
      this.editingTemplate[field] = val;
    }
  },

  // 更新题目字段
  editorUpdateQuestionField(qIdx, field, val) {
    if (this.editingTemplate && this.editingTemplate.questions[qIdx]) {
      this.editingTemplate.questions[qIdx][field] = val;
    }
  },

  // 切换选择题单选/多选
  editorUpdateChoiceType(qIdx, type) {
    if (this.editingTemplate && this.editingTemplate.questions[qIdx]) {
      const q = this.editingTemplate.questions[qIdx];
      q.type = type;
      q.typeName = type === 'choice_multi' ? '选择题(多选)' : '选择题(单选)';
      this.renderTemplateEditor(document.getElementById('admin-tab-body'));
    }
  },

  // 增加选项
  editorAddOption(qIdx) {
    if (this.editingTemplate && this.editingTemplate.questions[qIdx]) {
      const q = this.editingTemplate.questions[qIdx];
      if (!q.options) q.options = [];
      q.options.push(`新选项 ${q.options.length + 1}`);
      this.renderTemplateEditor(document.getElementById('admin-tab-body'));
    }
  },

  // 删除选项
  editorRemoveOption(qIdx, optIdx) {
    if (this.editingTemplate && this.editingTemplate.questions[qIdx]) {
      const q = this.editingTemplate.questions[qIdx];
      if (q.options && q.options.length > 1) {
        q.options.splice(optIdx, 1);
        this.renderTemplateEditor(document.getElementById('admin-tab-body'));
      } else {
        AppModule.showToast('选择题至少需要保留 1 个选项', 'warning');
      }
    }
  },

  // 修改选项文字
  editorUpdateOption(qIdx, optIdx, val) {
    if (this.editingTemplate && this.editingTemplate.questions[qIdx]) {
      const q = this.editingTemplate.questions[qIdx];
      if (q.options) q.options[optIdx] = val;
    }
  },

  // 增加新题目（严格限定填空、选择、问答三种）
  editorAddQuestion(type) {
    if (!this.editingTemplate) return;
    if (!this.editingTemplate.questions) this.editingTemplate.questions = [];

    const newId = 'q_' + Date.now();
    if (type === 'fill') {
      this.editingTemplate.questions.push({
        id: newId,
        type: 'fill',
        typeName: '填空题',
        title: '',
        required: true,
        placeholder: '请输入提示引导内容'
      });
    } else if (type === 'choice') {
      this.editingTemplate.questions.push({
        id: newId,
        type: 'choice_single',
        typeName: '选择题(单选)',
        title: '',
        required: true,
        options: ['非常满意', '满意', '基本满意', '不满意']
      });
    } else if (type === 'essay') {
      this.editingTemplate.questions.push({
        id: newId,
        type: 'essay',
        typeName: '问答题',
        title: '',
        required: false,
        placeholder: '请输入您的具体建议或改进意见（限300字）'
      });
    }

    this.renderTemplateEditor(document.getElementById('admin-tab-body'));
  },

  // 删除题目
  editorRemoveQuestion(qIdx) {
    if (this.editingTemplate && this.editingTemplate.questions) {
      if (confirm(`确认删除第 ${qIdx + 1} 道题目吗？`)) {
        this.editingTemplate.questions.splice(qIdx, 1);
        this.renderTemplateEditor(document.getElementById('admin-tab-body'));
      }
    }
  },

  // 移动题目排序
  editorMoveQuestion(qIdx, dir) {
    if (!this.editingTemplate || !this.editingTemplate.questions) return;
    const questions = this.editingTemplate.questions;
    const targetIdx = qIdx + dir;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const temp = questions[qIdx];
    questions[qIdx] = questions[targetIdx];
    questions[targetIdx] = temp;
    this.renderTemplateEditor(document.getElementById('admin-tab-body'));
  },

  // 保存问卷模版
  saveTemplateEditor() {
    const tpl = this.editingTemplate;
    if (!tpl) return;

    const nameInput = document.getElementById('editor-tpl-name');
    if (nameInput) tpl.name = nameInput.value.trim();

    if (!tpl.name) {
      AppModule.showToast('请输入问卷模版名称！', 'warning');
      return;
    }

    if (!tpl.questions || tpl.questions.length === 0) {
      AppModule.showToast('请至少添加一道题目（填空、选择或问答）！', 'warning');
      return;
    }

    for (let i = 0; i < tpl.questions.length; i++) {
      if (!tpl.questions[i].title || !tpl.questions[i].title.trim()) {
        AppModule.showToast(`第 ${i + 1} 题的标题不能为空，请补充！`, 'warning');
        return;
      }
    }

    tpl.questionCount = tpl.questions.length;

    if (!tpl.id) {
      // 新建模版
      tpl.id = 'TPL-USER-' + Date.now().toString().slice(-4);
      tpl.createTime = new Date().toISOString().slice(0, 10);
      APP_DATA.scheme2Templates.push(tpl);
      AppModule.showToast(`新建问卷模版【${tpl.name}】已成功保存！`, 'success');
    } else {
      // 更新现有模版
      const idx = APP_DATA.scheme2Templates.findIndex(t => t.id === tpl.id);
      if (idx !== -1) {
        APP_DATA.scheme2Templates[idx] = tpl;
      }
      AppModule.showToast(`问卷模版【${tpl.name}】已更新保存！`, 'success');
    }

    this.switchTab('templates');
  },

  // 预览当前正在编辑的模版题目
  previewCurrentEditingTemplate() {
    const tpl = this.editingTemplate;
    if (!tpl || !tpl.questions || tpl.questions.length === 0) {
      AppModule.showToast('暂无题目可预览，请先添加题目', 'info');
      return;
    }

    const itemsHtml = tpl.questions.map((q, idx) => `
      <div style="background: #f8fafc; border: 1px solid #ebeef5; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <strong style="color: #303133; font-size: 13px;">第 ${idx + 1} 题：${q.title || '（未命名题目）'}</strong>
          <span class="qa-type-tag ${q.type.includes('choice') ? 'tag-type-choice' : q.type === 'fill' ? 'tag-type-fill' : 'tag-type-essay'}">${q.typeName}</span>
        </div>
        ${q.options ? `
          <div style="font-size: 12px; color: #606266; margin-top: 6px;">
            ${q.options.map(opt => `<div style="padding: 2px 0;">⚪ ${opt}</div>`).join('')}
          </div>
        ` : `
          <div style="font-size: 12px; color: #909399; margin-top: 4px; font-style: italic;">
            提示占位: ${q.placeholder || '用户根据实际情况作答'}
          </div>
        `}
      </div>
    `).join('');

    const modalMask = document.getElementById('admin-stats-modal-container');
    if (!modalMask) return;

    modalMask.innerHTML = `
      <div class="admin-modal" style="max-width: 680px;" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <div class="admin-modal-title">
            <span>👁️ 问卷题目效果预览 · ${tpl.name || '新建问卷模版'}</span>
          </div>
          <button class="admin-modal-close" onclick="AdminModule.closeStatsModal()">✕</button>
        </div>
        <div class="admin-modal-body">
          <div style="font-size: 12px; color: #909399; margin-bottom: 12px;">
            小程序端将依据以下 ${tpl.questions.length} 道题目动态渲染表单：
          </div>
          ${itemsHtml}
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn admin-btn-primary" onclick="AdminModule.closeStatsModal()">关闭预览</button>
        </div>
      </div>
    `;
    modalMask.style.display = 'flex';
  },

  // 预览已有模版题目
  previewTemplate(tplId) {
    const tpl = APP_DATA.scheme2Templates.find(t => t.id === tplId);
    if (!tpl || !tpl.questions) {
      AppModule.showToast('该模版暂无配置题目', 'info');
      return;
    }
    const oldEditing = this.editingTemplate;
    this.editingTemplate = tpl;
    this.previewCurrentEditingTemplate();
    this.editingTemplate = oldEditing;
  },

  // ================= 模块 3: 方案二特有 - 业务模版绑定 =================
  renderBindingsTab(container) {
    const bindings = APP_DATA.bizBindings;
    const rowsHtml = bindings.map(b => `
      <tr>
        <td style="font-weight: 600; color: #1f2d3d;">${b.bizName}</td>
        <td><span class="tag-biz tag-biz-hukou">${b.moduleCategory}</span></td>
        <td>
          <select class="admin-select" style="width: 280px;" onchange="AdminModule.updateBizBinding('${b.bizCode}', this.value)">
            ${APP_DATA.scheme2Templates.map(t => `
              <option value="${t.id}" ${t.id === b.templateId ? 'selected' : ''}>${t.name} (${t.version})</option>
            `).join('')}
          </select>
        </td>
        <td style="color: #606266; font-size: 12px;">${b.triggerPoint}</td>
        <td>
          <span style="color: #52c41a; font-weight: 600;">● 生效中</span>
        </td>
        <td style="color: #909399;">${b.lastUpdated}</td>
        <td>
          <a class="table-action-link" onclick="AdminModule.saveBindingRow('${b.bizCode}')">保存配置</a>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="admin-content-card">
        <div style="margin-bottom: 16px;">
          <div style="font-size: 16px; font-weight: 600; color: #303133;">业务模块与问卷模版绑定管理</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">
            将生活平台具体的业务（如集体户籍首页借用、办公用品）与指定的问卷模版建立关联，小程序端将动态下发对应模版
          </div>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>业务模块名称</th>
                <th>业务所属分类</th>
                <th>关联绑定的问卷模版</th>
                <th>小程序端触发开放时机</th>
                <th>状态</th>
                <th>最后更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  updateBizBinding(bizCode, newTplId) {
    const item = APP_DATA.bizBindings.find(b => b.bizCode === bizCode);
    if (item) {
      item.templateId = newTplId;
      const tpl = APP_DATA.scheme2Templates.find(t => t.id === newTplId);
      if (tpl) item.templateName = tpl.name;
    }
  },

  saveBindingRow(bizCode) {
    AppModule.showToast('业务与模版绑定关系已保存！小程序端已实时生效', 'success');
  },

  // ================= 模块 4: 方案二 - 模版数据统计页（从模版卡片直达） =================
  renderStatisticsTab(container) {
    const allTplStats = APP_DATA.statistics.byTemplate;
    const tplIds = Object.keys(allTplStats);
    let currentTplId = this.currentStatsTplId || tplIds[0];
    let stats = allTplStats[currentTplId];
    if (!stats) {
      currentTplId = tplIds[0];
      stats = allTplStats[currentTplId];
    }

    // 模版选择器
    const tplSelectorHtml = tplIds.map(id => {
      const s = allTplStats[id];
      return `<option value="${id}" ${id === currentTplId ? 'selected' : ''}>${s.templateName}</option>`;
    }).join('');

    // 各题目统计结果列表（取消问答题，仅保留选择题与填空题统计）
    const barColors = ['', 'fill-success', 'fill-cyan', 'fill-warning'];
    const validQuestions = (stats.questionStats || []).filter(q => !q.type.includes('问答'));
    const questionListHtml = validQuestions.map((q, qi) => {
      const fillClass = barColors[qi % barColors.length];
      let typeBadgeClass = 'stat-type-single';
      if (q.type.includes('多选')) typeBadgeClass = 'stat-type-multi';
      else if (q.type.includes('填空')) typeBadgeClass = 'stat-type-fill';

      return `
        <div class="chart-card" style="margin-bottom: 16px;">
          <div class="chart-card-title">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>第 ${qi + 1} 题：${q.title}</span>
              <span class="stat-type-badge ${typeBadgeClass}">${q.type}</span>
            </div>
          </div>
          ${q.options.map(opt => `
            <div class="bar-chart-item">
              <div class="bar-info">
                <span>${opt.label}</span>
                <span>${opt.percent}% (${opt.count}人次)</span>
              </div>
              <div class="bar-progress-track">
                <div class="bar-progress-fill ${fillClass}" style="width: ${opt.percent}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="admin-content-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <!-- 增加返回模版列表按钮 -->
            <button class="admin-btn" onclick="AdminModule.switchTab('templates')" style="display: flex; align-items: center; gap: 4px; font-weight: 500;">
              <span>←</span> <span>返回问卷模版</span>
            </button>
            <div>
              <div style="font-size: 16px; font-weight: 600; color: #303133;">模版题目反馈统计</div>
              <div style="font-size: 12px; color: #909399; margin-top: 2px;">
                针对当前选定模版统计其各题目的填报结果（已取消问答题，仅统计选择题与填空题选项分布）
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <select class="admin-select" style="width: 320px;" onchange="AdminModule.switchStatsTpl(this.value)">
              ${tplSelectorHtml}
            </select>
            <button class="admin-btn" onclick="AdminModule.exportData()">导出报表</button>
          </div>
        </div>

        <div style="font-size: 13px; color: #606266; margin-bottom: 16px; padding: 10px 14px; background: #f5f7fa; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            当前统计模版: <strong style="color: #1890ff;">${stats.templateName}</strong>
            &nbsp;&nbsp;|&nbsp;&nbsp; 累计反馈: <strong>${stats.kpis.totalFeedbacks}</strong> 份
            &nbsp;&nbsp;|&nbsp;&nbsp; 填报率: <strong>${stats.kpis.fillRate}</strong>
          </div>
          <div>
            已反馈: <strong style="color: #52c41a;">${stats.kpis.feedbackedCount}</strong>
            &nbsp;&nbsp;|&nbsp;&nbsp; 未反馈: <strong style="color: #faad14;">${stats.kpis.unfeedbackedCount}</strong>
          </div>
        </div>

        ${questionListHtml}
      </div>
    `;
  },

  // 切换统计看板的模版
  switchStatsTpl(tplId) {
    this.currentStatsTplId = tplId;
    this.renderStatisticsTab(document.getElementById('admin-tab-body'));
  }
};
