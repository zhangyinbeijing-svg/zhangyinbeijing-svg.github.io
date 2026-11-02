/**
 * 景安 ES Mail 本地邮件归档 - 账户管理交互逻辑 (app.js)
 * 1. 账户管理列表页严格维持原参考图页面结构 (9列，含状态值 • 开启)
 * 2. 账户新增和编辑弹窗中，管理域名提升为独立一级模块（先设置管理域名，再设置搜索和审计限制）
 * 3. 完整支持状态切换与多域判定规则
 */

document.addEventListener("DOMContentLoaded", function () {
  // ================= 1. 系统预置数据 =================
  
  // 系统已识别与归档的企业域名
  const ARCHIVED_DOMAINS = [
    "east.net",
    "corp-a.com",
    "dev.cn",
    "subsidiary-b.com",
    "finance.com.cn",
    "headquarters.com"
  ];

  // 账户初始数据 (包含截图参考的富创测试以及林蕾等经典数据)
  let accounts = [
    {
      id: 1,
      realname: "富创测试",
      username: "admin03",
      roles: ["超级管理员"],
      email: "ceshi@163.com",
      phone: "15222457079",
      loginVerify: false,
      expireTime: "2026-10-31 00:00",
      status: true, // 状态：开启
      domainMode: "SPECIFIED",
      domains: ["east.net"],
      searchKeywords: "",
      searchRecipientMode: "DENY",
      searchRecipients: "",
      auditKeywords: "",
      auditRecipientMode: "DENY",
      auditRecipients: ""
    },
    {
      id: 2,
      realname: "林蕾",
      username: "linlei",
      roles: ["搜索员", "审计员"],
      email: "linlei@east.net",
      phone: "13552016127",
      loginVerify: false,
      expireTime: "2026-03-12 00:00",
      status: true, // 状态：开启
      domainMode: "SPECIFIED", // ALL 或 SPECIFIED
      domains: ["east.net"],
      searchKeywords: "",
      searchRecipientMode: "DENY",
      searchRecipients: "",
      auditKeywords: "",
      auditRecipientMode: "DENY",
      auditRecipients: ""
    },
    {
      id: 3,
      realname: "zyss",
      username: "zyss",
      roles: ["搜索员"],
      email: "zyss@corp-a.com",
      phone: "13800138000",
      loginVerify: false,
      expireTime: "2026-12-31 00:00",
      status: true,
      domainMode: "SPECIFIED",
      domains: ["corp-a.com", "dev.cn"],
      searchKeywords: "",
      searchRecipientMode: "DENY",
      searchRecipients: "",
      auditKeywords: "",
      auditRecipientMode: "DENY",
      auditRecipients: ""
    },
    {
      id: 4,
      realname: "qirui",
      username: "qirui",
      roles: ["审计员", "系统管理员"],
      email: "qirui@jingan.com",
      phone: "13912345678",
      loginVerify: false,
      expireTime: "2027-01-01 00:00",
      status: true,
      domainMode: "ALL",
      domains: [],
      searchKeywords: "",
      searchRecipientMode: "DENY",
      searchRecipients: "",
      auditKeywords: "",
      auditRecipientMode: "DENY",
      auditRecipients: ""
    },
    {
      id: 5,
      realname: "admin",
      username: "admin",
      roles: ["超级管理员"],
      email: "admin@esmail.local",
      phone: "18888888888",
      loginVerify: false,
      expireTime: "永久有效",
      status: true,
      domainMode: "ALL",
      domains: [],
      searchKeywords: "",
      searchRecipientMode: "DENY",
      searchRecipients: "",
      auditKeywords: "",
      auditRecipientMode: "DENY",
      auditRecipients: ""
    }
  ];

  // 当前编辑的账户 ID
  let currentEditingId = null;

  // 表单临时选中的角色列表
  let formSelectedRoles = ["搜索员"];

  // 管理域名临时 Tag 数组
  let formAccountDomains = ["east.net"];

  // ================= 2. DOM 元素获取 =================
  const accountTableBody = document.getElementById("account-table-body");
  const tableTotalCount = document.getElementById("table-total-count");
  const filterUserInput = document.getElementById("filter-user-input");
  const btnSearchUser = document.getElementById("btn-search-user");
  const btnAddAccount = document.getElementById("btn-add-account");

  // 弹窗相关
  const accountModal = document.getElementById("account-modal");
  const modalTitleText = document.getElementById("modal-title-text");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");
  const btnSaveAccount = document.getElementById("btn-save-account");

  // 表单基础控件 (对齐截图)
  const formRealname = document.getElementById("form-realname");
  const formAccountStatus = document.getElementById("form-account-status");
  const formUsername = document.getElementById("form-username");
  const formPassword = document.getElementById("form-password");
  const formLoginVerify = document.getElementById("form-login-verify");
  const formEmail = document.getElementById("form-email");
  const formExpireTime = document.getElementById("form-expire-time");
  const formPhone = document.getElementById("form-phone");

  // 角色下拉多选
  const roleSelectBox = document.getElementById("role-select-box");
  const roleTagsWrap = document.getElementById("role-tags-wrap");
  const roleDropdownMenu = document.getElementById("role-dropdown-menu");

  // 同级模块 1：管理域名
  const sectionDomainManagement = document.getElementById("section-domain-management");
  const accountDomainModeAll = document.getElementById("account-domain-mode-all");
  const accountDomainModeSpecified = document.getElementById("account-domain-mode-specified");
  const accountDomainScopeBox = document.getElementById("account-domain-scope-box");
  const accountDomainTagsContainer = document.getElementById("account-domain-tags-container");
  const inputAccountDomain = document.getElementById("input-account-domain");
  const btnQuickFillEmailDomain = document.getElementById("btn-quick-fill-email-domain");
  const btnOpenDomainPicker = document.getElementById("btn-open-domain-picker");
  const domainPickerDropdown = document.getElementById("domain-picker-dropdown");
  const domainPickerList = document.getElementById("domain-picker-list");

  // 同级模块 2：搜索限制
  const sectionSearchRestriction = document.getElementById("section-search-restriction");
  const formSearchKeywords = document.getElementById("form-search-keywords");
  const searchKeywordsCounter = document.getElementById("search-keywords-counter");
  const formSearchRecipients = document.getElementById("form-search-recipients");
  const searchRecipientsCounter = document.getElementById("search-recipients-counter");

  // 同级模块 3：审计限制
  const sectionAuditRestriction = document.getElementById("section-audit-restriction");
  const formAuditKeywords = document.getElementById("form-audit-keywords");
  const auditKeywordsCounter = document.getElementById("audit-keywords-counter");
  const formAuditRecipients = document.getElementById("form-audit-recipients");
  const auditRecipientsCounter = document.getElementById("audit-recipients-counter");

  // 提示 Toast
  const globalToast = document.getElementById("global-toast");
  const toastText = document.getElementById("toast-text");

  function showToast(msg, type = "success") {
    toastText.textContent = msg;
    globalToast.className = `toast-msg show ${type}`;
    setTimeout(() => {
      globalToast.className = "toast-msg";
    }, 2500);
  }

  // ================= 3. 账户管理列表页渲染 (严格对齐原截图) =================
  function renderAccountTable(data = accounts) {
    accountTableBody.innerHTML = "";
    if (data.length === 0) {
      accountTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 30px; color: var(--text-muted);">暂无符合条件的用户</td></tr>`;
      tableTotalCount.textContent = "共 0 条";
      return;
    }

    data.forEach(item => {
      const tr = document.createElement("tr");

      // 角色显示 (原截图直接文字或多角色逗号隔开，如 "搜索员, 审计员")
      const roleText = item.roles.join(", ");

      // 搜索限制关键词 (无则显示 "-")
      const searchKeywordsHtml = (item.roles.includes("搜索员") && item.searchKeywords)
        ? item.searchKeywords
        : "-";

      // 搜索限制收件人 (无则显示 "-")
      let searchRecipientHtml = "-";
      if (item.roles.includes("搜索员") && item.searchRecipients) {
        const modeLabel = item.searchRecipientMode === "DENY" ? "禁搜" : "可搜";
        searchRecipientHtml = `[${modeLabel}] ${item.searchRecipients}`;
      }

      // 审计限制关键词 (无则显示 "-")
      const auditKeywordsHtml = (item.roles.includes("审计员") && item.auditKeywords)
        ? item.auditKeywords
        : "-";

      // 审计限制收件人 (无则显示 "-")
      let auditRecipientHtml = "-";
      if (item.roles.includes("审计员") && item.auditRecipients) {
        const modeLabel = item.auditRecipientMode === "DENY" ? "禁搜" : "可搜";
        auditRecipientHtml = `[${modeLabel}] ${item.auditRecipients}`;
      }

      // 状态列 (原截图：绿点 + "开启"，灰点 + "停用")
      const statusHtml = item.status
        ? `<span class="status-cell active"><span class="status-dot"></span>开启</span>`
        : `<span class="status-cell inactive"><span class="status-dot"></span>停用</span>`;

      // 操作列 (原截图：编辑为蓝色，删除为红色；admin 仅有编辑)
      const actionHtml = item.username === "admin"
        ? `<button class="btn-table-action edit" data-id="${item.id}">编辑</button>`
        : `<button class="btn-table-action edit" data-id="${item.id}">编辑</button>
           <button class="btn-table-action delete" data-id="${item.id}">删除</button>`;

      tr.innerHTML = `
        <td>${item.realname}</td>
        <td>${item.username}</td>
        <td>${roleText}</td>
        <td>${searchKeywordsHtml}</td>
        <td>${searchRecipientHtml}</td>
        <td>${auditKeywordsHtml}</td>
        <td>${auditRecipientHtml}</td>
        <td>${statusHtml}</td>
        <td style="text-align: center;">${actionHtml}</td>
      `;

      accountTableBody.appendChild(tr);
    });

    tableTotalCount.textContent = `共 ${data.length} 条`;
    bindTableActionEvents();
  }

  // 绑定表格操作按钮
  function bindTableActionEvents() {
    document.querySelectorAll(".btn-table-action.edit").forEach(btn => {
      btn.onclick = function () {
        const id = parseInt(this.getAttribute("data-id"));
        openEditAccountModal(id);
      };
    });

    document.querySelectorAll(".btn-table-action.delete").forEach(btn => {
      btn.onclick = function () {
        const id = parseInt(this.getAttribute("data-id"));
        const target = accounts.find(a => a.id === id);
        if (target && confirm(`确定要删除用户【${target.realname} (${target.username})】吗？`)) {
          accounts = accounts.filter(a => a.id !== id);
          renderAccountTable();
          showToast("用户已删除", "success");
        }
      };
    });
  }

  // ================= 4. 角色与同级模块显隐联动 =================
  function renderRoleTags() {
    roleTagsWrap.innerHTML = "";
    formSelectedRoles.forEach(r => {
      const tag = document.createElement("span");
      tag.className = "role-tag";
      tag.innerHTML = `<span>${r}</span> <i class="fa-solid fa-xmark" data-role="${r}"></i>`;
      tag.querySelector("i").onclick = (e) => {
        e.stopPropagation();
        removeRole(r);
      };
      roleTagsWrap.appendChild(tag);
    });

    // 下拉框高亮
    document.querySelectorAll(".role-dropdown-item").forEach(item => {
      const r = item.getAttribute("data-role");
      const checkMark = item.querySelector(".check-mark");
      if (formSelectedRoles.includes(r)) {
        item.classList.add("selected");
        checkMark.style.visibility = "visible";
      } else {
        item.classList.remove("selected");
        checkMark.style.visibility = "hidden";
      }
    });

    // 三大同级模块始终常驻展示，完整呈现管理域名、搜索限制、审计限制
    sectionDomainManagement.style.display = "flex";
    sectionSearchRestriction.style.display = "flex";
    sectionAuditRestriction.style.display = "flex";
  }

  function addRole(role) {
    if (!formSelectedRoles.includes(role)) {
      formSelectedRoles.push(role);
      renderRoleTags();
    }
  }

  function removeRole(role) {
    if (formSelectedRoles.length <= 1) {
      showToast("账户必须至少具备一个角色", "warning");
      return;
    }
    formSelectedRoles = formSelectedRoles.filter(r => r !== role);
    renderRoleTags();
  }

  // 角色下拉框切换
  roleSelectBox.onclick = function (e) {
    roleDropdownMenu.classList.toggle("show");
  };

  document.querySelectorAll(".role-dropdown-item").forEach(item => {
    item.onclick = function (e) {
      e.stopPropagation();
      const role = this.getAttribute("data-role");
      if (formSelectedRoles.includes(role)) {
        removeRole(role);
      } else {
        addRole(role);
      }
    };
  });

  // 点击外部关闭弹层
  document.addEventListener("click", function (e) {
    if (!roleSelectBox.contains(e.target) && !roleDropdownMenu.contains(e.target)) {
      roleDropdownMenu.classList.remove("show");
    }
    if (!btnOpenDomainPicker.contains(e.target) && !domainPickerDropdown.contains(e.target)) {
      domainPickerDropdown.classList.remove("show");
    }
  });



  // ================= 5. 管理域名 Tag 录入与快捷操作 =================
  function renderAccountDomainTags() {
    accountDomainTagsContainer.querySelectorAll(".tag-badge").forEach(el => el.remove());
    formAccountDomains.forEach(domain => {
      const badge = document.createElement("span");
      badge.className = "tag-badge";
      badge.innerHTML = `<span>${domain}</span> <i class="fa-solid fa-xmark tag-remove" data-domain="${domain}"></i>`;
      badge.querySelector(".tag-remove").onclick = function () {
        removeAccountDomain(domain);
      };
      accountDomainTagsContainer.insertBefore(badge, inputAccountDomain);
    });
  }

  function addAccountDomain(domain) {
    if (!domain) return;
    domain = domain.trim().toLowerCase().replace(/^@/, "");
    if (!domain) return;

    // 简单校验域名格式
    const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    if (!domainRegex.test(domain) && !domain.startsWith("*.")) {
      showToast(`域名格式不符合规范: ${domain}`, "warning");
      return;
    }

    if (!formAccountDomains.includes(domain)) {
      formAccountDomains.push(domain);
      renderAccountDomainTags();
      inputAccountDomain.value = "";
    } else {
      showToast(`域名 ${domain} 已存在`, "warning");
    }
  }

  function removeAccountDomain(domain) {
    formAccountDomains = formAccountDomains.filter(d => d !== domain);
    renderAccountDomainTags();
  }

  // 键盘事件：回车、逗号、空格添加，Backspace删除
  inputAccountDomain.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === "," || e.key === "，" || e.key === " ") {
      e.preventDefault();
      addAccountDomain(this.value);
    } else if (e.key === "Backspace" && this.value === "") {
      if (formAccountDomains.length > 0) {
        formAccountDomains.pop();
        renderAccountDomainTags();
      }
    }
  });

  inputAccountDomain.addEventListener("blur", function () {
    if (this.value.trim()) {
      addAccountDomain(this.value);
    }
  });

  // 单选切换（不限制域名 vs 指定域名）
  accountDomainModeAll.onchange = function () {
    if (this.checked) {
      accountDomainScopeBox.style.display = "none";
    }
  };
  accountDomainModeSpecified.onchange = function () {
    if (this.checked) {
      accountDomainScopeBox.style.display = "flex";
    }
  };



  btnQuickFillEmailDomain.onclick = function () {
    const email = formEmail.value.trim();
    if (email && email.includes("@")) {
      const dom = email.split("@")[1];
      if (dom) {
        addAccountDomain(dom);
        showToast(`已快捷填入域名: ${dom}`, "success");
      }
    } else {
      showToast("请先在上方输入有效的验证邮箱", "warning");
    }
  };

  // 从系统已归档域名列表快速勾选
  btnOpenDomainPicker.onclick = function (e) {
    e.stopPropagation();
    renderDomainPickerList();
    domainPickerDropdown.classList.toggle("show");
  };

  function renderDomainPickerList() {
    domainPickerList.innerHTML = "";
    ARCHIVED_DOMAINS.forEach(dom => {
      const li = document.createElement("li");
      li.className = "domain-picker-item";
      const isChecked = formAccountDomains.includes(dom);
      li.innerHTML = `
        <input type="checkbox" ${isChecked ? "checked" : ""} style="pointer-events:none;">
        <span style="font-family: monospace;">${dom}</span>
      `;
      li.onclick = function (e) {
        e.stopPropagation();
        if (formAccountDomains.includes(dom)) {
          removeAccountDomain(dom);
        } else {
          addAccountDomain(dom);
        }
        renderDomainPickerList();
      };
      domainPickerList.appendChild(li);
    });
  }

  // 绑定文本计数器
  function bindTextareaCounter(textarea, counter) {
    textarea.addEventListener("input", function () {
      counter.textContent = `${this.value.length}/1000`;
    });
  }
  bindTextareaCounter(formSearchKeywords, searchKeywordsCounter);
  bindTextareaCounter(formSearchRecipients, searchRecipientsCounter);
  bindTextareaCounter(formAuditKeywords, auditKeywordsCounter);
  bindTextareaCounter(formAuditRecipients, auditRecipientsCounter);

  // 密码显示/隐藏
  const togglePwdVisibility = document.getElementById("toggle-pwd-visibility");
  togglePwdVisibility.onclick = function () {
    if (formPassword.type === "password") {
      formPassword.type = "text";
      this.className = "fa-regular fa-eye input-suffix-icon";
    } else {
      formPassword.type = "password";
      this.className = "fa-regular fa-eye-slash input-suffix-icon";
    }
  };

  // ================= 6. 弹窗打开、回填与保存 =================
  function openAddAccountModal() {
    currentEditingId = null;
    modalTitleText.textContent = "添加账户";
    formRealname.value = "";
    formAccountStatus.value = "true";
    formUsername.value = "";
    formUsername.disabled = false;
    formPassword.value = "";
    formLoginVerify.checked = false;
    formEmail.value = "";
    formExpireTime.value = "2026-10-31 00:00";
    formPhone.value = "";

    formSelectedRoles = ["搜索员"];
    renderRoleTags();

    // 管理域名默认：不限制域名（可管理全部归档域名）
    accountDomainModeAll.checked = true;
    accountDomainScopeBox.style.display = "none";
    formAccountDomains = [];
    renderAccountDomainTags();

    // 搜索限制
    formSearchKeywords.value = "";
    searchKeywordsCounter.textContent = "0/1000";
    document.querySelector("input[name='search-recipient-mode'][value='DENY']").checked = true;
    formSearchRecipients.value = "";
    searchRecipientsCounter.textContent = "0/1000";

    // 审计限制
    formAuditKeywords.value = "";
    auditKeywordsCounter.textContent = "0/1000";
    document.querySelector("input[name='audit-recipient-mode'][value='DENY']").checked = true;
    formAuditRecipients.value = "";
    auditRecipientsCounter.textContent = "0/1000";

    accountModal.classList.add("active");
  }

  function openEditAccountModal(id) {
    const target = accounts.find(a => a.id === id);
    if (!target) return;

    currentEditingId = id;
    modalTitleText.textContent = "修改账户";
    formRealname.value = target.realname || "";
    formAccountStatus.value = target.status !== false ? "true" : "false";
    formUsername.value = target.username;
    formUsername.disabled = target.username === "admin";
    formPassword.value = "";
    formLoginVerify.checked = !!target.loginVerify;
    formEmail.value = target.email;
    formExpireTime.value = target.expireTime;
    formPhone.value = target.phone;

    formSelectedRoles = [...target.roles];
    renderRoleTags();

    // 管理域名前置回填 (同级模块 1)
    if (target.domainMode === "ALL") {
      accountDomainModeAll.checked = true;
      accountDomainScopeBox.style.display = "none";
    } else {
      accountDomainModeSpecified.checked = true;
      accountDomainScopeBox.style.display = "flex";
    }
    formAccountDomains = [...(target.domains || [])];
    renderAccountDomainTags();

    // 搜索限制回填 (同级模块 2)
    formSearchKeywords.value = target.searchKeywords || "";
    searchKeywordsCounter.textContent = `${formSearchKeywords.value.length}/1000`;
    const rMode = target.searchRecipientMode || "DENY";
    document.querySelector(`input[name='search-recipient-mode'][value='${rMode}']`).checked = true;
    formSearchRecipients.value = target.searchRecipients || "";
    searchRecipientsCounter.textContent = `${formSearchRecipients.value.length}/1000`;

    // 审计限制回填 (同级模块 3)
    formAuditKeywords.value = target.auditKeywords || "";
    auditKeywordsCounter.textContent = `${formAuditKeywords.value.length}/1000`;
    const arMode = target.auditRecipientMode || "DENY";
    document.querySelector(`input[name='audit-recipient-mode'][value='${arMode}']`).checked = true;
    formAuditRecipients.value = target.auditRecipients || "";
    auditRecipientsCounter.textContent = `${formAuditRecipients.value.length}/1000`;

    accountModal.classList.add("active");
  }

  function closeModal() {
    accountModal.classList.remove("active");
  }

  btnAddAccount.onclick = openAddAccountModal;
  btnCloseModal.onclick = closeModal;
  btnCancelModal.onclick = closeModal;

  // 保存账户表单
  btnSaveAccount.onclick = function () {
    const realname = formRealname.value.trim();
    const username = formUsername.value.trim();
    const email = formEmail.value.trim();
    const phone = formPhone.value.trim();
    const status = formAccountStatus.value === "true";

    if (!realname) {
      showToast("请输入用户名称", "warning");
      formRealname.focus();
      return;
    }
    if (!username) {
      showToast("请输入登录账号", "warning");
      formUsername.focus();
      return;
    }
    if (!email) {
      showToast("请输入验证邮箱", "warning");
      formEmail.focus();
      return;
    }
    if (!phone) {
      showToast("请输入手机号", "warning");
      formPhone.focus();
      return;
    }

    // 管理域名校验 (如果具备搜索员或审计员，且选择指定域名)
    const hasSearcherOrAuditor = formSelectedRoles.includes("搜索员") || formSelectedRoles.includes("审计员");
    let dMode = "ALL";
    let dList = [];
    if (hasSearcherOrAuditor) {
      dMode = accountDomainModeSpecified.checked ? "SPECIFIED" : "ALL";
      if (dMode === "SPECIFIED") {
        if (formAccountDomains.length === 0) {
          showToast("请在管理域名中至少添加一个域名，或选择‘不限制域名’", "warning");
          return;
        }
        dList = [...formAccountDomains];
      }
    }

    if (currentEditingId) {
      // 修改现有
      const target = accounts.find(a => a.id === currentEditingId);
      if (target) {
        target.realname = realname;
        target.roles = [...formSelectedRoles];
        target.email = email;
        target.phone = phone;
        target.loginVerify = formLoginVerify.checked;
        target.expireTime = formExpireTime.value;
        target.status = status;
        // 管理域名
        target.domainMode = dMode;
        target.domains = dList;
        // 搜索限制
        target.searchKeywords = formSearchKeywords.value.trim();
        target.searchRecipientMode = document.querySelector("input[name='search-recipient-mode']:checked").value;
        target.searchRecipients = formSearchRecipients.value.trim();
        // 审计限制
        target.auditKeywords = formAuditKeywords.value.trim();
        target.auditRecipientMode = document.querySelector("input[name='audit-recipient-mode']:checked").value;
        target.auditRecipients = formAuditRecipients.value.trim();
      }
      showToast(`修改账户成功`, "success");
    } else {
      // 新增
      const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
      const newAccount = {
        id: newId,
        realname: realname,
        username: username,
        roles: [...formSelectedRoles],
        email: email,
        phone: phone,
        loginVerify: formLoginVerify.checked,
        expireTime: formExpireTime.value,
        status: status,
        domainMode: dMode,
        domains: dList,
        searchKeywords: formSearchKeywords.value.trim(),
        searchRecipientMode: document.querySelector("input[name='search-recipient-mode']:checked").value,
        searchRecipients: formSearchRecipients.value.trim(),
        auditKeywords: formAuditKeywords.value.trim(),
        auditRecipientMode: document.querySelector("input[name='audit-recipient-mode']:checked").value,
        auditRecipients: formAuditRecipients.value.trim()
      };
      accounts.push(newAccount);
      showToast(`添加账户成功`, "success");
    }

    closeModal();
    renderAccountTable();
  };

  // 搜索用户名称
  btnSearchUser.onclick = function () {
    const val = filterUserInput.value.trim().toLowerCase();
    if (!val) {
      renderAccountTable(accounts);
      return;
    }
    const filtered = accounts.filter(a => 
      a.realname.toLowerCase().includes(val) ||
      a.username.toLowerCase().includes(val)
    );
    renderAccountTable(filtered);
  };

  filterUserInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      btnSearchUser.click();
    }
  });

  // 顶部使用流程链接弹窗
  const btnShowRulesTop = document.getElementById("btn-show-rules-top");
  if (btnShowRulesTop) {
    btnShowRulesTop.onclick = function () {
      showToast("使用流程：1.添加/修改账户 2.指定管理域名 3.设置搜索与审计限制", "info");
    };
  }

  // ================= 7. 初始化启动 =================
  renderAccountTable();
});
