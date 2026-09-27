# Slide Outline

## Meta
- Topic: 外交培训学院教培系统建设方案——面向院领导的立项/阶段汇报
- Scenario: 内部领导汇报（会议室大屏投影），受众为院领导与处领导，目的是讲清"为什么建、建成什么样、能解决什么问题、下一步怎么做"
- Content Source: provided（需求说明书 0520/0617 补充版 + 交互原型需求规格说明书 + 6 个原型页面）
- Style: 政务深蓝 · 沿用原型设计语言 — 主色 #2563eb 政务蓝，深色侧栏 #0f172a 作为暗场页底色，浅底 #f3f6fb/#ffffff 卡片承载内容，18px 圆角 + 柔和蓝色投影；装饰元素取地球经纬线（外交主题）、圆点阵列与细网格；标题 56–80px，正文 28–32px
- Slide Count: 15
- Generated At: 2026-08-31T09:15:00+08:00

## Source Materials
- `需求/教培系统建设项目需求说明书0520(To用户).docx`
- `需求/教培系统建设项目需求说明书0617(补充版).docx` — 十章功能需求（教学/培训/资源/教务组织/基础信息/教员/学员/教室/审批/数据统计）+ 业务流程 + 技术要求 + 其他要求 + 3 个待确认问题
- `需求/教培系统_TREA交互原型需求规格说明书_0617.docx`
- `原型/dashboard.html`、`原型/training-list.html`、`原型/training-detail.html`、`原型/login.html`、`原型/account-settings.html`、`原型/prototype.css`（设计色板来源）
- 数据口径：全部取自上述文档可查证内容（模块数、角色数、流程步骤、功能点），**不采用原型中的演示数值**，避免虚构业务数据

## Slide-by-Slide Outline
1. **Slide 1 — Cover** — 外交培训学院教培系统建设方案汇报 | Layout hint: L01 | Image provided: yes（地球经纬线底纹 + 光晕） | Chart: no
2. **Slide 2 — 汇报提纲** — 五个部分：背景与目标、系统架构、核心能力、安全与决策、进展与计划 | Layout hint: L19 | Image: no | Chart: no
3. **Slide 3 — 建设背景：培训管理存在四个断点** — 参训/办训/管理三方信息壁垒、资源调度靠人工、数据沉淀不足、结班材料手工整理 | Layout hint: L15 | Image: yes（四宫格图标插图） | Chart: no
4. **Slide 4 — 建设目标** — 一个平台贯通培训全周期，聚焦"流程规范化、管理精细化、决策数据化"三条主线 | Layout hint: L07 | Image: yes（三支柱插图） | Chart: no
5. **Slide 5 — 系统总体架构：十大功能模块全景** — 教学/培训/资源/教务组织/基础信息/教员/学员/教室/审批/数据统计 | Layout hint: L05 | Image: yes（架构分层图 SVG） | Chart: no
6. **Slide 6 — 四类角色 × 三级管理员** — 教员、学员、组织员、系统管理员；院领导/处领导/办训人员分级授权 | Layout hint: L15 | Image: yes（角色与权限矩阵插图） | Chart: no
7. **Slide 7 — 全周期业务流程：六步闭环** — 立项 → 报名审核 → 排课实施 → 考勤记录 → 教学评估 → 结班归档 | Layout hint: L13 | Image: yes（流程箭头插图） | Chart: no
8. **Slide 8 — 核心能力一：教学与培训管理** — 课程体系、智能排课、座位排布、成绩与结班报告 | Layout hint: L16 | Image: yes | Chart: no
9. **Slide 9 — 核心能力二：学员与教员管理** — 一人一档综合查询、师资库与综合评价报告、评价标签 | Layout hint: L16 | Image: yes | Chart: no
10. **Slide 10 — 核心能力三：资源与教务保障** — 教案/教材/案例三库 + 标签共享、教室预约、预算与票据 | Layout hint: L16 | Image: yes | Chart: no
11. **Slide 11 — 智能化亮点：让教务少做重复劳动** — 自动结班报告、电子证书批量生成、评估可视化、评分异常高亮 | Layout hint: L15 | Image: yes | Chart: no
12. **Slide 12 — 安全可控：按涉密要求建设** — 内网部署、安可替代、等保合规、三级审批留痕、日志审计 | Layout hint: L16 | Image: yes（盾形/锁形插图） | Chart: no
13. **Slide 13 — 数据驱动决策：从台账到驾驶舱** — 教务/教学/学员/成果四类报表，多维度可视化 | Layout hint: L17 | Image: yes（柱状+环形示意图，标注"示意"） | Chart: yes
14. **Slide 14 — 阶段成果：需求与原型已就绪** — 需求说明书 + 6 个高保真原型页面（看板/班次列表/班次详情/登录/账户设置） | Layout hint: L05 | Image: yes（原型页面缩略插图） | Chart: no
15. **Slide 15 — 下一步与请示事项** — 进入开发实施；请领导明确 3 项待确认口径（现场教学点定位、学时统计口径、评估均分算法） | Layout hint: L20 | Image: yes | Chart: no

## Visual Rhythm Notes
- 暗场页（深蓝 #0f172a）位置：1（封面）、4（目标）、12（安全）、15（结语）—— 形成 开-中-后-收 的节奏
- 图表页位置：13（数据驾驶舱），另 5、7 使用结构化示意图
- 每页配简洁 SVG 插图/图标（模块图、流程图、架构图、原型缩略图），不使用占位图
- 大屏投影场景，标题 56–80px、正文不小于 28px、标签不小于 22px；内容距边缘 ≥100px
