/**
 * ES Mail 本地邮件归档 - 邮件生命周期管理 (单一策略方案交互逻辑)
 * 特性：
 * 1. 仅维护唯一系统策略，无需策略名称、适用范围、多方冲突判定
 * 2. 全系统邮件统一按保存期限超期自动清理
 * 3. 生命周期主界面直接呈现系统配置与清理日志列表
 */

// 系统单一策略全局配置
let systemPolicy = {
  years: 3,
  months: 0,
  days: 0,
  cleanBody: true,
  cleanEs: true,
  execType: "auto", // 'auto' | 'manual'
  execTime: "02:00",
  status: true,
  lastExecTime: "2026-09-29 02:00:15"
};

// 系统清理执行审计日志
let logs = [
  {
    batchId: "TASK-20260929-0200",
    startTime: "2026-09-29 02:00:15",
    endTime: "2026-09-29 02:18:42",
    duration: "18 分 42 秒",
    scannedCount: "14,208",
    deletedBodyCount: "14,208 封",
    cleanedEsCount: "14,208 条",
    releasedSpace: "24.5 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260928-0200",
    startTime: "2026-09-28 02:00:11",
    endTime: "2026-09-28 02:21:05",
    duration: "20 分 54 秒",
    scannedCount: "16,420",
    deletedBodyCount: "16,420 封",
    cleanedEsCount: "16,420 条",
    releasedSpace: "28.1 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260927-0200",
    startTime: "2026-09-27 02:00:08",
    endTime: "2026-09-27 02:19:30",
    duration: "19 分 22 秒",
    scannedCount: "13,850",
    deletedBodyCount: "13,850 封",
    cleanedEsCount: "13,850 条",
    releasedSpace: "23.8 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260926-0200",
    startTime: "2026-09-26 02:00:18",
    endTime: "2026-09-26 02:20:45",
    duration: "20 分 27 秒",
    scannedCount: "15,100",
    deletedBodyCount: "15,100 封",
    cleanedEsCount: "15,100 条",
    releasedSpace: "25.9 GB",
    status: "成功"
  },
  {
    batchId: "TASK-20260925-0200",
    startTime: "2026-09-25 02:00:03",
    endTime: "2026-09-25 02:17:12",
    duration: "17 分 09 秒",
    scannedCount: "12,940",
    deletedBodyCount: "12,940 封",
    cleanedEsCount: "12,940 条",
    releasedSpace: "22.1 GB",
    status: "成功"
  }
];

// 抽样邮件明细模版数据
const sampleEmails = [
  { subject: "关于2023年第三季度企业安全与网络维护通知", sender: "security@east.net", recipient: "all@east.net", time: "2023-09-18 10:20:14", path: "/data/mail_eml/2023/09/18/EML_92810.eml", esId: "doc_es_92810", result: "本体销毁 + ES元数据清除" },
  { subject: "Re: 业务系统升级停机维护公告及操作指引", sender: "ops-notice@east.net", recipient: "tech-team@east.net", time: "2023-09-19 14:15:33", path: "/data/mail_eml/2023/09/19/EML_92855.eml", esId: "doc_es_92855", result: "本体销毁 + ES元数据清除" },
  { subject: "供应商合同终审稿与盖章扫描件回执", sender: "procure@east.net", recipient: "supply_vendor@partner.com", time: "2023-09-20 09:40:02", path: "/data/mail_eml/2023/09/20/EML_92901.eml", esId: "doc_es_92901", result: "本体销毁 + ES元数据清除" },
  { subject: "内部管理制度修订宣贯会议纪要及录音", sender: "hr@east.net", recipient: "dept_heads@east.net", time: "2023-09-21 16:30:19", path: "/data/mail_eml/2023/09/21/EML_92944.eml", esId: "doc_es_92944", result: "本体销毁 + ES元数据清除" },
  { subject: "周报：研发二组产品迭代与代码审查汇报", sender: "dev_lead@east.net", recipient: "pm@east.net", time: "2023-09-22 18:05:50", path: "/data/mail_eml/2023/09/22/EML_93012.eml", esId: "doc_es_93012", result: "本体销毁 + ES元数据清除" },
  { subject: "差旅报销单据审批完成告知函", sender: "finance-bot@east.net", recipient: "wangli@east.net", time: "2023-09-23 11:22:45", path: "/data/mail_eml/2023/09/23/EML_93108.eml", esId: "doc_es_93108", result: "本体销毁 + ES元数据清除" },
  { subject: "客户满意度问卷回执及服务改进建议汇总", sender: "customer_care@east.net", recipient: "service_gm@east.net", time: "2023-09-24 15:10:09", path: "/data/mail_eml/2023/09/24/EML_93202.eml", esId: "doc_es_93202", result: "本体销毁 + ES元数据清除" }
];

