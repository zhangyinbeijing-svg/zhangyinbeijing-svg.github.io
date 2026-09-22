// 全局应用控制器与路由协调器
window.AppModule = {
  init() {
    this.bindEvents();
    this.updateSchemeUI();
    this.switchView(APP_DATA.currentView);
  },

  bindEvents() {
    // 顶部方案切换按钮
    const btnScheme1 = document.getElementById('btn-scheme-1');
    const btnScheme2 = document.getElementById('btn-scheme-2');
    if (btnScheme1 && btnScheme2) {
      btnScheme1.addEventListener('click', () => this.switchScheme('scheme1'));
      btnScheme2.addEventListener('click', () => this.switchScheme('scheme2'));
    }

    // 视图切换按钮
    const btnViewMobile = document.getElementById('btn-view-mobile');
    const btnViewAdmin = document.getElementById('btn-view-admin');
    const btnViewDocs = document.getElementById('btn-view-docs');
    if (btnViewMobile && btnViewAdmin && btnViewDocs) {
      btnViewMobile.addEventListener('click', () => this.switchView('mobile'));
      btnViewAdmin.addEventListener('click', () => this.switchView('admin'));
      btnViewDocs.addEventListener('click', () => this.switchView('docs'));
    }
  },

  // 切换方案一与方案二
  switchScheme(schemeKey) {
    APP_DATA.currentScheme = schemeKey;
    const btnScheme1 = document.getElementById('btn-scheme-1');
    const btnScheme2 = document.getElementById('btn-scheme-2');
    
    if (schemeKey === 'scheme1') {
      btnScheme1.classList.add('active');
      btnScheme2.classList.remove('active');
      this.showToast('已切换至【方案一：标准固定模式】（固定题型 + 标准后台列表）', 'primary');
    } else {
      btnScheme1.classList.remove('active');
      btnScheme2.classList.add('active');
      this.showToast('已切换至【方案二：自定义模版+绑定+统计看板模式】', 'primary');
    }

    this.updateSchemeUI();

    // 刷新各端
    if (window.MobileModule) {
      MobileModule.renderOrderPage();
    }
    if (window.AdminModule) {
      AdminModule.refreshForScheme();
    }
  },

  // 更新方案说明横幅
  updateSchemeUI() {
    const banner = document.getElementById('scheme-banner');
    if (!banner) return;

    if (APP_DATA.currentScheme === 'scheme1') {
      banner.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span class="scheme-tag">方案一 · 基础标准版</span>
          <span class="scheme-desc">
            业务对应固定题目（填空、选择、问答），订单完成后小程序展示显眼跟踪卡片，提交后在后台【意见反馈-服务跟踪】列表查看答卷详情。
          </span>
        </div>
        <button class="scheme-tips-btn" onclick="AppModule.switchView('docs')">查看方案一设计详情</button>
      `;
    } else {
      banner.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span class="scheme-tag" style="background: rgba(82, 196, 26, 0.25); border: 1px solid #b7eb8f;">方案二 · 灵活扩展版</span>
          <span class="scheme-desc">
            支持问卷模版自由创建与题型配置，业务与模版解耦灵活绑定，小程序端动态渲染表单，后台新增多维数据统计与词云分析大屏。
          </span>
        </div>
        <button class="scheme-tips-btn" onclick="AppModule.switchView('docs')">查看方案二设计对比</button>
      `;
    }
  },

  // 切换视图（小程序端 / 管理后台 / 设计说明）
  switchView(viewKey) {
    APP_DATA.currentView = viewKey;

    const btnViewMobile = document.getElementById('btn-view-mobile');
    const btnViewAdmin = document.getElementById('btn-view-admin');
    const btnViewDocs = document.getElementById('btn-view-docs');

    btnViewMobile.classList.toggle('active', viewKey === 'mobile');
    btnViewAdmin.classList.toggle('active', viewKey === 'admin');
    btnViewDocs.classList.toggle('active', viewKey === 'docs');

    const viewMobileEl = document.getElementById('view-mobile-container');
    const viewAdminEl = document.getElementById('view-admin-container');
    const viewDocsEl = document.getElementById('view-docs-container');

    viewMobileEl.style.display = viewKey === 'mobile' ? 'flex' : 'none';
    viewAdminEl.style.display = viewKey === 'admin' ? 'flex' : 'none';
    viewDocsEl.style.display = viewKey === 'docs' ? 'block' : 'none';

    if (viewKey === 'mobile' && window.MobileModule) {
      MobileModule.renderOrderPage();
      MobileModule.updateMobileToolbar();
    } else if (viewKey === 'admin' && window.AdminModule) {
      AdminModule.init();
    } else if (viewKey === 'docs') {
      this.renderDocsView();
    }
  },

  // 渲染方案对比与设计说明视图
  renderDocsView() {
    const container = document.getElementById('view-docs-container');
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); color: #303133;">
        <div style="border-bottom: 2px solid #1890ff; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1890ff; display: flex; align-items: center; gap: 10px;">
            📑 集体户籍首页借用与办公用品服务跟踪功能 · 方案一 vs 方案二 对比与架构设计说明
          </h1>
          <p style="font-size: 14px; color: #909399; margin-top: 8px;">
            基于生活平台现有后台管理系统与微信小程序历史订单页视觉规范编制
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
          <!-- 方案一说明卡片 -->
          <div style="border: 1.5px solid #d9d9d9; border-radius: 8px; padding: 20px; background: #fafbfc;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #1f2d3d;">方案一：标准固定模式 (Lightweight)</h2>
              <span class="tag-biz tag-biz-hukou">推荐快速上线</span>
            </div>
            <p style="font-size: 13px; color: #606266; line-height: 1.6; margin-bottom: 14px;">
              针对「集体户籍首页借用」与「办公用品」两个明确业务，固化题目体系。小程序在订单完成时出现显眼跟踪卡片，用户提交后后台直接查看。
            </p>
            <ul style="font-size: 13px; color: #303133; line-height: 1.8; padding-left: 20px;">
              <li><strong>题型规范</strong>：严格采用【填空题】、【选择题(单选/多选)】、【问答题】三种，满足需求要求。</li>
              <li><strong>小程序入口</strong>：置于订单状态下方、审核结果上方，微动效+待评价红标，视觉显著。</li>
              <li><strong>后台管理</strong>：左侧【意见反馈】下新增【服务跟踪】子菜单，支持多维条件查询与答卷详情抽屉。</li>
              <li><strong>开发周期</strong>：预计约 3~5 个工作日即可全量上线。</li>
              <li><strong>适用场景</strong>：当前题目相对固定、业务单一、追求最快交付成果的阶段。</li>
            </ul>
          </div>

          <!-- 方案二说明卡片 -->
          <div style="border: 1.5px solid #1890ff; border-radius: 8px; padding: 20px; background: #f0f7ff;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #1890ff;">方案二：模版化与统计分析模式 (Advanced)</h2>
              <span class="tag-biz tag-biz-supplies">长远平台化首选</span>
            </div>
            <p style="font-size: 13px; color: #606266; line-height: 1.6; margin-bottom: 14px;">
              问卷题目支持后台自由拖拽配置生成模版，业务与模版解耦绑定，小程序端动态加载下发表单，并配备强大的数据统计分析看板。
            </p>
            <ul style="font-size: 13px; color: #303133; line-height: 1.8; padding-left: 20px;">
              <li><strong>问卷模版设计器</strong>：支持自由新增填空、选择（动态维护选项）、问答题，自定义是否必填与占位提示。</li>
              <li><strong>业务灵活绑定</strong>：集体户籍借用、办公用品及未来任意新模块（如车辆、工位）可一键绑定或切换问卷模版。</li>
              <li><strong>统计分析大屏</strong>：总反馈量、综合满意率、订单填报率、选择题与填空题选项分布占比柱形图（取消主观问答题统计）。</li>
              <li><strong>开发周期</strong>：预计约 8~12 个工作日。</li>
              <li><strong>适用场景</strong>：中大型业务平台、经常需调优评价维度、重视数据运营决策的高标准场景。</li>
            </ul>
          </div>
        </div>

        <!-- 详细功能对比表 -->
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 14px; color: #1f2d3d;">核心维度详细对比表</h3>
        <table class="admin-table" style="margin-bottom: 30px; border: 1px solid #ebeef5;">
          <thead>
            <tr>
              <th style="width: 160px;">评估维度</th>
              <th>方案一（标准固定模版）</th>
              <th>方案二（模版配置+绑定+统计看板）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: 600;">小程序端体验</td>
              <td>根据订单所属业务固定展示设计好的填空/选择/问答题目</td>
              <td>根据绑定的模版 JSON 动态驱动表单组件渲染，体验一致且更灵活</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">题目修改与扩展</td>
              <td>如需新增题目或调整选项，需前端修改代码并重新发版</td>
              <td>运营人员在后台直接编辑模版，保存即刻在线生效，零代码发版</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">多业务适配能力</td>
              <td>目前针对户籍首页和办公用品，新增业务需写对应分支代码</td>
              <td>平台化解耦，后续增加“印章借用”、“会议室预约”可直接复用或建新模版</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">后台意见反馈菜单</td>
              <td>左侧栏目保留【服务跟踪】，工作区顶部平级提供【服务跟踪】与【问卷模版】Tab；问卷模版无设计题目，点击【数据统计】可直接查看统计</td>
              <td>左侧栏目保留【服务跟踪】，工作区顶部提供【跟踪数据列表】与【问卷模版管理】Tab，模版卡片直接提供【数据统计】直达统计页</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">数据分析能力</td>
              <td>在固定问卷模版中提供【数据统计】，可弹窗查看单选题、多选题及填空题聚类统计数据（取消问答题统计）</td>
              <td>针对各模版提供专属题目统计页，直观展示该模版选择与填空题目的分布比例并支持返回与导出</td>
            </tr>
          </tbody>
        </table>

        <!-- 实施演进建议 -->
        <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; padding: 18px 20px;">
          <h4 style="color: #faad14; font-size: 15px; font-weight: 700; margin-bottom: 8px;">💡 架构师演进建议：</h4>
          <p style="font-size: 13px; color: #606266; line-height: 1.6;">
            若您团队当前迭代排期较为紧张，建议<strong>第一期先落地方案一</strong>：快速在小程序端建立显眼服务跟踪入口、固化填空/选择/问答题目，并在后台意见反馈下沉淀数据；
            数据库底层采用<strong>键值对或 JSON 存储答题结构</strong>（预留 template_id 字段），在业务平稳运行 1~2 个月后，无缝平滑升级至<strong>方案二</strong>，接入模版设计器与统计看板，降低初期开发风险！
          </p>
        </div>
      </div>
    `;
  },

  // 全局 Toast 提示
  showToast(msg, type = 'info') {
    const toast = document.getElementById('global-toast');
    if (!toast) return;

    toast.innerText = msg;
    toast.className = 'custom-toast show';

    if (type === 'success') toast.classList.add('toast-success');
    else if (type === 'primary') toast.classList.add('toast-primary');

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = 'custom-toast';
    }, 2800);
  }
};
