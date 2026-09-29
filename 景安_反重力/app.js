/**
 * ES Mail 本地邮件归档 - 邮件生命周期管理模块交互逻辑
 */

// 预置默认策略数据
let policies = [
  {
    id: 1,
    name: "常规员工邮件保存3年策略",
    scopeType: "全部邮件",
    scopeTarget: "全员企业邮箱",
    years: 3,
    months: 0,
    days: 0,
    cleanBody: true,
    cleanEs: true,
    execRule: "每日 02:00 自动执行",
    status: true,
    lastExecTime: "2026-09-29 02:00:15",
    cleanedCount: "94,120 封"
  },
  {
    id: 2,
    name: "临时/离职归档员工短期清理",
    scopeType: "指定部门",
    scopeTarget: "外包支持部, 临时项目组",
    years: 0,
    months: 6,
    days: 0,
    cleanBody: true,
    cleanEs: true,
    execRule: "每日 02:30 自动执行",
    status: true,
    lastExecTime: "2026-09-29 02:30:08",
    cleanedCount: "12,472 封"
  },
  {
    id: 3,
    name: "财务与法务重要账户长期归档",
    scopeType: "指定账户",
    scopeTarget: "finance@east.net, legal@east.net",
    years: 7,
    months: 0,
    days: 0,
    cleanBody: true,
    cleanEs: true,
    execRule: "每周日 03:00 自动执行",
    status: false,
    lastExecTime: "2026-09-27 03:00:22",
    cleanedCount: "18,000 封"
  }
];

// 预置执行日志数据（支持策略ID主键关联、改名前历史名称快照及已删除策略溯源）
let logs = [
  {
    batchId: "TASK-20260929-0200",
    policyId: "PID-1001",
    policyName: "常规员工邮件保存3年策略",
    originalName: null,
    policyDeleted: false,
    startTime: "2026-09-29 02:00:15",
    endTime: "2026-09-29 02:18:42",
    scannedCount: "14,208",
    deletedBodyCount: "14,208 封",
    cleanedEsCount: "14,208 条",
    releasedSpace: "24.5 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260929-0230",
    policyId: "PID-1002",
    policyName: "临时/离职归档员工短期清理",
    originalName: "离职人员6个月清理计划", // 模拟策略曾被改名过
    policyDeleted: false,
    startTime: "2026-09-29 02:30:08",
    endTime: "2026-09-29 02:34:11",
    scannedCount: "1,532",
    deletedBodyCount: "1,532 封",
    cleanedEsCount: "1,532 条",
    releasedSpace: "3.2 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260928-0200",
    policyId: "PID-1001",
    policyName: "常规员工邮件保存3年策略",
    originalName: null,
    policyDeleted: false,
    startTime: "2026-09-28 02:00:11",
    endTime: "2026-09-28 02:21:05",
    scannedCount: "16,420",
    deletedBodyCount: "16,420 封",
    cleanedEsCount: "16,420 条",
    releasedSpace: "28.1 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260925-0400",
    policyId: "PID-1004",
    policyName: "外部测试项目组临时清理策略",
    originalName: null,
    policyDeleted: true, // 模拟该策略已被管理员删除，但审计日志永久保留！
    startTime: "2026-09-25 04:00:03",
    endTime: "2026-09-25 04:08:12",
    scannedCount: "3,890",
    deletedBodyCount: "3,890 封",
    cleanedEsCount: "3,890 条",
    releasedSpace: "8.6 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260927-0300",
    policyId: "PID-1003",
    policyName: "财务与法务重要账户长期归档",
    originalName: null,
    policyDeleted: false,
    startTime: "2026-09-27 03:00:22",
    endTime: "2026-09-27 03:12:10",
    scannedCount: "4,110",
    deletedBodyCount: "4,110 封",
    cleanedEsCount: "4,110 条",
    releasedSpace: "9.8 GB",
    status: "成功"
  }
];

// 初始化 DOM 事件
document.addEventListener("DOMContentLoaded", () => {
  renderPolicyTable();
  renderLogTable();
  bindNavigationEvents();
  bindModalEvents();
  bindLogEvents();
});