// DOM 加载完成时初始化
document.addEventListener("DOMContentLoaded", () => {
  renderPolicyBanner();
  renderLogTable(logs);
  bindNavigationEvents();
  bindModalEvents();
  bindLogEvents();
  bindPopover();
});

// 1. 渲染系统单一策略 Banner 信息
function renderPolicyBanner() {
  document.getElementById("displayYears").innerText = systemPolicy.years;
  document.getElementById("displayMonths").innerText = systemPolicy.months;
  document.getElementById("displayDays").innerText = systemPolicy.days;

  const execRuleText = systemPolicy.execType === "auto"
    ? `每日 ${systemPolicy.execTime} 定时自动清理`
    : `仅手动触发执行`;
  document.getElementById("displayExecRule").innerText = execRuleText;
  document.getElementById("displayLastExecTime").innerText = systemPolicy.lastExecTime;

  // 状态指示
  const bannerTag = document.getElementById("bannerStatusTag");
  const bannerText = document.getElementById("bannerStatusText");
  const statStatus = document.getElementById("stat-policy-status");

  if (systemPolicy.status) {
    bannerTag.className = "banner-status-tag active";
    bannerText.innerText = systemPolicy.execType === "auto" ? "运行中 (定时调度)" : "运行中 (手动模式)";
    statStatus.innerText = "已启用";
    statStatus.style.color = "var(--success-color)";
  } else {
    bannerTag.className = "banner-status-tag inactive";
    bannerText.innerText = "已停用 (暂停调度)";
    statStatus.innerText = "已停用";
    statStatus.style.color = "var(--text-muted)";
  }
}

// 2. 渲染清理日志列表
function renderLogTable(data) {
  const tbody = document.getElementById("log-table-body");
  const secTbody = document.getElementById("secondary-log-table-body");
  const totalSpan = document.getElementById("log-total-count");

  if (totalSpan) totalSpan.innerText = data.length;

  if (data.length === 0) {
    const emptyRow = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#86909c;">暂无符合条件的清理日志记录</td></tr>`;
    if (tbody) tbody.innerHTML = emptyRow;
    if (secTbody) secTbody.innerHTML = emptyRow;
    return;
  }

  const html = data.map(item => {
    let statusBadge = '<span class="status-badge success"><span class="badge-dot"></span> 执行成功</span>';
    if (item.status === "执行中") {
      statusBadge = '<span class="status-badge running"><span class="badge-dot"></span> 正在执行</span>';
    } else if (item.status === "部分完成") {
      statusBadge = '<span class="status-badge warning"><span class="badge-dot"></span> 部分完成</span>';
    }

    return `
      <tr>
        <td><strong>${item.batchId}</strong></td>
        <td>${item.startTime}</td>
        <td>${item.endTime}</td>
        <td><span style="font-weight:600;">${item.scannedCount}</span> 封</td>
        <td><span style="color:#2875f0;">${item.deletedBodyCount}</span></td>
        <td><span style="color:#00b42a;">${item.cleanedEsCount}</span></td>
        <td><span style="font-weight:600; color:#ff7d00;">${item.releasedSpace}</span></td>
        <td>${statusBadge}</td>
        <td class="text-center">
          <button class="action-btn" onclick="showLogDetail('${item.batchId}')">
            <i class="fa-regular fa-file-lines"></i> 抽样明细
          </button>
        </td>
      </tr>
    `;
  }).join("");

  if (tbody) tbody.innerHTML = html;
  if (secTbody) secTbody.innerHTML = html;
}

// 3. 导航与标签页交互
function bindNavigationEvents() {
  const viewLifecycle = document.getElementById("view-lifecycle");
  const viewLifecycleLog = document.getElementById("view-lifecycle-log");

  const menuLifecycle = document.getElementById("menu-lifecycle");
  const menuLifecycleLog = document.getElementById("menu-lifecycle-log");

  const tabLifecycle = document.querySelector('.tab-item[data-tab="lifecycle"]');
  const tabLifecycleLog = document.querySelector('.tab-item[data-tab="lifecycle-log"]');

  function switchToLifecycle() {
    viewLifecycle.classList.add("active");
    viewLifecycleLog.classList.remove("active");

    tabLifecycle.classList.add("active");
    tabLifecycleLog.classList.remove("active");

    menuLifecycle.classList.add("active");
    menuLifecycleLog.classList.remove("active");
  }

  function switchToLifecycleLog() {
    viewLifecycle.classList.remove("active");
    viewLifecycleLog.classList.add("active");

    tabLifecycle.classList.remove("active");
    tabLifecycleLog.classList.add("active");

    menuLifecycle.classList.remove("active");
    menuLifecycleLog.classList.add("active");
  }

  if (menuLifecycle) menuLifecycle.addEventListener("click", switchToLifecycle);
  if (menuLifecycleLog) menuLifecycleLog.addEventListener("click", switchToLifecycleLog);

  if (tabLifecycle) tabLifecycle.addEventListener("click", switchToLifecycle);
  if (tabLifecycleLog) tabLifecycleLog.addEventListener("click", switchToLifecycleLog);

  const backBtn = document.getElementById("btn-back-to-lifecycle");
  if (backBtn) backBtn.addEventListener("click", switchToLifecycle);

  // 菜单展开/收起
  document.querySelectorAll(".sub-toggle").forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      const parent = toggle.closest(".has-sub");
      parent.classList.toggle("open");
      const subMenu = parent.querySelector(".sub-menu");
      if (subMenu) {
        subMenu.classList.toggle("show");
      }
    });
  });
}

