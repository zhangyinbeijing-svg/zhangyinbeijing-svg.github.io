// 小程序端视图与交互逻辑
window.MobileModule = {
  // 当前作答状态暂存
  currentAnswers: {},

  init() {
    this.renderOrderPage();
  },

  // 切换当前查看的订单业务类型（集体户籍首页借用 vs 办公用品）
  switchBiz(bizKey) {
    APP_DATA.currentMobileBiz = bizKey;
    this.currentAnswers = {};
    this.renderOrderPage();
    this.updateMobileToolbar();
  },

  updateMobileToolbar() {
    const btnHukou = document.getElementById('btn-order-hukou');
    const btnSupplies = document.getElementById('btn-order-supplies');
    if (btnHukou && btnSupplies) {
      if (APP_DATA.currentMobileBiz === 'hukou') {
        btnHukou.classList.add('active');
        btnSupplies.classList.remove('active');
      } else {
        btnHukou.classList.remove('active');
        btnSupplies.classList.add('active');
      }
    }
  },

  // 渲染历史订单详情页（对齐截图2，含新增醒目服务跟踪入口）
  renderOrderPage() {
    const container = document.getElementById('mobile-scroll-container');
    const navTitle = document.getElementById('mini-nav-title');
    const backBtn = document.getElementById('mini-nav-back');
    
    if (!container) return;

    navTitle.innerText = '历史订单详情';
    backBtn.style.visibility = 'hidden';

    const order = APP_DATA.orders[APP_DATA.currentMobileBiz];
    const isHukou = order.bizKey === 'hukou';

    // 重点：优化后的问卷填写/服务跟踪入口卡片
    const trackingEntryHtml = order.isFeedbackDone 
      ? `
        <div class="service-tracking-entry-card tracking-entry-done" onclick="MobileModule.viewSubmittedFeedback()">
          <div class="tracking-entry-left">
            <div class="tracking-entry-icon">✅</div>
            <div class="tracking-entry-texts">
              <div class="tracking-entry-title-row">
                <span class="tracking-entry-title">服务跟踪已评价</span>
                <span class="tracking-entry-tag tag-done">已完成</span>
              </div>
              <div class="tracking-entry-sub">已提交问卷反馈，点击回顾详情</div>
            </div>
          </div>
          <div class="tracking-entry-action-btn">
            <span>查看详情</span>
            <span style="font-size: 14px; margin-left: 2px;">›</span>
          </div>
        </div>
      `
      : `
        <div class="service-tracking-entry-card" onclick="MobileModule.openSurveyPage()">
          <div class="tracking-entry-left">
            <div class="tracking-entry-icon pulse">✍️</div>
            <div class="tracking-entry-texts">
              <div class="tracking-entry-title-row">
                <span class="tracking-entry-title">服务跟踪与体验反馈</span>
                <span class="tracking-entry-tag tag-pending">待评价</span>
              </div>
              <div class="tracking-entry-sub">诚邀您花1分钟对本次办理进行评价</div>
            </div>
          </div>
          <div class="tracking-entry-action-btn">
            <span>去填写</span>
            <span style="font-size: 14px; margin-left: 2px;">›</span>
          </div>
        </div>
      `;

    // 审核结果模块（对齐截图2）
    const auditSectionHtml = isHukou 
      ? `
        <div class="order-detail-card">
          <div class="section-title">审核结果</div>
          <div class="info-rows">
            <div class="info-row">
              <span class="info-label">审核结果:</span>
              <span class="info-value" style="color: #303133; font-weight: 600;">${order.auditResult}</span>
            </div>
            <div class="info-row">
              <span class="info-label">姓名:</span>
              <span class="info-value">${order.applicant}</span>
            </div>
            <div class="info-row">
              <span class="info-label">用途:</span>
              <span class="info-value">${order.purposeType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">有效期:</span>
              <span class="info-value">${order.validPeriod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">审核备注:</span>
              <span class="info-value">${order.auditNote}</span>
            </div>
            <div class="info-row" style="flex-direction: column; gap: 6px; align-items: flex-start;">
              <span class="info-label">户籍首页:</span>
              <div class="certificate-preview-box">
                <div class="cert-thumbnail">
                  <div style="font-size: 8px; color: #8c8c8c; margin-top: 4px;">常住人口登记卡</div>
                  <div style="font-size: 7px; color: #bfbfbf; margin-top: 2px;">(集体户专用户籍卡)</div>
                  <div class="cert-seal">户政专用</div>
                </div>
                <div style="font-size: 11px; color: #1890ff; cursor: pointer;">点击查看电子凭证盖章扫描件</div>
              </div>
            </div>
          </div>
        </div>
      `
      : `
        <div class="order-detail-card">
          <div class="section-title">审核与发放结果</div>
          <div class="info-rows">
            <div class="info-row">
              <span class="info-label">审核结果:</span>
              <span class="info-value" style="color: #52c41a; font-weight: 600;">${order.auditResult}</span>
            </div>
            <div class="info-row">
              <span class="info-label">领用人:</span>
              <span class="info-value">${order.applicant}</span>
            </div>
            <div class="info-row">
              <span class="info-label">物资类型:</span>
              <span class="info-value">${order.purposeType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">发放记录:</span>
              <span class="info-value">${order.auditNote}</span>
            </div>
          </div>
        </div>
      `;

    // 业务基本信息卡片（对齐截图2）
    const infoSectionHtml = `
      <div class="order-detail-card">
        <div class="section-title">${order.bizType}信息</div>
        <div class="info-rows">
          <div class="info-row">
            <span class="info-label">订单编号:</span>
            <span class="info-value">${order.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">完成时间:</span>
            <span class="info-value">${order.updateTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">本人姓名:</span>
            <span class="info-value">${order.applicant}</span>
          </div>
          <div class="info-row">
            <span class="info-label">手机号:</span>
            <span class="info-value">${order.phone}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请类型:</span>
            <span class="info-value">${order.applyType}</span>
          </div>
          <div class="info-row">
            <span class="info-label">用途说明:</span>
            <span class="info-value">${order.explain}</span>
          </div>
        </div>
      </div>
    `;

    // 温馨提示卡片（对齐截图2底部的黄色温馨提示卡）
    const tipsHtml = `
      <div class="warm-tips-card">
        <div class="warm-tips-badge">温馨提示</div>
        <div class="warm-tips-text">${order.tips}</div>
      </div>
    `;

    // 组合页面
    container.innerHTML = `
      <!-- 顶部业务概要卡片（对齐截图2真实小程序样式） -->
      <div class="order-header-card">
        <div class="order-title-box">
          <div class="order-icon-circle">${isHukou ? '📑' : '📦'}</div>
          <div class="order-biz-name">${order.bizType}</div>
        </div>
        <div class="order-status-tag">${order.status}</div>
      </div>

      <!-- 问卷填写/服务跟踪入口卡片（显眼、专业、美观） -->
      ${trackingEntryHtml}

      <!-- 审核结果 -->
      ${auditSectionHtml}

      <!-- 基础借用/申领信息 -->
      ${infoSectionHtml}

      <!-- 温馨提示 -->
      ${tipsHtml}
    `;
  },

  // 打开服务跟踪问卷页面
  openSurveyPage() {
    const container = document.getElementById('mobile-scroll-container');
    const navTitle = document.getElementById('mini-nav-title');
    const backBtn = document.getElementById('mini-nav-back');
    
    navTitle.innerText = '服务跟踪反馈';
    backBtn.style.visibility = 'visible';
    backBtn.onclick = () => this.renderOrderPage();

    const order = APP_DATA.orders[APP_DATA.currentMobileBiz];
    
    // 获取当前业务对应的问卷题目（方案二支持从业务绑定的模版中动态加载题目）
    let questions = [];
    if (APP_DATA.currentScheme === 'scheme2') {
      const binding = APP_DATA.bizBindings.find(b => b.bizCode === order.bizKey);
      if (binding) {
        const tpl = APP_DATA.scheme2Templates.find(t => t.id === binding.templateId);
        if (tpl && tpl.questions && tpl.questions.length > 0) {
          questions = tpl.questions;
        }
      }
    }
    if (!questions || questions.length === 0) {
      questions = APP_DATA.scheme1Questions[order.bizKey] || [];
    }

    let questionsHtml = '';
    questions.forEach((q, index) => {
      let contentHtml = '';

      if (q.type === 'choice_single') {
        // 单选题
        const optionsList = q.options.map((opt, optIdx) => {
          const isSelected = this.currentAnswers[q.id] === opt;
          return `
            <div class="choice-option-item ${isSelected ? 'selected' : ''}" 
                 onclick="MobileModule.selectSingleChoice('${q.id}', '${opt}')">
              <div class="option-indicator">
                ${isSelected ? '<div class="option-indicator-inner"></div>' : ''}
              </div>
              <div>${opt}</div>
            </div>
          `;
        }).join('');
        contentHtml = `<div class="choice-options-list">${optionsList}</div>`;

      } else if (q.type === 'choice_multi') {
        // 多选题
        const selectedArr = this.currentAnswers[q.id] || [];
        const optionsList = q.options.map((opt) => {
          const isSelected = selectedArr.includes(opt);
          return `
            <div class="choice-option-item ${isSelected ? 'selected' : ''}" 
                 onclick="MobileModule.toggleMultiChoice('${q.id}', '${opt}')">
              <div class="option-indicator option-checkbox-indicator">
                ${isSelected ? '✓' : ''}
              </div>
              <div>${opt}</div>
            </div>
          `;
        }).join('');
        contentHtml = `<div class="choice-options-list">${optionsList}</div>`;

      } else if (q.type === 'fill') {
        // 填空题
        const currentVal = this.currentAnswers[q.id] || '';
        contentHtml = `
          <input type="text" 
                 class="fill-input-box" 
                 placeholder="${q.placeholder}" 
                 value="${currentVal}"
                 oninput="MobileModule.updateFillAnswer('${q.id}', this.value)" />
        `;

      } else if (q.type === 'essay') {
        // 问答题
        const currentVal = this.currentAnswers[q.id] || '';
        contentHtml = `
          <textarea class="essay-textarea-box" 
                    placeholder="${q.placeholder}"
                    maxlength="300"
                    oninput="MobileModule.updateEssayAnswer('${q.id}', this.value, 'count-${q.id}')">${currentVal}</textarea>
          <div class="textarea-counter" id="count-${q.id}">${currentVal.length}/300</div>
        `;
      }

      // 题型标签
      let badgeClass = 'badge-choice';
      if (q.type === 'fill') badgeClass = 'badge-fill';
      if (q.type === 'essay') badgeClass = 'badge-essay';

      questionsHtml += `
        <div class="survey-question-card">
          <div class="question-title-row">
            <span class="question-badge ${badgeClass}">${q.typeName}</span>
            <div class="question-text">
              ${q.required ? '<span class="required-mark">*</span>' : ''}
              ${index + 1}. ${q.title}
            </div>
          </div>
          ${contentHtml}
        </div>
      `;
    });

    container.innerHTML = `
      <div class="survey-page-view">
        <div class="survey-order-header">
          <div class="survey-order-info">
            <div style="font-weight: 600; color: #1f2d3d; font-size: 14px; margin-bottom: 2px;">
              ${order.bizType} · 跟踪问卷
            </div>
            <div style="color: #909399; font-size: 11px;">关联单号: ${order.id}</div>
          </div>
          <div style="font-size: 11px; background: #e6f7ff; color: #1890ff; padding: 3px 8px; border-radius: 12px;">
            ${APP_DATA.currentScheme === 'scheme2' ? '模版绑定动态问卷' : '标准跟踪问卷'}
          </div>
        </div>

        ${questionsHtml}

        <div class="survey-submit-bar">
          <button class="survey-submit-btn" onclick="MobileModule.submitFeedback()">提交服务跟踪反馈</button>
        </div>
      </div>
    `;

    container.scrollTop = 0;
  },

  // 单选操作
  selectSingleChoice(qId, val) {
    this.currentAnswers[qId] = val;
    this.openSurveyPage(); // 重新渲染刷新状态
  },

  // 多选操作
  toggleMultiChoice(qId, val) {
    if (!this.currentAnswers[qId]) {
      this.currentAnswers[qId] = [];
    }
    const idx = this.currentAnswers[qId].indexOf(val);
    if (idx > -1) {
      this.currentAnswers[qId].splice(idx, 1);
    } else {
      this.currentAnswers[qId].push(val);
    }
    this.openSurveyPage();
  },

  // 填空题输入
  updateFillAnswer(qId, val) {
    this.currentAnswers[qId] = val;
  },

  // 问答题输入
  updateEssayAnswer(qId, val, counterId) {
    this.currentAnswers[qId] = val;
    const counter = document.getElementById(counterId);
    if (counter) {
      counter.innerText = `${val.length}/300`;
    }
  },

  // 提交服务跟踪反馈
  submitFeedback() {
    const order = APP_DATA.orders[APP_DATA.currentMobileBiz];
    let questions = [];
    if (APP_DATA.currentScheme === 'scheme2') {
      const binding = APP_DATA.bizBindings.find(b => b.bizCode === order.bizKey);
      if (binding) {
        const tpl = APP_DATA.scheme2Templates.find(t => t.id === binding.templateId);
        if (tpl && tpl.questions && tpl.questions.length > 0) {
          questions = tpl.questions;
        }
      }
    }
    if (!questions || questions.length === 0) {
      questions = APP_DATA.scheme1Questions[order.bizKey] || [];
    }

    // 验证必填项
    for (let q of questions) {
      if (q.required) {
        const ans = this.currentAnswers[q.id];
        if (!ans || (Array.isArray(ans) && ans.length === 0) || (typeof ans === 'string' && ans.trim() === '')) {
          AppModule.showToast(`请先完成【${q.title.slice(0, 10)}...】必填反馈`, 'error');
          return;
        }
      }
    }

    // 生成反馈记录并推入后台数据列表，实现双端联动！
    const newFeedbackId = '5' + Math.floor(Math.random() * 9000000000000000 + 1000000000000000);

    const newRecord = {
      id: newFeedbackId,
      bizType: order.bizType,
      orderId: order.id,
      userName: order.applicant,
      phone: order.phone,
      status: '已反馈',
      submitTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      answers: { ...this.currentAnswers }
    };

    // 更新到全局数据
    APP_DATA.trackingRecords.unshift(newRecord);
    order.isFeedbackDone = true;
    order.feedbackId = newFeedbackId;

    // 成功提示
    AppModule.showToast('服务跟踪反馈提交成功！已同步至后台意见反馈列表', 'success');

    // 返回订单完成页，此时入口已变成"已完成反馈"
    this.renderOrderPage();

    // 如果后台在运行，同时刷新后台表格
    if (window.AdminModule) {
      AdminModule.renderTable();
    }
  },

  // 查看已提交的反馈问卷
  viewSubmittedFeedback() {
    const order = APP_DATA.orders[APP_DATA.currentMobileBiz];
    const record = APP_DATA.trackingRecords.find(r => r.id === order.feedbackId) || APP_DATA.trackingRecords[0];

    const container = document.getElementById('mobile-scroll-container');
    const navTitle = document.getElementById('mini-nav-title');
    const backBtn = document.getElementById('mini-nav-back');
    
    navTitle.innerText = '已提交的反馈详情';
    backBtn.style.visibility = 'visible';
    backBtn.onclick = () => this.renderOrderPage();

    const questions = APP_DATA.scheme1Questions[order.bizKey] || [];
    let listHtml = '';
    questions.forEach((q, i) => {
      let answerVal = record.answers[q.id] || '未填写';
      if (Array.isArray(answerVal)) {
        answerVal = answerVal.join('； ');
      }
      listHtml += `
        <div class="qa-card" style="margin-bottom: 12px;">
          <div class="qa-header">
            <span class="qa-type-tag tag-type-choice">${q.typeName}</span>
            <div class="qa-title">${i + 1}. ${q.title}</div>
          </div>
          <div class="qa-answer" style="color: #1890ff; font-weight: 500;">${answerVal}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="order-detail-card" style="border-left: 4px solid #52c41a;">
          <div style="font-weight: 700; font-size: 15px; color: #52c41a; margin-bottom: 4px;">
            ✓ 服务跟踪反馈已归档
          </div>
          <div style="font-size: 12px; color: #909399;">提交时间：${record.submitTime}</div>
          <div style="font-size: 12px; color: #909399;">跟踪单号：${record.id}</div>
        </div>
        ${listHtml}
        <button class="admin-btn" style="width: 100%; height: 40px;" onclick="MobileModule.renderOrderPage()">返回订单</button>
      </div>
    `;
    container.scrollTop = 0;
  }
};