// 渲染策略列表
function renderPolicyTable() {
  const tbody = document.getElementById("policy-table-body");
  if (!tbody) return;

  if (policies.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:#86909c;">暂无生命周期策略，请点击右上角新增</td></tr>`;
    document.getElementById("total-count").innerText = "0";
    return;
  }

  tbody.innerHTML = policies.map(p => {
    // 格式化保留时间显示
    let periodText = "";
    if (p.years > 0) periodText += `${p.years}年`;
    if (p.months > 0) periodText += `${p.months}月`;
    if (p.days > 0) periodText += `${p.days}天`;
    if (!periodText) periodText = "即时清理";

    return `
      <tr>
        <td><input type="checkbox" class="row-checkbox" value="${p.id}"></td>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td><span class="tag-scope">${escapeHtml(p.scopeType)}: ${escapeHtml(p.scopeTarget)}</span></td>
        <td><span class="tag-period"><i class="fa-regular fa-calendar"></i> ${periodText}</span></td>
        <td>
          <span class="tag-clean-type" title="自动双向销毁"><i class="fa-solid fa-file-circle-xmark text-blue"></i> 邮件本体 + <i class="fa-solid fa-database text-green"></i> ES索引</span>
        </td>
        <td><span style="color:#595959; font-size:11.5px;">${p.execRule}</span></td>
        <td>
          <span class="status-badge">
            <span class="status-dot ${p.status ? 'active' : 'stopped'}"></span>
            ${p.status ? '<span style="color:#00b42a;">开启</span>' : '<span style="color:#86909c;">停用</span>'}
          </span>
        </td>
        <td style="color:#86909c; font-size:11.5px;">${p.lastExecTime}</td>
        <td><strong style="color:#1d2129;">${p.cleanedCount}</strong></td>
        <td class="text-center">
          <a href="javascript:void(0)" class="action-link" onclick="openEditModal(${p.id})">编辑</a>
          <a href="javascript:void(0)" class="action-link trigger-btn" onclick="triggerManualClean(${p.id})">立即执行</a>
          <a href="javascript:void(0)" class="action-link" onclick="jumpToPolicyLogs('${escapeHtml(p.name)}')">日志</a>
          <a href="javascript:void(0)" class="action-link danger" onclick="deletePolicy(${p.id})">删除</a>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("total-count").innerText = policies.length;
  document.getElementById("stat-active-policies").innerText = policies.filter(p => p.status).length;
}

// 渲染日志列表
function renderLogTable(data = logs) {
  const tbody = document.getElementById("log-table-body");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:#86909c;">未查询到符合条件的生命周期清理日志</td></tr>`;
    document.getElementById("log-total-count").innerText = "0";
    return;
  }

  tbody.innerHTML = data.map(log => {
    return `
      <tr>
        <td><code>${log.batchId}</code></td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <strong>${escapeHtml(log.policyName)}</strong>
            ${log.policyDeleted ? '<span class="badge" style="background:#f2f3f5; color:#86909c; font-size:10px;">已删除策略</span>' : ''}
          </div>
          ${log.originalName ? `<div style="font-size:11px; color:#86909c; margin-top:2px;">(改名前快照: ${escapeHtml(log.originalName)})</div>` : ''}
          <div style="font-size:10.5px; color:#86909c; font-family:monospace; margin-top:1px;">ID: ${log.policyId}</div>
        </td>
        <td style="font-size:11.5px; color:#595959;">${log.startTime}</td>
        <td style="font-size:11.5px; color:#595959;">${log.endTime}</td>
        <td>${log.scannedCount} 封</td>
        <td><span class="badge blue">${log.deletedBodyCount}</span></td>
        <td><span class="badge green" style="background:#e8ffea; color:#00b42a;">${log.cleanedEsCount}</span></td>
        <td><strong style="color:#165dff;">${log.releasedSpace}</strong></td>
        <td>
          <span style="color:#00b42a; font-weight:500;"><i class="fa-solid fa-circle-check"></i> ${log.status}</span>
        </td>
        <td class="text-center">
          <a href="javascript:void(0)" class="action-link" onclick="openLogDetail('${log.batchId}', '${escapeHtml(log.policyName)}')">查看明细</a>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("log-total-count").innerText = data.length;
}

// 标签页切换与菜单联动
function bindNavigationEvents() {
  const tabs = document.querySelectorAll(".tab-item");
  const viewLifecycle = document.getElementById("view-lifecycle");
  const viewLifecycleLog = document.getElementById("view-lifecycle-log");
  const menuLifecycle = document.getElementById("menu-lifecycle");
  const menuLifecycleLog = document.getElementById("menu-lifecycle-log");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      switchTab(target);
    });
  });

  if (menuLifecycle) {
    menuLifecycle.addEventListener("click", () => {
      switchTab("lifecycle");
    });
  }

  if (menuLifecycleLog) {
    menuLifecycleLog.addEventListener("click", () => {
      switchTab("lifecycle-log");
    });
  }

  // 顶部“查看清理日志”按钮
  const btnViewLogs = document.getElementById("btn-view-logs");
  if (btnViewLogs) {
    btnViewLogs.addEventListener("click", () => {
      switchTab("lifecycle-log");
    });
  }

  // 搜索框过滤策略
  const searchPolicyInput = document.getElementById("search-policy-input");
  if (searchPolicyInput) {
    searchPolicyInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      const filtered = policies.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.scopeTarget.toLowerCase().includes(query)
      );
      renderFilteredPolicies(filtered);
    });
  }

  // 左侧一级菜单折叠/展开交互
  const subToggles = document.querySelectorAll(".sub-toggle");
  subToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const parentItem = toggle.closest(".nav-item.has-sub");
      const subMenu = parentItem.querySelector(".sub-menu");
      const arrow = toggle.querySelector(".arrow");
      if (subMenu) {
        const isShown = subMenu.classList.contains("show");
        if (isShown) {
          subMenu.classList.remove("show");
          parentItem.classList.remove("open");
          if (arrow) arrow.className = "fa-solid fa-angle-right arrow";
        } else {
          subMenu.classList.add("show");
          parentItem.classList.add("open");
          if (arrow) arrow.className = "fa-solid fa-angle-down arrow";
        }
      }
    });
  });

  // 全选/反选
  const checkAll = document.getElementById("check-all");
  if (checkAll) {
    checkAll.addEventListener("change", (e) => {
      const checkboxes = document.querySelectorAll(".row-checkbox");
      checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
  }
}

function switchTab(tabKey) {
  const tabs = document.querySelectorAll(".tab-item");
  tabs.forEach(t => {
    if (t.getAttribute("data-tab") === tabKey) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });

  const menuLifecycle = document.getElementById("menu-lifecycle");
  const menuLifecycleLog = document.getElementById("menu-lifecycle-log");
  const viewLifecycle = document.getElementById("view-lifecycle");
  const viewLifecycleLog = document.getElementById("view-lifecycle-log");

  // 取消所有子链接激活状态
  document.querySelectorAll(".sub-link").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".sub-toggle").forEach(el => el.classList.remove("active-parent"));

  if (tabKey === "lifecycle") {
    viewLifecycle.classList.add("active");
    viewLifecycleLog.classList.remove("active");
    if (menuLifecycle) {
      menuLifecycle.classList.add("active");
      const parentEnterprise = menuLifecycle.closest(".nav-item.has-sub");
      if (parentEnterprise) {
        parentEnterprise.classList.add("open");
        const sub = parentEnterprise.querySelector(".sub-menu");
        if (sub) sub.classList.add("show");
        const toggle = parentEnterprise.querySelector(".sub-toggle");
        if (toggle) {
          toggle.classList.add("active-parent");
          const arrow = toggle.querySelector(".arrow");
          if (arrow) arrow.className = "fa-solid fa-angle-down arrow";
        }
      }
    }
  } else if (tabKey === "lifecycle-log") {
    viewLifecycle.classList.remove("active");
    viewLifecycleLog.classList.add("active");
    if (menuLifecycleLog) {
      menuLifecycleLog.classList.add("active");
      const parentLog = menuLifecycleLog.closest(".nav-item.has-sub");
      if (parentLog) {
        parentLog.classList.add("open");
        const sub = parentLog.querySelector(".sub-menu");
        if (sub) sub.classList.add("show");
        const toggle = parentLog.querySelector(".sub-toggle");
        if (toggle) {
          toggle.classList.add("active-parent");
          const arrow = toggle.querySelector(".arrow");
          if (arrow) arrow.className = "fa-solid fa-angle-down arrow";
        }
      }
    }
  } else {
    showToast(`您点击了 ${tabKey} 标签，当前演示已就绪生命周期管理与日志`, "info");
  }
}

function renderFilteredPolicies(list) {
  const tbody = document.getElementById("policy-table-body");
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:#86909c;">未找到匹配的生命周期策略</td></tr>`;
    document.getElementById("total-count").innerText = "0";
    return;
  }
  tbody.innerHTML = list.map(p => {
    let periodText = "";
    if (p.years > 0) periodText += `${p.years}年`;
    if (p.months > 0) periodText += `${p.months}月`;
    if (p.days > 0) periodText += `${p.days}天`;
    if (!periodText) periodText = "即时清理";

    return `
      <tr>
        <td><input type="checkbox" class="row-checkbox" value="${p.id}"></td>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td><span class="tag-scope">${escapeHtml(p.scopeType)}: ${escapeHtml(p.scopeTarget)}</span></td>
        <td><span class="tag-period"><i class="fa-regular fa-calendar"></i> ${periodText}</span></td>
        <td>
          <span class="tag-clean-type"><i class="fa-solid fa-file-circle-xmark text-blue"></i> 邮件本体 + <i class="fa-solid fa-database text-green"></i> ES索引</span>
        </td>
        <td><span style="color:#595959; font-size:11.5px;">${p.execRule}</span></td>
        <td>
          <span class="status-badge">
            <span class="status-dot ${p.status ? 'active' : 'stopped'}"></span>
            ${p.status ? '<span style="color:#00b42a;">开启</span>' : '<span style="color:#86909c;">停用</span>'}
          </span>
        </td>
        <td style="color:#86909c; font-size:11.5px;">${p.lastExecTime}</td>
        <td><strong style="color:#1d2129;">${p.cleanedCount}</strong></td>
        <td class="text-center">
          <a href="javascript:void(0)" class="action-link" onclick="openEditModal(${p.id})">编辑</a>
          <a href="javascript:void(0)" class="action-link trigger-btn" onclick="triggerManualClean(${p.id})">立即执行</a>
          <a href="javascript:void(0)" class="action-link" onclick="jumpToPolicyLogs('${escapeHtml(p.name)}')">日志</a>
          <a href="javascript:void(0)" class="action-link danger" onclick="deletePolicy(${p.id})">删除</a>
        </td>
      </tr>
    `;
  }).join("");
  document.getElementById("total-count").innerText = list.length;
}

// 弹窗交互绑定
let currentEditingId = null;

function bindModalEvents() {
  const policyModal = document.getElementById("policyModal");
  const btnAddPolicy = document.getElementById("btn-add-policy");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const btnCancelPolicy = document.getElementById("btn-cancel-policy");
  const btnSavePolicy = document.getElementById("btn-save-policy");
  const formScopeType = document.getElementById("form-scope-type");
  const scopeDetailWrap = document.getElementById("scopeDetailWrap");
  const modalRuleHintIcon = document.getElementById("modalRuleHintIcon");

  // 打开新增弹窗
  btnAddPolicy.addEventListener("click", () => {
    currentEditingId = null;
    document.getElementById("modalTitle").innerText = "策略配置 - 新增邮件生命周期策略";
    document.getElementById("policyForm").reset();
    document.getElementById("form-retention-years").value = "3";
    document.getElementById("form-retention-months").value = "0";
    document.getElementById("form-retention-days").value = "0";
    document.getElementById("form-policy-status").checked = true;
    scopeDetailWrap.style.display = "none";
    policyModal.classList.add("open");
  });

  // 关闭弹窗
  const closeModal = () => {
    policyModal.classList.remove("open");
  };
  modalCloseBtn.addEventListener("click", closeModal);
  btnCancelPolicy.addEventListener("click", closeModal);

  // 适用范围联动输入框
  formScopeType.addEventListener("change", (e) => {
    if (e.target.value === "全部邮件") {
      scopeDetailWrap.style.display = "none";
    } else {
      scopeDetailWrap.style.display = "block";
      const targetInput = document.getElementById("form-scope-target");
      if (e.target.value === "指定部门") {
        targetInput.placeholder = "请输入部门名称，如：研发中心, 运营部";
      } else if (e.target.value === "指定账户") {
        targetInput.placeholder = "请输入邮箱账号，如：zhangsan@east.net";
      } else if (e.target.value === "指定域名") {
        targetInput.placeholder = "请输入域名，如：@east.net, @partner.cn";
      }
    }
  });

  // 弹窗内问号图标点击/Hover说明
  modalRuleHintIcon.addEventListener("click", () => {
    showToast("多方判定说明：若发件人、收件人策略不一致，必须各方均满足删除期限才会彻底删除！", "info");
  });

  // 保存策略
  btnSavePolicy.addEventListener("click", () => {
    const name = document.getElementById("form-policy-name").value.trim();
    if (!name) {
      alert("请输入策略名称！");
      return;
    }

    const scopeType = formScopeType.value;
    let scopeTarget = "全员企业邮箱";
    if (scopeType !== "全部邮件") {
      scopeTarget = document.getElementById("form-scope-target").value.trim() || "未指定具体对象";
    }

    const years = parseInt(document.getElementById("form-retention-years").value) || 0;
    const months = parseInt(document.getElementById("form-retention-months").value) || 0;
    const days = parseInt(document.getElementById("form-retention-days").value) || 0;

    if (years === 0 && months === 0 && days === 0) {
      alert("保存周期不能全为0，请至少设置指定天数、月数或年限！");
      return;
    }

    const status = document.getElementById("form-policy-status").checked;

    if (currentEditingId) {
      // 编辑
      const p = policies.find(item => item.id === currentEditingId);
      if (p) {
        p.name = name;
        p.scopeType = scopeType;
        p.scopeTarget = scopeTarget;
        p.years = years;
        p.months = months;
        p.days = days;
        p.status = status;
      }
      showToast("生命周期策略更新成功！", "success");
    } else {
      // 新增
      const newPolicy = {
        id: Date.now(),
        name,
        scopeType,
        scopeTarget,
        years,
        months,
        days,
        cleanBody: true,
        cleanEs: true,
        execRule: "每日 02:00 自动执行",
        status,
        lastExecTime: "尚未执行",
        cleanedCount: "0 封"
      };
      policies.unshift(newPolicy);
      showToast("新生命周期策略创建成功并已纳入调度队列！", "success");
    }

    closeModal();
    renderPolicyTable();
  });
}

// 打开编辑弹窗
window.openEditModal = function(id) {
  const p = policies.find(item => item.id === id);
  if (!p) return;

  currentEditingId = id;
  document.getElementById("modalTitle").innerText = `策略配置 - 编辑：${p.name}`;
  document.getElementById("form-policy-name").value = p.name;
  document.getElementById("form-scope-type").value = p.scopeType;
  
  const scopeDetailWrap = document.getElementById("scopeDetailWrap");
  if (p.scopeType !== "全部邮件") {
    scopeDetailWrap.style.display = "block";
    document.getElementById("form-scope-target").value = p.scopeTarget;
  } else {
    scopeDetailWrap.style.display = "none";
  }

  document.getElementById("form-retention-years").value = p.years;
  document.getElementById("form-retention-months").value = p.months;
  document.getElementById("form-retention-days").value = p.days;
  document.getElementById("form-policy-status").checked = p.status;

  document.getElementById("policyModal").classList.add("open");
};

// 删除策略
window.deletePolicy = function(id) {
  if (confirm("确定要删除该生命周期策略吗？删除后相关到期邮件将停止自动清理。")) {
    policies = policies.filter(p => p.id !== id);
    renderPolicyTable();
    showToast("策略已删除！", "info");
  }
};

// 立即手动触发执行
window.triggerManualClean = function(id) {
  const p = policies.find(item => item.id === id);
  if (!p) return;

  showToast(`已开始手动调度执行【${p.name}】，系统正在扫描ES及本地邮件...`, "info");
  setTimeout(() => {
    const cleanedNum = Math.floor(Math.random() * 800) + 120;
    p.lastExecTime = new Date().toLocaleString("zh-CN", { hour12: false });
    p.cleanedCount = (parseInt(p.cleanedCount.replace(/[^0-9]/g, "")) + cleanedNum) + " 封";
    
    // 生成一条新日志
    const newLog = {
      batchId: `MANUAL-${Date.now().toString().slice(-6)}`,
      policyName: p.name,
      startTime: new Date(Date.now() - 35000).toLocaleTimeString("zh-CN", { hour12: false }),
      endTime: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
      scannedCount: cleanedNum.toString(),
      deletedBodyCount: `${cleanedNum} 封`,
      cleanedEsCount: `${cleanedNum} 条`,
      releasedSpace: `${(cleanedNum * 1.8).toFixed(1)} MB`,
      status: "成功"
    };
    logs.unshift(newLog);
    renderPolicyTable();
    renderLogTable();

    showToast(`执行完成！本次共成功删除 ${cleanedNum} 封邮件本体并清空ES索引，已记录审计日志。`, "success");
  }, 1200);
};

// 从策略直达日志Tab并筛选
window.jumpToPolicyLogs = function(policyName) {
  switchTab("lifecycle-log");
  const keywordInput = document.getElementById("search-log-keyword");
  if (keywordInput) {
    keywordInput.value = policyName;
    const filtered = logs.filter(l => l.policyName.includes(policyName));
    renderLogTable(filtered);
  }
};

// 日志检索与明细
function bindLogEvents() {
  const btnQueryLog = document.getElementById("btn-query-log");
  const btnResetLog = document.getElementById("btn-reset-log");
  const btnExportLog = document.getElementById("btn-export-log");
  const detailModal = document.getElementById("detailModal");
  const detailCloseBtn = document.getElementById("detailCloseBtn");
  const detailOkBtn = document.getElementById("detailOkBtn");

  if (btnQueryLog) {
    btnQueryLog.addEventListener("click", () => {
      const kw = document.getElementById("search-log-keyword").value.trim().toLowerCase();
      const status = document.getElementById("search-log-status").value;
      const res = logs.filter(l => {
        const mKw = !kw || 
          l.policyName.toLowerCase().includes(kw) || 
          l.batchId.toLowerCase().includes(kw) ||
          (l.policyId && l.policyId.toLowerCase().includes(kw)) ||
          (l.originalName && l.originalName.toLowerCase().includes(kw));
        const mStatus = !status || l.status === status;
        return mKw && mStatus;
      });
      renderLogTable(res);
      showToast(`已按条件筛选出 ${res.length} 条清理日志`, "info");
    });
  }

  if (btnResetLog) {
    btnResetLog.addEventListener("click", () => {
      document.getElementById("search-log-keyword").value = "";
      document.getElementById("search-log-status").value = "";
      renderLogTable(logs);
    });
  }

  if (btnExportLog) {
    btnExportLog.addEventListener("click", () => {
      showToast("生命周期审计清理日志导出中，即将开始下载 CSV 格式报表...", "success");
    });
  }

  const closeDetail = () => detailModal.classList.remove("open");
  if (detailCloseBtn) detailCloseBtn.addEventListener("click", closeDetail);
  if (detailOkBtn) detailOkBtn.addEventListener("click", closeDetail);
}

// 打开日志详情抽样记录弹窗
window.openLogDetail = function(batchId, policyName) {
  const detailModal = document.getElementById("detailModal");
  document.getElementById("detailBatchId").innerText = batchId;
  document.getElementById("detailPolicyName").innerText = policyName;

  // 构造模拟抽样清单数据
  const sampleData = [
    { title: "【项目周报】关于2023年Q3数据中心迁移总结", from: "wang.wu@east.net", to: "dev-team@east.net", date: "2023-08-15 14:22:01", path: "/data/archive/202308/mail_991823.eml", esId: "doc_a98218", res: "本体彻底删除，ES文档已销毁" },
    { title: "采购合同电子凭据及付款发票扫描件", from: "billing@east.net", to: "chen.qi@east.net", date: "2023-08-14 09:15:33", path: "/data/archive/202308/mail_991804.eml", esId: "doc_a98104", res: "本体彻底删除，ES文档已销毁" },
    { title: "2023年度上半年员工绩效考评确认通知", from: "hr@east.net", to: "all-staff@east.net", date: "2023-08-10 18:00:12", path: "/data/archive/202308/mail_991421.eml", esId: "doc_a98002", res: "本体彻底删除，ES文档已销毁" },
    { title: "Re: 供应商系统对接联调日志与API凭据", from: "support@east.net", to: "tech-lead@east.net", date: "2023-08-01 11:30:45", path: "/data/archive/202308/mail_990119.eml", esId: "doc_a97531", res: "本体彻底删除，ES文档已销毁" }
  ];

  const tbody = document.getElementById("detailSampleTableBody");
  tbody.innerHTML = sampleData.map(item => `
    <tr>
      <td><strong>${item.title}</strong></td>
      <td><code>${item.from}</code></td>
      <td><code>${item.to}</code></td>
      <td>${item.date}</td>
      <td style="font-family:monospace; color:#86909c;">${item.path}</td>
      <td style="font-family:monospace; color:#165dff;">${item.esId}</td>
      <td><span style="color:#00b42a; font-size:11px;"><i class="fa-solid fa-circle-check"></i> ${item.res}</span></td>
    </tr>
  `).join("");

  detailModal.classList.add("open");
};

// 简易轻量级 Toast 提示
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