// 4. 弹窗与设置逻辑
function bindModalEvents() {
  const policyModal = document.getElementById("policyModal");
  const btnEditPolicy = document.getElementById("btn-edit-policy");
  const btnBannerEdit = document.getElementById("btn-banner-edit");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const btnCancelPolicy = document.getElementById("btn-cancel-policy");
  const btnSavePolicy = document.getElementById("btn-save-policy");

  const formYears = document.getElementById("form-retention-years");
  const formMonths = document.getElementById("form-retention-months");
  const formDays = document.getElementById("form-retention-days");
  const formExecTime = document.getElementById("form-exec-time");
  const formStatus = document.getElementById("form-policy-status");
  const statusTipText = document.getElementById("statusTipText");

  // 打开弹窗并回填数据
  function openPolicyModal() {
    formYears.value = systemPolicy.years;
    formMonths.value = systemPolicy.months;
    formDays.value = systemPolicy.days;
    formExecTime.value = systemPolicy.execTime;
    formStatus.checked = systemPolicy.status;

    const radio = document.querySelector(`input[name="execRule"][value="${systemPolicy.execType}"]`);
    if (radio) radio.checked = true;

    toggleExecTimeRow(systemPolicy.execType === "auto");
    updateStatusTip();
    policyModal.classList.add("show");
  }

  function closePolicyModal() {
    policyModal.classList.remove("show");
  }

  if (btnEditPolicy) btnEditPolicy.addEventListener("click", openPolicyModal);
  if (btnBannerEdit) btnBannerEdit.addEventListener("click", openPolicyModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closePolicyModal);
  if (btnCancelPolicy) btnCancelPolicy.addEventListener("click", closePolicyModal);

  // 执行规则单选联动
  document.querySelectorAll('input[name="execRule"]').forEach(r => {
    r.addEventListener("change", (e) => {
      toggleExecTimeRow(e.target.value === "auto");
    });
  });

  function toggleExecTimeRow(show) {
    const row = document.getElementById("execTimeRow");
    if (row) row.style.display = show ? "flex" : "none";
  }

  // 状态开关联动提示
  if (formStatus) {
    formStatus.addEventListener("change", updateStatusTip);
  }

  function updateStatusTip() {
    if (formStatus.checked) {
      statusTipText.innerText = "开启（到期邮件将在设定的调度时段自动清理）";
      statusTipText.style.color = "var(--text-regular)";
    } else {
      statusTipText.innerText = "关闭（系统将暂停生命周期自动清理调度）";
      statusTipText.style.color = "var(--danger-color)";
    }
  }

  // 保存策略
  if (btnSavePolicy) {
    btnSavePolicy.addEventListener("click", () => {
      const y = parseInt(formYears.value, 10) || 0;
      const m = parseInt(formMonths.value, 10) || 0;
      const d = parseInt(formDays.value, 10) || 0;

      if (y === 0 && m === 0 && d === 0) {
        showToast("保存时间不能全为0，请至少设定大于0天！", "warning");
        return;
      }

      const execRuleVal = document.querySelector('input[name="execRule"]:checked').value;
      const execTimeVal = formExecTime.value || "02:00";
      const statusVal = formStatus.checked;

      // 更新系统全局策略
      systemPolicy.years = y;
      systemPolicy.months = m;
      systemPolicy.days = d;
      systemPolicy.execType = execRuleVal;
      systemPolicy.execTime = execTimeVal;
      systemPolicy.status = statusVal;

      renderPolicyBanner();
      closePolicyModal();
      showToast("系统邮件生命周期策略保存成功！", "success");
    });
  }

  // 手动触发立即清理
  const btnManualTrigger = document.getElementById("btn-manual-trigger");
  if (btnManualTrigger) {
    btnManualTrigger.addEventListener("click", () => {
      if (confirm("是否立即执行一次全系统邮件生命周期清理？\n将按当前设定的保存期限（超期邮件）进行物理删除与ES索引销毁。")) {
        triggerManualCleanJob();
      }
    });
  }

  // 详情弹窗关闭
  const detailModal = document.getElementById("detailModal");
  const detailCloseBtn = document.getElementById("detailCloseBtn");
  const detailOkBtn = document.getElementById("detailOkBtn");

  function closeDetailModal() {
    detailModal.classList.remove("show");
  }

  if (detailCloseBtn) detailCloseBtn.addEventListener("click", closeDetailModal);
  if (detailOkBtn) detailOkBtn.addEventListener("click", closeDetailModal);
}

