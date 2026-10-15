/**
 * 教培系统通用交互组件与导航框架 (Common UI & Layout Runner)
 * 依赖 store.js
 */

(function(global) {
  // 全局辅助查找
  function $(id) { return document.getElementById(id); }

  // 统一消息提示
  function toast(msg, type = 'info') {
    const prev = document.querySelector('.toast');
    if (prev) prev.remove();

    const t = document.createElement('div');
    t.className = 'toast';
    const icon = type === 'error' ? '❌' : (type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    t.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 250);
    }, 2400);
  }

  // PRD 2.4 完整标准系统导航地图 (13 大业务模块)
  const SYSTEM_NAVS = [
    { id: 'workbench', icon: '🏠', name: '工作台', url: 'workbench.html', direct: true },
    {
      id: 'teach', icon: '📚', name: '教学管理',
      children: [
        { id: 'teach-system', name: '课程体系', url: 'teaching.html?page=teach-system', pg: '4.2-P01' },
        { id: 'teach-course', name: '课程管理', url: 'teaching.html?page=teach-course', pg: '4.2-P02' }
      ]
    },
    {
      id: 'train', icon: '🎓', name: '培训管理',
      children: [
        { id: 'train-class', name: '培训班管理', url: 'training.html', pg: '4.3-P01' },
        { id: 'base-category', name: '培训类别', url: 'teaching.html?page=base-category', pg: '4.2-P04' }
      ]
    },
    {
      id: 'resource', icon: '🗂️', name: '资源管理',
      children: [
        { id: 'res-plan', name: '教案库', url: 'resource.html?page=res-plan', pg: '4.4-P01' },
        { id: 'res-book', name: '教材库', url: 'resource.html?page=res-book', pg: '4.4-P02' },
        { id: 'res-case', name: '案例库', url: 'resource.html?page=res-case', pg: '4.4-P03' },
        { id: 'res-self', name: '自他资源库', url: 'resource.html?page=res-self', pg: '4.4-P04' },
        { id: 'res-bank', name: '题库试卷库', url: 'resource.html?page=res-bank', pg: '4.4-P05' },
        { id: 'res-tag', name: '标签管理', url: 'resource.html?page=res-tag', pg: '4.4-P06' }
      ]
    },
    {
      id: 'edu', icon: '📊', name: '教务组织',
      children: [
        { id: 'edu-plan', name: '教学计划管理', url: 'edu.html?page=edu-plan', pg: '4.5-P01' },
        { id: 'edu-data', name: '教务数据管理', url: 'edu.html?page=edu-data', pg: '4.5-P02' },
        { id: 'edu-report', name: '多维度报表', url: 'edu.html?page=edu-report', pg: '4.5-P03' },
        { id: 'edu-export', name: '数据导出与集成', url: 'edu.html?page=edu-export', pg: '4.5-P04' },
        { id: 'edu-settle', name: '结算报告模板', url: 'edu.html?page=edu-settle', pg: '4.5-P05' }
      ]
    },
    {
      id: 'teacher', icon: '👥', name: '师资库',
      children: [
        { id: 'tea-list', name: '师资信息', url: 'teacher-lib.html?page=tea-list', pg: '4.6-P01' },
        { id: 'tea-tag', name: '分级分类标签', url: 'teacher-lib.html?page=tea-tag', pg: '4.6-P03' },
        { id: 'tea-archive', name: '授课质量档案', url: 'teacher-lib.html?page=tea-archive', pg: '4.6-P02' },
        { id: 'tea-report', name: '综合评价报告', url: 'teacher-lib.html?page=tea-report', pg: '4.6-P05' }
      ]
    },
    {
      id: 'student', icon: '✪', name: '学员库',
      children: [
        { id: 'stu-list', name: '学员信息', url: 'student-lib.html?page=stu-list', pg: '4.7-P01' }
      ]
    },
    {
      id: 'room', icon: '🏫', name: '教室设备',
      children: [
        { id: 'room-point', name: '现场教学点', url: 'room.html?page=room-point', pg: '4.8-P01' },
        { id: 'room-room', name: '教室规格管理', url: 'room.html?page=room-room', pg: '4.8-P02' },
        { id: 'room-device', name: '人脸考勤设备', url: 'room.html?page=room-device', pg: '4.8-P03' }
      ]
    },
    {
      id: 'approve', icon: '✅', name: '审批管理',
      children: [
        { id: 'apv-my', name: '我的审批', url: 'approve.html?page=apv-my', pg: '4.9-P01' },
        { id: 'apv-record', name: '审批记录', url: 'approve.html?page=apv-record', pg: '4.9-P03' }
      ]
    },
    {
      id: 'org', icon: '🏛️', name: '组织管理',
      children: [
        { id: 'org-structure', name: '组织架构', url: 'org.html?page=org-structure', pg: '4.10-P01' },
        { id: 'org-account', name: '账户管理', url: 'org.html?page=org-account', pg: '4.10-P02' },
        { id: 'org-user', name: '用户与角色', url: 'org.html?page=org-user', pg: '4.10-P03' },
        { id: 'org-data', name: '数据权限', url: 'org.html?page=org-data', pg: '4.10-P04' },
        { id: 'org-three', name: '三员分立管理', url: 'org.html?page=org-three', pg: '4.10-P05' }
      ]
    },
    {
      id: 'archive', icon: '📦', name: '归档档案',
      children: [
        { id: 'arch-check', name: '归档完整性校验', url: 'archive.html?tab=check', pg: '4.13-P01' },
        { id: 'arch-export', name: '标准化摆渡导出包', url: 'archive.html?tab=export', pg: '4.13-P02' },
        { id: 'arch-log', name: '摆渡导出记录审计', url: 'archive.html?tab=log', pg: '4.13-P03' }
      ]
    },
    {
      id: 'base', icon: '⚙️', name: '基础设置',
      children: [
        { id: 'base-log', name: '系统操作日志', url: 'base.html?page=base-log', pg: '4.11-P03' },
        { id: 'base-rule', name: 'FY经费规则库', url: 'base.html?page=base-rule', pg: '4.11-P04' }
      ]
    },
    {
      id: 'screen', icon: '📈', name: '可视大屏',
      children: [
        { id: 'scr-overview', name: '总览大屏', url: 'screen.html?scr=overview', pg: '4.12', target: '_blank' },
        { id: 'scr-study', name: '学情大屏', url: 'screen.html?scr=study', pg: '4.12', target: '_blank' },
        { id: 'scr-resource', name: '资源大屏', url: 'screen.html?scr=resource', pg: '4.12', target: '_blank' }
      ]
    }
  ];


  // 全局侧边栏展开/收起切换与持久化
  function setNavCollapsed(isCollapsed) {
    document.body.classList.toggle('nav-collapsed', isCollapsed);
    localStorage.setItem('sidenav_collapsed', isCollapsed ? '1' : '0');
    updateCollapseUI(isCollapsed);
    hideNavFlyout(0);
  }

  function toggleNavCollapsed() {
    setNavCollapsed(!document.body.classList.contains('nav-collapsed'));
  }

  function updateCollapseUI(isCollapsed) {
    const collapseBtn = $('navCollapse');
    if (collapseBtn) {
      const icon = collapseBtn.querySelector('.collapse-icon');
      const text = collapseBtn.querySelector('.collapse-text');
      if (icon) icon.textContent = isCollapsed ? '⇥' : '⇤';
      if (text) text.textContent = isCollapsed ? '展开' : '收起导航';
      collapseBtn.setAttribute('title', isCollapsed ? '点击展开侧边栏' : '点击收起侧边栏');
    }
    const edgeBtn = $('sidenavEdgeToggle');
    if (edgeBtn) {
      edgeBtn.textContent = isCollapsed ? '›' : '‹';
      edgeBtn.setAttribute('title', isCollapsed ? '展开导航' : '收起导航');
    }
    const tbToggle = $('tbNavToggle');
    if (tbToggle) {
      tbToggle.setAttribute('title', isCollapsed ? '展开侧边栏导航' : '收起侧边栏导航');
    }
  }

  let flyoutTimer = null;
  function getNavFlyout() {
    let flyout = $('globalNavFlyout');
    if (!flyout) {
      flyout = document.createElement('div');
      flyout.id = 'globalNavFlyout';
      flyout.className = 'nav-flyout hidden';
      document.body.appendChild(flyout);

      flyout.addEventListener('mouseenter', () => clearTimeout(flyoutTimer));
      flyout.addEventListener('mouseleave', () => hideNavFlyout(120));
      flyout.addEventListener('click', (e) => {
        const item = e.target.closest('.flyout-item') || e.target.closest('.flyout-direct');
        if (item) {
          const url = item.dataset.url;
          const target = item.dataset.target;
          const childId = item.dataset.id;
          hideNavFlyout(0);

          if (childId && typeof window.showView === 'function' && window.VIEW_NAME && window.VIEW_NAME[childId]) {
            window.showView(childId);
            document.querySelectorAll('.nav-child').forEach(n => n.classList.remove('active'));
            const sideChild = document.querySelector(`.nav-child[data-id="${childId}"]`);
            if (sideChild) sideChild.classList.add('active');
            try {
              const u = new URL(location);
              u.searchParams.set('page', childId);
              window.history.replaceState({}, '', u);
            } catch(e) {}
            return;
          }

          if (childId && typeof window.showLib === 'function' && window.LIB_NAME && window.LIB_NAME[childId]) {
            window.showLib(childId);
            document.querySelectorAll('.nav-child').forEach(n => n.classList.remove('active'));
            const sideChild = document.querySelector(`.nav-child[data-id="${childId}"]`);
            if (sideChild) sideChild.classList.add('active');
            try {
              const u = new URL(location);
              u.searchParams.set('page', childId);
              window.history.replaceState({}, '', u);
            } catch(e) {}
            return;
          }

          if (target === '_blank' || (url && url.includes('screen.html'))) {
            window.open(url, '_blank');
            return;
          }

          if (url) {
            sessionStorage.setItem('sidenav_last_id', childId || '');
            location.href = url;
          }
        }
      });
    }
    return flyout;
  }

  function showNavFlyout(groupEl) {
    if (!document.body.classList.contains('nav-collapsed')) return;
    clearTimeout(flyoutTimer);
    const groupId = groupEl.dataset.group;
    const g = SYSTEM_NAVS.find(item => item.id === groupId);
    if (!g) return;

    const flyout = getNavFlyout();
    const rect = groupEl.getBoundingClientRect();
    const top = Math.max(56, Math.min(rect.top, window.innerHeight - 280));

    if (g.direct) {
      flyout.innerHTML = `
        <div class="flyout-header flyout-direct" data-url="${g.url}">${g.icon} ${g.name}</div>
      `;
    } else {
      const activeChild = groupEl.querySelector('.nav-child.active');
      const activeId = activeChild ? activeChild.dataset.id : '';
      flyout.innerHTML = `
        <div class="flyout-header">${g.icon} ${g.name}</div>
        <div class="flyout-body">
          ${(g.children || []).map(c => {
            const fCnt = (c.id === 'apv-my') ? getApprovalPendingCount() : 0;
            const fBadge = (c.id === 'apv-my' && fCnt > 0) ? `<span class="nav-badge" data-cnt="${fCnt}">${fCnt > 99 ? '99+' : fCnt}</span>` : '';
            return `
              <div class="flyout-item ${c.id === activeId ? 'active' : ''}" data-id="${c.id}" data-url="${c.url}" data-target="${c.target || ''}" style="display:flex;align-items:center;justify-content:space-between">
                <span>${c.name}</span>
                ${fBadge}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    flyout.style.top = top + 'px';
    flyout.style.left = '48px';
    flyout.classList.remove('hidden');
  }

  function hideNavFlyout(delay = 120) {
    clearTimeout(flyoutTimer);
    const flyout = $('globalNavFlyout');
    if (!flyout) return;
    if (delay === 0) {
      flyout.classList.add('hidden');
    } else {
      flyoutTimer = setTimeout(() => flyout.classList.add('hidden'), delay);
    }
  }

  // 渲染顶部栏
  function renderTopbar() {
    let topbar = document.querySelector('header.topbar');
    if (!topbar) {
      topbar = document.createElement('header');
      topbar.className = 'topbar';
      document.body.prepend(topbar);
    }

    const curUser = (global.TREA_STORE && global.TREA_STORE.data && global.TREA_STORE.data.currentUser) || {
      id: 'U101',
      name: '张三',
      dept: '教务管理办',
      role: '三级管理员',
      avatar: '张'
    };

    function getPendingNoticeCount() {
      try {
        const stored = localStorage.getItem('TREA_NOTICES_V1');
        if (stored) {
          const list = JSON.parse(stored);
          return list.filter(n => !n.read).length;
        }
      } catch(e) {}
      return 6;
    }
    const pendingCount = getPendingNoticeCount();

    topbar.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <button class="tb-collapse-btn" id="tbNavToggle" title="折叠/展开左侧导航">☰</button>
        <div class="tb-logo" onclick="location.href='workbench.html'">
          <div class="mark">院</div>
          <div class="title-box">
            <span class="name">**学院教培管理系统</span>
            <span class="sub">全国干部教育培训 · 安可涉密内网专版</span>
          </div>
        </div>
      </div>
      <div class="tb-search">
        <span class="icon">🔍</span>
        <input class="input" id="globalSearchInput" placeholder="全局精准检索：班次 / 课程 / 师资 / 学员 / 申请单…">
      </div>
      <div class="tb-right">
        <span class="tb-tag-sec">🛡️ 等保三级分保内网运行中</span>
        <div class="tb-icon" onclick="location.href='notice.html'" title="全局消息通知与待办中心">
          🔔<span class="tb-badge" id="topbarPendingBadge">${pendingCount}</span>
        </div>
        <div class="tb-icon" onclick="window.open('screen.html?scr=overview', '_blank')" title="大屏展示 (新窗口打开)">📈</div>
        <div class="tb-user" id="topbarUserBtn">
          <div class="tb-avatar">${curUser.avatar || curUser.name[0]}</div>
          <div style="display:flex;flex-direction:column;line-height:1.2">
            <span style="font-size:13px;font-weight:700">${curUser.name}</span>
            <span style="font-size:11px;opacity:0.8">${curUser.role}</span>
          </div>
          <span style="font-size:10px;margin-left:4px">▼</span>
        </div>

        <!-- 用户下拉菜单 (支持快速切换身份体验) -->
        <div class="dropdown-menu hidden" id="topbarUserMenu">
          <div class="dd-header">
            <div class="dd-name">${curUser.name} · ${curUser.dept}</div>
            <div class="dd-role">当前角色：<b>${curUser.role}</b></div>
          </div>
          <div class="dd-item" onclick="location.href='notice.html'">🔔 我的通知与待办</div>
          <div class="dd-divider"></div>
          <div style="padding:6px 14px 2px;font-size:11px;color:var(--text-3)">快速切换角色演示：</div>
          <div class="dd-item" onclick="switchRole('办训人员')">👤 办训人员 (三级管理员 · 张三)</div>
          <div class="dd-item" onclick="switchRole('处领导')">👔 处领导 (二级管理员 · 李处长)</div>
          <div class="dd-item" onclick="switchRole('院领导')">🎖️ 院领导 (一级特批 · 李院长)</div>
          <div class="dd-item" onclick="switchRole('教研教师')">👨‍🏫 教研教师 (特聘教授 · 欧阳文华)</div>
          <div class="dd-divider"></div>
          <div style="padding:2px 14px;font-size:11px;color:var(--text-3)">三员分立角色切换：</div>
          <div class="dd-item" onclick="switchRole('系统管理员')">🔧 系统管理员 (刘系统)</div>
          <div class="dd-item" onclick="switchRole('安全保密管理员')">🔐 安全保密管理员 (陈保密)</div>
          <div class="dd-item" onclick="switchRole('安全审计员')">📋 安全审计员 (张审计)</div>
          <div class="dd-divider"></div>
          <div class="dd-item" onclick="resetStoreData()" style="color:var(--warning)">🔄 重置演示种子数据</div>
          <div class="dd-item" onclick="location.href='login.html'" style="color:var(--danger)">⏻ 退出返回登录页</div>
        </div>
      </div>
    `;

    // 交互绑定：侧边栏折叠切换
    const navToggle = $('tbNavToggle');
    if (navToggle) {
      navToggle.onclick = () => {
        toggleNavCollapsed();
      };
    }

    const userBtn = $('topbarUserBtn');
    const userMenu = $('topbarUserMenu');
    if (userBtn && userMenu) {
      userBtn.onclick = (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
      };
      document.addEventListener('click', () => userMenu.classList.add('hidden'));
    }

    const searchInput = $('globalSearchInput');
    const searchWrap = searchInput ? searchInput.closest('.tb-search') : null;
    if (searchInput) {
      // 若当前在 search.html，自动同步 URL 关键词到顶部搜索框
      const curFile = location.pathname.split('/').pop() || '';
      if (curFile.includes('search.html')) {
        const urlParams = new URLSearchParams(location.search);
        const kw = urlParams.get('keyword') || urlParams.get('q') || '';
        if (kw) searchInput.value = kw;
      }

      const triggerSearch = () => {
        const val = searchInput.value.trim();
        if (!val) {
          if (curFile.includes('search.html') && typeof window.doSearch === 'function') {
            window.doSearch('');
          }
          return;
        }
        if (curFile.includes('search.html') && typeof window.doSearch === 'function') {
          window.doSearch(val);
        } else {
          location.href = `search.html?keyword=${encodeURIComponent(val)}`;
        }
      };

      searchInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          triggerSearch();
        }
      };

      if (searchWrap) {
        const searchIcon = searchWrap.querySelector('.icon');
        if (searchIcon) {
          searchIcon.style.cursor = 'pointer';
          searchIcon.title = '点击立即进行全局搜索';
          searchIcon.onclick = triggerSearch;
        }
      }
    }
  }

  // 渲染侧边栏
  
  // 获取当前系统待审批数量
  function getApprovalPendingCount() {
    try {
      if (typeof window.getApprovalPendingCount === 'function' && window.getApprovalPendingCount !== getApprovalPendingCount) {
        return window.getApprovalPendingCount();
      }
      if (Array.isArray(window.BILLS) && typeof window.todoOf === 'function') {
        const c = window.BILLS.filter(window.todoOf).length;
        localStorage.setItem('TREA_APPROVAL_PENDING_COUNT', String(c));
        return c;
      }
      const cached = localStorage.getItem('TREA_APPROVAL_PENDING_COUNT');
      if (cached !== null && cached !== undefined) {
        const n = parseInt(cached, 10);
        if (!isNaN(n)) return n;
      }
      if (window.TREA_STORE && window.TREA_STORE.data && Array.isArray(window.TREA_STORE.data.approvals)) {
        const c = window.TREA_STORE.data.approvals.filter(a => a.status === '待审批' || a.status === '审核中').length;
        if (c > 0) return c;
      }
    } catch(e) {}
    return 10;
  }

  // 动态更新左侧导航栏待审批角标
  function updateNavApprovalBadge(count) {
    if (count === undefined || count === null) {
      count = getApprovalPendingCount();
    }
    try {
      localStorage.setItem('TREA_APPROVAL_PENDING_COUNT', String(count));
    } catch(e) {}

    const badgeStr = count > 0 ? (count > 99 ? '99+' : String(count)) : '';

    // 更新「我的审批」子菜单角标
    document.querySelectorAll('.nav-child[data-id="apv-my"]').forEach(el => {
      let b = el.querySelector('.nav-badge');
      if (!b) {
        b = document.createElement('span');
        b.className = 'nav-badge';
        el.appendChild(b);
      }
      b.textContent = badgeStr;
      b.dataset.cnt = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    // 更新「审批管理」父级组角标与折叠红点
    document.querySelectorAll('.nav-group[data-group="approve"]').forEach(grp => {
      const p = grp.querySelector('.nav-parent');
      if (p) {
        let dot = p.querySelector('.nav-group-dot');
        if (!dot) {
          dot = document.createElement('span');
          dot.className = 'nav-group-dot';
          p.appendChild(dot);
        }
        dot.textContent = badgeStr;
        dot.dataset.cnt = count;
        dot.style.display = count > 0 ? '' : 'none';

        let pb = p.querySelector('.nav-badge-parent');
        if (!pb) {
          pb = document.createElement('span');
          pb.className = 'nav-badge-parent';
          const caret = p.querySelector('.nav-caret');
          if (caret) p.insertBefore(pb, caret);
          else p.appendChild(pb);
        }
        pb.textContent = badgeStr;
        pb.dataset.cnt = count;
        pb.style.display = count > 0 ? 'inline-flex' : 'none';
      }
    });

    // 更新悬浮二级菜单中的角标
    const flyoutItem = document.querySelector('.flyout-item[data-id="apv-my"]');
    if (flyoutItem) {
      let b = flyoutItem.querySelector('.nav-badge');
      if (!b) {
        b = document.createElement('span');
        b.className = 'nav-badge';
        flyoutItem.appendChild(b);
      }
      b.textContent = badgeStr;
      b.dataset.cnt = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  global.getApprovalPendingCount = getApprovalPendingCount;
  global.updateNavApprovalBadge = updateNavApprovalBadge;

  function renderSidenav() {
    let sidenav = document.querySelector('aside.sidenav');
    if (!sidenav) {
      sidenav = document.createElement('aside');
      sidenav.className = 'sidenav';
      document.body.appendChild(sidenav);
    }

    const currentPath = location.pathname.split('/').pop() || 'workbench.html';
    const searchParams = new URLSearchParams(location.search);
    const curPageParam = searchParams.get('page') || searchParams.get('tab') || searchParams.get('scr');
    const lastNavId = sessionStorage.getItem('sidenav_last_id') || '';

    const navItemsHtml = SYSTEM_NAVS.map(g => {
      let isGroupActive = false;
      let isGroupOpen = false;
      let matchedChildIndex = -1;

      if (g.direct) {
        isGroupActive = currentPath === g.url;
      } else if (g.children) {
        const isMatchedFile = g.children.some(c => c.url.split('?')[0] === currentPath);
        // 1. 优先根据页面参数匹配属于当前页面的子项
        if (curPageParam) {
          matchedChildIndex = g.children.findIndex(c => {
            const file = c.url.split('?')[0];
            return (file === currentPath) && (c.id === curPageParam || c.url.includes(curPageParam));
          });
        }
        // 2. 若页面无参数但有最后点击的导航项ID且属于该页面
        if (matchedChildIndex === -1 && lastNavId) {
          matchedChildIndex = g.children.findIndex(c => c.id === lastNavId && c.url.split('?')[0] === currentPath);
        }
        // 3. 兜底按当前文件名匹配当前组的第一个子项
        if (matchedChildIndex === -1 && isMatchedFile) {
          matchedChildIndex = g.children.findIndex(c => {
            const parts = c.url.split('?');
            const file = parts[0];
            const hasParam = !!parts[1];
            if (file !== currentPath) return false;
            if (!curPageParam && hasParam) return false;
            return true;
          });
        }
        if (matchedChildIndex === -1 && g.id === 'train' && currentPath === 'training-schedule.html') {
          matchedChildIndex = g.children.findIndex(c => c.id === 'train-class');
        }

        const savedGroupOpen = sessionStorage.getItem('nav_open_' + g.id);
        isGroupOpen = (matchedChildIndex !== -1) || (savedGroupOpen === '1');
      }

const groupApvCnt = (g.id === 'approve') ? getApprovalPendingCount() : 0;
      const groupBadgeHtml = (g.id === 'approve' && groupApvCnt > 0)
        ? `<span class="nav-badge-parent" data-cnt="${groupApvCnt}">${groupApvCnt > 99 ? '99+' : groupApvCnt}</span><span class="nav-group-dot" data-cnt="${groupApvCnt}">${groupApvCnt > 99 ? '99+' : groupApvCnt}</span>`
        : '';

      return `
        <div class="nav-group ${isGroupOpen ? 'open' : ''}" data-group="${g.id}">
          <div class="nav-parent ${isGroupActive ? 'active-direct' : ''}" data-id="${g.id}" data-direct="${g.direct ? 'true' : 'false'}" data-url="${g.url || ''}" title="${g.name}">
            <span class="nav-icon">${g.icon}</span>
            <span class="nav-label">${g.name}</span>
            ${groupBadgeHtml}
            ${g.children ? '<span class="nav-caret">▸</span>' : ''}
          </div>
          ${g.children ? `
            <div class="nav-children">
              ${g.children.map((c, idx) => {
                const isChildActive = (idx === matchedChildIndex);
                const isBlank = c.target === '_blank' || (c.url && c.url.includes('screen.html'));
                const apvCnt = (c.id === 'apv-my') ? getApprovalPendingCount() : 0;
                const apvBadgeHtml = (c.id === 'apv-my' && apvCnt > 0) ? `<span class="nav-badge" data-cnt="${apvCnt}">${apvCnt > 99 ? '99+' : apvCnt}</span>` : '';
                return `
                  <div class="nav-child ${isChildActive ? 'active' : ''}" data-id="${c.id}" data-url="${c.url}" data-name="${c.name}" data-pg="${c.pg || ''}" ${isBlank ? 'data-target="_blank"' : ''} title="${c.name} (${c.pg || ''})${isBlank ? ' [新窗口打开]' : ''}">
                    <span class="nav-label">${c.name}${isBlank ? ' <span style="font-size:11px;opacity:0.75;margin-left:2px">↗</span>' : ''}</span>
                    ${apvBadgeHtml}
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    sidenav.innerHTML = `
      <div class="sidenav-edge-toggle" id="sidenavEdgeToggle" title="展开/收起导航">‹</div>
      <div class="sidenav-scroll">
        ${navItemsHtml}
      </div>
      <div class="nav-collapse" id="navCollapse" title="收起/展开导航">
        <span class="collapse-icon">⇤</span><span class="collapse-text">收起导航</span>
      </div>
    `;

    // 绑定悬浮二级浮层菜单 (仅在折叠态下生效)
    sidenav.querySelectorAll('.nav-group').forEach(group => {
      group.addEventListener('mouseenter', () => showNavFlyout(group));
      group.addEventListener('mouseleave', () => hideNavFlyout(120));
    });

    // 侧边栏专用内部滚动对齐函数，只调整 .sidenav-scroll 容器，绝不影响主页面 window 的视口滚动
    function scrollNavElementIntoView(el, behavior = 'auto') {
      if (!el) return;
      const sc = sidenav.querySelector('.sidenav-scroll') || sidenav;
      if (!sc) return;

      const scRect = sc.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // 如果目标在侧边栏可见区域上方，向下调整视口，预留 14px 边距
      if (elRect.top < scRect.top) {
        const diff = scRect.top - elRect.top + 14;
        sc.scrollTo({ top: Math.max(0, sc.scrollTop - diff), behavior: behavior });
      }
      // 如果目标在侧边栏可见区域下方，向上调整视口，预留 14px 边距
      else if (elRect.bottom > scRect.bottom) {
        const diff = elRect.bottom - scRect.bottom + 14;
        sc.scrollTo({ top: sc.scrollTop + diff, behavior: behavior });
      }

      // 保存真实的滚动位置
      sessionStorage.setItem('sidenav_scroll_top', sc.scrollTop);
    }
    global.scrollNavElementIntoView = scrollNavElementIntoView;

    // 监听侧边栏滚动，实时持久化滚动位置，防止页面刷新或跳转后丢失视口位置
    const scrollContainer = sidenav.querySelector('.sidenav-scroll') || sidenav;
    if (!scrollContainer.__boundScrollEvent) {
      scrollContainer.__boundScrollEvent = true;
      scrollContainer.addEventListener('scroll', function() {
        sessionStorage.setItem('sidenav_scroll_top', scrollContainer.scrollTop);
      }, { passive: true });
    }

    // 恢复侧边栏滚动高度，并将激活的导航项平滑保持在当前视野可见区域
    function keepActiveNavInView() {
      const sc = sidenav.querySelector('.sidenav-scroll') || sidenav;
      const savedScroll = sessionStorage.getItem('sidenav_scroll_top');
      if (savedScroll !== null && !isNaN(parseInt(savedScroll, 10))) {
        sc.scrollTop = parseInt(savedScroll, 10);
      }
      const activeEl = sidenav.querySelector('.nav-child.active') || sidenav.querySelector('.nav-parent.active-direct');
      if (activeEl) {
        const parentGroup = activeEl.closest('.nav-group');
        if (parentGroup && !parentGroup.classList.contains('open')) {
          parentGroup.classList.add('open');
        }
        scrollNavElementIntoView(activeEl, 'auto');
      }
    }

    keepActiveNavInView();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(keepActiveNavInView);
    }
    setTimeout(keepActiveNavInView, 60);
    setTimeout(keepActiveNavInView, 220);

    // 同步展开/折叠按钮文字与状态
    updateCollapseUI(document.body.classList.contains('nav-collapsed'));

    // 绑定侧边栏专属捕获级事件处理（优先拦截并阻断冒泡，杜绝旧页面内联脚本重复 toggle）
    if (!sidenav.__boundNavEvents) {
      sidenav.__boundNavEvents = true;
      sidenav.addEventListener('click', function(e) {
        const sc = sidenav.querySelector('.sidenav-scroll') || sidenav;

        // 1. 折叠侧边栏
        const collapseBtn = e.target.closest('#navCollapse') || e.target.closest('.nav-collapse') || e.target.closest('#sidenavEdgeToggle');
        if (collapseBtn) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          toggleNavCollapsed();
          return;
        }

        // 2. 一级菜单
        const parent = e.target.closest('.nav-parent');
        if (parent) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const isDirect = parent.dataset.direct === 'true';
          if (isDirect) {
            const url = parent.dataset.url || 'workbench.html';
            sessionStorage.setItem('sidenav_scroll_top', sc.scrollTop);
            sessionStorage.setItem('sidenav_last_id', parent.dataset.id || '');
            location.href = url;
            return;
          }
          const group = parent.closest('.nav-group');
          if (group) {
            const willOpen = !group.classList.contains('open');
            group.classList.toggle('open', willOpen);
            sessionStorage.setItem('nav_open_' + group.dataset.group, willOpen ? '1' : '0');
            sessionStorage.setItem('sidenav_scroll_top', sc.scrollTop);

            if (willOpen) {
              setTimeout(() => {
                scrollNavElementIntoView(parent, 'auto');
              }, 40);
            }
          }
          return;
        }

        // 3. 二级子菜单
        const child = e.target.closest('.nav-child');
        if (child) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const childId = child.dataset.id;
          const url = child.dataset.url;

          // 记录当前滚动高度和点击的项，防止页面跳转后重置导致用户找不到上下文
          sessionStorage.setItem('sidenav_scroll_top', sc.scrollTop);
          sessionStorage.setItem('sidenav_last_id', childId || '');

          // 兼容同页面内的局部视图切换 (如 base.html, room.html, org.html 等)
          if (typeof window.showView === 'function' && childId && window.VIEW_NAME && window.VIEW_NAME[childId]) {
            window.showView(childId);
            sidenav.querySelectorAll('.nav-child').forEach(n => n.classList.remove('active'));
            child.classList.add('active');
            scrollNavElementIntoView(child, 'smooth');
            try {
              const u = new URL(location);
              u.searchParams.set('page', childId);
              window.history.replaceState({}, '', u);
            } catch(e) {}
            return;
          }

          // 兼容 resource.html 内部切换 (如 showLib)
          if (typeof window.showLib === 'function' && childId && window.LIB_NAME && window.LIB_NAME[childId]) {
            window.showLib(childId);
            sidenav.querySelectorAll('.nav-child').forEach(n => n.classList.remove('active'));
            child.classList.add('active');
            scrollNavElementIntoView(child, 'smooth');
            try {
              const u = new URL(location);
              u.searchParams.set('page', childId);
              window.history.replaceState({}, '', u);
            } catch(e) {}
            return;
          }

          if (child.dataset.target === '_blank' || (url && url.includes('screen.html'))) {
            window.open(url, '_blank');
            return;
          }

          if (url) {
            location.href = url;
          }
        }
      }, true); // capture = true
    }
  }

  global.toggleNavGroup = function(groupId) {
    const el = document.querySelector(`.nav-group[data-group="${groupId}"]`);
    if (el) {
      el.classList.toggle('open');
      sessionStorage.setItem('nav_open_' + groupId, el.classList.contains('open') ? '1' : '0');
    }
  };

  global.setNavActive = function(elOrId) {
    const sidenav = document.querySelector('aside.sidenav');
    const sc = sidenav ? (sidenav.querySelector('.sidenav-scroll') || sidenav) : null;
    document.querySelectorAll('.nav-child').forEach(n => n.classList.remove('active'));
    if (!elOrId) return;
    let target = null;
    if (typeof elOrId === 'string') {
      target = document.querySelector(`.nav-child[data-id="${elOrId}"]`);
    } else if (elOrId && elOrId.classList) {
      target = elOrId;
    }
    if (target) {
      target.classList.add('active');
      const group = target.closest('.nav-group');
      if (group && !group.classList.contains('open')) {
        group.classList.add('open');
      }
      if (sc) {
        sessionStorage.setItem('sidenav_last_id', target.dataset.id || '');
        sessionStorage.setItem('sidenav_scroll_top', sc.scrollTop);
        if (typeof global.scrollNavElementIntoView === 'function') {
          global.scrollNavElementIntoView(target, 'auto');
        }
      }
    }
  };

  global.switchRole = function(role) {
    if (global.TREA_STORE) {
      global.TREA_STORE.switchUser(role);
      toast(`已成功切换为「${role}」视角，正在刷新系统权限与数据...`, 'success');
      setTimeout(() => location.reload(), 500);
    }
  };

  global.resetStoreData = function() {
    if (confirm('确认重置演示种子数据为初始状态？')) {
      if (global.TREA_STORE) global.TREA_STORE.reset();
      toast('演示数据已重置为初始状态！', 'success');
      setTimeout(() => location.reload(), 400);
    }
  };

  // 页面加载自动初始化框架
  
  // 全局即时悬浮气泡框（针对 .cell-ellipsis 与截断文本，鼠标移入即时显示完整文字）
  function initGlobalTooltip() {
    let tipEl = document.getElementById('globalFloatingTooltip');
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.id = 'globalFloatingTooltip';
      tipEl.className = 'floating-tooltip';
      document.body.appendChild(tipEl);
    }

    document.addEventListener('mouseover', function(e) {
      const target = e.target.closest('.cell-ellipsis, [data-tooltip]');
      if (!target) return;
      const text = target.getAttribute('data-tooltip') || target.getAttribute('title') || target.dataset.fullTitle || target.textContent.trim();
      if (!text) return;

      if (target.hasAttribute('title')) {
        target.dataset.originalTitle = target.getAttribute('title');
        target.removeAttribute('title');
      }

      tipEl.textContent = text;
      tipEl.style.display = 'block';
      tipEl.classList.add('show');

      const rect = target.getBoundingClientRect();
      const tipRect = tipEl.getBoundingClientRect();
      let top = rect.top - tipRect.height - 8;
      let left = rect.left;

      if (top < 10) top = rect.bottom + 8;
      if (left < 10) left = 10;
      if (left + tipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tipRect.width - 10;
      }

      tipEl.style.top = top + 'px';
      tipEl.style.left = left + 'px';
    });

    document.addEventListener('mouseout', function(e) {
      const target = e.target.closest('.cell-ellipsis, [data-tooltip]');
      if (!target) return;
      if (target.dataset.originalTitle) {
        target.setAttribute('title', target.dataset.originalTitle);
      }
      tipEl.classList.remove('show');
      tipEl.style.display = 'none';
    });
  }

  // 全局表格自适应与横向滚动保护 (确保列数多时不会溢出卡片或被视口截断)
  function ensureTableResponsive(rootNode) {
    try {
      const scope = rootNode || document;
      const tables = scope.querySelectorAll('table.data-table, table.report-table, table.perm-matrix-table, table.matrix-table, table.doc-table, table.sched-month-table, table.dim-table');
      tables.forEach(table => {
        const parent = table.parentElement;
        if (!parent) return;

        const firstRowCells = table.querySelectorAll('tr:first-child > th, tr:first-child > td');
        const colCount = firstRowCells.length;

        const isWrapped = parent.classList.contains('table-wrap') || 
                          parent.classList.contains('table-responsive') || 
                          parent.classList.contains('table-scroll');

        if (!isWrapped) {
          const parentStyle = window.getComputedStyle ? window.getComputedStyle(parent) : null;
          const parentHasScroll = parentStyle && (parentStyle.overflowX === 'auto' || parentStyle.overflowX === 'scroll');

          if (!parentHasScroll) {
            const wrap = document.createElement('div');
            wrap.className = 'table-wrap';
            parent.insertBefore(wrap, table);
            wrap.appendChild(table);
          }
        }

        // 根据列数设置合理的最小宽度保障，确保多列或多操作按钮不挤压换行，平滑触发横向滚动
        if (!table.style.minWidth) {
          if (colCount >= 10) {
            table.style.minWidth = '1180px';
          } else if (colCount >= 8) {
            table.style.minWidth = '1050px';
          } else if (colCount >= 6) {
            table.style.minWidth = '880px';
          }
        }
      });
    } catch(err) {
      console.warn('ensureTableResponsive error:', err);
    }
  }

  // 监听动态插入的内容（如异步切换 tab、动态筛选刷新）
  function setupResponsiveTableObserver() {
    ensureTableResponsive();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      let timer = null;
      const observer = new MutationObserver((mutations) => {
        let hasTableChange = false;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.addedNodes && m.addedNodes.length > 0) {
            for (let j = 0; j < m.addedNodes.length; j++) {
              const node = m.addedNodes[j];
              if (node.nodeType === 1) {
                if (node.tagName === 'TABLE' || (node.querySelector && node.querySelector('table'))) {
                  hasTableChange = true;
                  break;
                }
              }
            }
          }
          if (hasTableChange) break;
        }
        if (hasTableChange) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            ensureTableResponsive();
          }, 30);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function initFrame() {
    // 登录页与大屏可视化页面不渲染管理后台的全局顶部和侧边栏
    const isLogin = location.pathname.endsWith('login.html');
    const isScreen = location.pathname.endsWith('screen.html') || location.href.includes('screen.html');
    if (!isLogin && !isScreen) {
      if (localStorage.getItem('sidenav_collapsed') === '1') {
        document.body.classList.add('nav-collapsed');
      }
      try {
        renderTopbar();
      } catch(e) {
        console.error('renderTopbar failed:', e);
      }
      try {
        renderSidenav();
      } catch(e) {
        console.error('renderSidenav failed:', e);
      }
      try {
        initGlobalTooltip();
      } catch(e) {}
      try {
        setupResponsiveTableObserver();
      } catch(e) {}
    } else {
      try {
        setupResponsiveTableObserver();
      } catch(e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFrame);
  } else {
    initFrame();
  }

  global.toast = toast;
  global.$ = $;
  global.SYSTEM_NAVS = SYSTEM_NAVS;
  global.ensureTableResponsive = ensureTableResponsive;
})(window);