// 5. 立即手动执行清理任务模拟
function triggerManualCleanJob() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const batchId = `TASK-${dateStr}-MANUAL-${timeStr.slice(0, 4)}`;

  const startTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  
  // 增加2分钟作为结束时间
  const endTime = new Date(now.getTime() + 124 * 1000);
  const endTimeStr = `${endTime.getFullYear()}-${pad(endTime.getMonth() + 1)}-${pad(endTime.getDate())} ${pad(endTime.getHours())}:${pad(endTime.getMinutes())}:${pad(endTime.getSeconds())}`;

  const newLog = {
    batchId: batchId,
    startTime: startTimeStr,
    endTime: endTimeStr,
    duration: "2 分 04 秒",
    scannedCount: "826",
    deletedBodyCount: "826 封",
    cleanedEsCount: "826 条",
    releasedSpace: "1.42 GB",
    status: "成功"
  };

  logs.unshift(newLog);
  systemPolicy.lastExecTime = startTimeStr;
  renderPolicyBanner();
  renderLogTable(logs);

  showToast(`手动清理完成！共销毁 826 封到期邮件，释放 1.42 GB 空间。`, "success");
}

// 6. 日志检索与筛选
function bindLogEvents() {
  const btnQuery = document.getElementById("btn-query-log");
  const btnReset = document.getElementById("btn-reset-log");
  const btnExport = document.getElementById("btn-export-log");

  const searchKeyword = document.getElementById("search-log-keyword");
  const searchStatus = document.getElementById("search-log-status");

  if (btnQuery) {
    btnQuery.addEventListener("click", () => {
      const kw = searchKeyword.value.trim().toLowerCase();
      const status = searchStatus.value;

      const filtered = logs.filter(item => {
        const matchKw = !kw || item.batchId.toLowerCase().includes(kw);
        const matchStatus = !status || item.status === status;
        return matchKw && matchStatus;
      });

      renderLogTable(filtered);
      showToast(`筛选完成，共匹配到 ${filtered.length} 条清理批次记录`, "success");
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      searchKeyword.value = "";
      searchStatus.value = "";
      renderLogTable(logs);
      showToast("已重置所有检索筛选条件", "success");
    });
  }

  if (btnExport) {
    btnExport.addEventListener("click", () => {
      showToast("已生成导出文件：Lifecycle_Clean_Audit_Report.csv", "success");
    });
  }
}

// 7. Popover 提示卡片
function bindPopover() {
  const hintBox = document.getElementById("hintBox");
  const popover = document.getElementById("rulePopover");

  if (!hintBox || !popover) return;

  hintBox.addEventListener("mouseenter", () => {
    popover.classList.add("show");
  });

  hintBox.addEventListener("mouseleave", () => {
    popover.classList.remove("show");
  });

  // 支持点击切换
  hintBox.querySelector(".hint-tag").addEventListener("click", (e) => {
    e.stopPropagation();
    popover.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!hintBox.contains(e.target)) {
      popover.classList.remove("show");
    }
  });
}

// 8. 查看抽样明细详情
window.showLogDetail = function(batchId) {
  const item = logs.find(l => l.batchId === batchId);
  if (!item) return;

  document.getElementById("detailBatchId").innerText = item.batchId;
  document.getElementById("detailDuration").innerText = item.duration;
  document.getElementById("detailSpace").innerText = item.releasedSpace;
  document.getElementById("detailEs").innerText = item.cleanedEsCount;

  // 渲染表格
  const tbody = document.getElementById("detailSampleTableBody");
  tbody.innerHTML = sampleEmails.map((mail, idx) => `
    <tr>
      <td><span style="font-weight:500;">${mail.subject}</span></td>
      <td>${mail.sender}</td>
      <td>${mail.recipient}</td>
      <td>${mail.time}</td>
      <td><span style="font-family:monospace; font-size:11px; color:#64748b;">${mail.path}</span></td>
      <td><span style="font-family:monospace; font-size:11px; color:#2875f0;">${mail.esId}</span></td>
      <td><span class="status-badge success" style="font-size:11px;"><i class="fa-solid fa-check"></i> ${mail.result}</span></td>
    </tr>
  `).join("");

  document.getElementById("detailModal").classList.add("show");
};

// 9. Toast 提示工具
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "fa-circle-check" : "fa-triangle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
