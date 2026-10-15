/**
 * 教培系统全局数据状态中心 (Shared State & Rule Engine)
 * 遵循 PRD V1.0、需求说明书 V3.2、财务预算管理制度补充
 */

(function(global) {
  const STORAGE_KEY = 'TREA_SYSTEM_STORE_V2';

  // 默认初始数据（基于真实业务材料和PRD规范）
  const DEFAULT_DATA = {
    // 当前登录用户 (支持多角色快速切换)
    currentUser: {
      id: 'U101',
      name: '张三',
      dept: '教务管理办',
      role: '三级管理员', // 一级管理员(院领导), 二级管理员(处领导), 三级管理员(办训/带班), 组织员, 教研教师, 系统管理员, 安全保密管理员, 安全审计员
      roles: ['三级管理员', '班次管理员', '组织员'],
      managedClasses: ['B2503', 'B2505'],
      avatar: '张'
    },

    // 班次数据 (PRD 4.3-P01 真实模拟数据，覆盖党校班、政能班、专题研讨班、任职培训班全类别及各大业务司局)
    classes: [
      {
        id: 'B2503',
        name: '2503期处级干部进修班',
        cat: '党校班',
        target: '处级干部',
        host: '办公厅',
        dept: '教务管理办',
        days: 20,
        start: '2026-09-01',
        end: '2026-09-30',
        stuCount: 45,
        prog: 62,
        status: '在办', // 筹备, 在办, 待结班, 已结业, 已归档
        admin: '张三',
        headTeacher: '张三',
        budgetTotal: 185000,
        room: '教学大楼 301报告厅',
        courses: ['C01', 'C02', 'C03', 'C04'],
        archived: false
      },
      {
        id: 'B2505',
        name: '2505期青年干部培训班',
        cat: '政能班',
        target: '青年干部',
        host: '干部司',
        dept: '培训部',
        days: 30,
        start: '2026-09-08',
        end: '2026-10-20',
        stuCount: 48,
        prog: 40,
        status: '在办',
        admin: '张三',
        headTeacher: '李四',
        budgetTotal: 220000,
        room: '综合楼 201阶梯教室',
        courses: ['C01', 'C05', 'C06'],
        archived: false
      },
      {
        id: 'B2508',
        name: '2026年第1期驻外使领馆干部轮训班',
        cat: '任职培训班',
        target: '驻外使领馆干部',
        host: '干部司',
        dept: '培训部',
        days: 15,
        start: '2026-09-15',
        end: '2026-09-30',
        stuCount: 58,
        prog: 75,
        status: '在办',
        admin: '王五',
        headTeacher: '王五',
        budgetTotal: 195000,
        room: '教学大楼 501报告厅',
        courses: ['C01', 'C04', 'C06'],
        archived: false
      },
      {
        id: 'B2510',
        name: '2026年涉外法治能力建设专题研讨班',
        cat: '专题研讨班',
        target: '涉外法务骨干',
        host: '条法司',
        dept: '科研部',
        days: 12,
        start: '2026-09-10',
        end: '2026-09-22',
        stuCount: 35,
        prog: 90,
        status: '在办',
        admin: '赵六',
        headTeacher: '赵六',
        budgetTotal: 140000,
        room: '教学大楼 601研讨教室',
        courses: ['C03', 'C02'],
        archived: false
      },
      {
        id: 'B2506',
        name: '2506期驻外使节任职培训班',
        cat: '任职培训班',
        target: '驻外使节',
        host: '干部司',
        dept: '教务管理办',
        days: 15,
        start: '2026-10-12',
        end: '2026-10-30',
        stuCount: 32,
        prog: 0,
        status: '筹备',
        admin: '李四',
        headTeacher: '周组织员',
        budgetTotal: 160000,
        courses: ['C01', 'C03'],
        archived: false
      },
      {
        id: 'B2512',
        name: '2026年第2期国际传播与舆论应对专题班',
        cat: '专题研讨班',
        target: '宣传外事干部',
        host: '新闻司',
        dept: '科研部',
        days: 8,
        start: '2026-10-25',
        end: '2026-11-02',
        stuCount: 38,
        prog: 0,
        status: '筹备',
        admin: '李四',
        headTeacher: '李四',
        budgetTotal: 110000,
        courses: ['C05'],
        archived: false
      },
      {
        id: 'B2498',
        name: '2498期专题研讨班（多边外交实务）',
        cat: '专题研讨班',
        target: '司局级干部',
        host: '办公厅',
        dept: '科研部',
        days: 14,
        start: '2026-08-01',
        end: '2026-08-20',
        stuCount: 40,
        prog: 100,
        status: '待结班',
        admin: '王五',
        headTeacher: '王五',
        budgetTotal: 125000,
        courses: ['C02', 'C04'],
        archived: false
      },
      {
        id: 'B2495',
        name: '2026年涉外礼宾礼仪业务能力提升班',
        cat: '政能班',
        target: '外事礼宾干部',
        host: '礼宾司',
        dept: '培训部',
        days: 10,
        start: '2026-08-10',
        end: '2026-08-20',
        stuCount: 42,
        prog: 100,
        status: '待结班',
        admin: '张三',
        headTeacher: '张三',
        budgetTotal: 98000,
        courses: ['C04'],
        archived: false
      },
      {
        id: 'B2490',
        name: '2490期干部政能提升班',
        cat: '政能班',
        target: '处级干部',
        host: '机关党委',
        dept: '培训部',
        days: 20,
        start: '2026-06-10',
        end: '2026-07-05',
        stuCount: 50,
        prog: 100,
        status: '已结业',
        admin: '赵六',
        headTeacher: '钱老师',
        budgetTotal: 190000,
        courses: ['C01', 'C05'],
        archived: true
      },
      {
        id: 'B2488',
        name: '2026年领事保护实务与应急处突培训班',
        cat: '政能班',
        target: '领事干部',
        host: '领事司',
        dept: '培训部',
        days: 14,
        start: '2026-07-10',
        end: '2026-07-24',
        stuCount: 46,
        prog: 100,
        status: '已结业',
        admin: '王五',
        headTeacher: '王五',
        budgetTotal: 135000,
        courses: ['C03', 'C04'],
        archived: true
      },
      {
        id: 'B2485',
        name: '2485期外事干部英语强化研训班',
        cat: '专题研讨班',
        target: '青年干部',
        host: '干部司',
        dept: '教务管理办',
        days: 25,
        start: '2026-05-06',
        end: '2026-06-10',
        stuCount: 36,
        prog: 100,
        status: '已结业',
        admin: '张三',
        headTeacher: '张三',
        budgetTotal: 175000,
        courses: ['C04', 'C05'],
        archived: true
      },
      {
        id: 'B2482',
        name: '2026年春季学期司局级干部进修班',
        cat: '党校班',
        target: '司局级干部',
        host: '办公厅',
        dept: '教务管理办',
        days: 30,
        start: '2026-04-05',
        end: '2026-05-05',
        stuCount: 30,
        prog: 100,
        status: '已结业',
        admin: '李四',
        headTeacher: '李四',
        budgetTotal: 260000,
        courses: ['C01', 'C02', 'C06'],
        archived: true
      }
    ],

    // 课程体系与课程库 (PRD 4.2)
    courses: [
      { id: 'C01', name: '习近平外交思想核心要义深度解读', system: '习近平外交思想课程体系', type: '理论教学', field: '国际关系', level: '高阶', hours: 8, status: '启用', tag: '党性理论' },
      { id: 'C02', name: '大国外交与多边国际舞台博弈策略', system: '外交实务与战略研判体系', type: '案例教学', field: '多边外交', level: '高阶', hours: 6, status: '启用', tag: '案例实训' },
      { id: 'C03', name: '涉外法律合规与国家海外利益保护', system: '涉外法治保障课程体系', type: '政策解读', field: '涉外法治', level: '中阶', hours: 4, status: '启用', tag: '政策法规' },
      { id: 'C04', name: '高层外事礼仪、礼宾排序与涉外谈判实务', system: '外事实践能力进阶体系', type: '技能训练', field: '外事礼仪', level: '高阶', hours: 6, status: '启用', tag: '业务技能' },
      { id: 'C05', name: '突发外事舆情应对与多语种新闻发布', system: '公共外交与战略传播体系', type: '案例教学', field: '公共外交', level: '中阶', hours: 4, status: '启用', tag: '案例实训' },
      { id: 'C06', name: '驻外使领馆基层党建与干部心理调适', system: '干部队伍政治建设体系', type: '党性教育', field: '政治建设', level: '初阶', hours: 4, status: '启用', tag: '党性理论' }
    ],

    // 排课与日历数据 (PRD 4.3-P04/P05 状态机: 草稿/审核中/已排课/审批驳回/已作废)
    schedules: [
      {
        id: 'SCH-001',
        classId: 'B2503',
        className: '2503期处级干部进修班',
        courseId: 'C01',
        courseName: '习近平外交思想核心要义深度解读',
        teacherId: 'T01',
        teacherName: '欧阳文华 (特聘教授)',
        roomId: 'R101',
        roomName: '第一多媒体阶梯报告厅',
        date: '2026-09-25',
        timeSlot: '上午 08:30-11:30',
        dayIndex: 4, // 0~4 周一至周五
        period: 'am1',
        hours: 3,
        status: '已排课', // 正式锁定
        approvalId: 'APV-2026-001',
        remark: '开班第一讲，院领导巡课'
      },
      {
        id: 'SCH-002',
        classId: 'B2503',
        className: '2503期处级干部进修班',
        courseId: 'C04',
        courseName: '高层外事礼仪、礼宾排序与涉外谈判实务',
        teacherId: 'T02',
        teacherName: '司马仪 (前资深大使)',
        roomId: 'R203',
        roomName: '外事实战研讨模拟厅',
        date: '2026-09-25',
        timeSlot: '下午 14:00-17:00',
        dayIndex: 4,
        period: 'pm1',
        hours: 3,
        status: '审核中', // 预锁定
        approvalId: 'APV-2026-003',
        remark: '待处领导审核排课单'
      },
      {
        id: 'SCH-003',
        classId: 'B2503',
        className: '2503期处级干部进修班',
        courseId: 'C02',
        courseName: '大国外交与多边国际舞台博弈策略',
        teacherId: 'T03',
        teacherName: '诸葛宏 (外交研究所)',
        roomId: 'R102',
        roomName: '第二阶梯教室',
        date: '2026-09-28',
        timeSlot: '上午 08:30-11:30',
        dayIndex: 0,
        period: 'am1',
        hours: 3,
        status: '草稿',
        approvalId: null,
        remark: '教务拟排课'
      }
    ],

    // 审批单列表 (PRD 4.9 审批中心: 排课/预算/请假/调课)
    approvals: [
      {
        id: 'APV-2026-001',
        type: '排课审批',
        title: '2503班 09-25 上午 排课申请 (欧阳文华 / 报告厅)',
        classId: 'B2503',
        applicant: '张三 (办训人员)',
        submitTime: '2026-09-22 09:30',
        level: '二级审批 (处领导)',
        currentApprover: '处领导',
        status: '已通过',
        amount: null,
        detail: {
          course: '习近平外交思想核心要义深度解读',
          teacher: '欧阳文华 (特聘教授)',
          room: '第一多媒体阶梯报告厅',
          time: '2026-09-25 08:30-11:30'
        },
        logs: [
          { time: '2026-09-22 09:30', user: '张三', action: '提交排课申请单 (预锁定资源)' },
          { time: '2026-09-22 14:15', user: '李处长 (二级管理员)', action: '审批通过 (资源转为正式锁定)' }
        ]
      },
      {
        id: 'APV-2026-002',
        type: '预算特批',
        title: '2503期处级干部进修班 编制预算 (含超标特批与总额特批)',
        classId: 'B2503',
        applicant: '张三 (三级管理员)',
        submitTime: '2026-09-24 16:40',
        level: '一级审批 (院领导特批)', // >5万或含特批项
        currentApprover: '院领导',
        status: '待审批',
        amount: 185000,
        overLimitItems: ['住宿费(需特批): 单间420元/天(标准≤350)', '总额>5万元(自动追加一级审批)'],
        detail: {
          total: 185000,
          reason: '因班次学员含司局级外聘指导及重点涉外保密考察，需单间封闭住宿并含现场教学调研。'
        },
        logs: [
          { time: '2026-09-24 16:40', user: '张三', action: '录入明细并通过规则引擎硬校验，提交特批申请' },
          { time: '2026-09-24 17:30', user: '李处长 (二级处领导)', action: '处领导初审通过，根据制度自动升级路由至院领导特批' }
        ]
      },
      {
        id: 'APV-2026-003',
        type: '排课审批',
        title: '2503班 09-25 下午 排课申请 (司马仪 / 实战模拟厅)',
        classId: 'B2503',
        applicant: '张三 (办训人员)',
        submitTime: '2026-09-24 10:15',
        level: '二级审批 (处领导)',
        currentApprover: '李处长',
        status: '待审批',
        amount: null,
        detail: {
          course: '高层外事礼仪、礼宾排序与涉外谈判实务',
          teacher: '司马仪 (前资深大使)',
          room: '外事实战研讨模拟厅',
          time: '2026-09-25 14:00-17:00'
        },
        logs: [
          { time: '2026-09-24 10:15', user: '张三', action: '提交排课申请单 (已预锁定实战模拟厅及司马仪老师)' }
        ]
      },
      {
        id: 'APV-2026-004',
        type: '请假审批',
        title: '学员陈志强 2503班 09-26 事假 1 天申请',
        classId: 'B2503',
        applicant: '张三 (带班组织员代录)',
        submitTime: '2026-09-24 14:20',
        level: '二级审批 (处领导)',
        currentApprover: '李处长',
        status: '待审批',
        amount: null,
        detail: {
          student: '陈志强 (北美大洋洲司 · 调研员)',
          days: 1,
          date: '2026-09-26',
          reason: '派出单位紧急涉外重要公务磋商'
        },
        logs: [
          { time: '2026-09-24 14:20', user: '张三', action: '组织员依据派员单位公函录入请假申请' }
        ]
      }
    ],

    // 预算管控明细 (PRD 6.2 专项二 & 财务预算管理制度补充)
    budgets: {
      'B2503': {
        totalLimit: 200000,
        approvedTotal: 185000,
        spentTotal: 121500, // 已报销核销金额
        isLocked: true,     // 审批通过后自动锁定基线
        items: [
          { code: 'FY-001', name: '师资费', standard: '≤500元/天(正高),≤300(中级)', control: '禁止提交', budget: 45000, spent: 38000, status: '正常', remark: '正高级专家90人天' },
          { code: 'FY-002', name: '住宿费', standard: '≤350元/间天', control: '需特批', budget: 63000, spent: 48000, status: '特批超标', remark: '经院领导审批单间420元/天' },
          { code: 'FY-003', name: '伙食费', standard: '≤150元/人天', control: '禁止提交', budget: 33750, spent: 22000, status: '正常', remark: '学员自助餐+工作简餐' },
          { code: 'FY-004', name: '场地费', standard: '≤总预算30%', control: '需特批', budget: 22000, spent: 0, status: '正常', remark: '校外实训场地租赁' },
          { code: 'FY-005', name: '资料费', standard: '≤200元/人', control: '禁止提交', budget: 9000, spent: 6500, status: '正常', remark: '教材讲义及文具包' },
          { code: 'FY-006', name: '交通费', standard: '≤100元/人次', control: '禁止提交', budget: 4500, spent: 2000, status: '正常', remark: '统一安排大巴接送' },
          { code: 'FY-008', name: '公务接待费', standard: '≤总预算5%', control: '需特批', budget: 2750, spent: 1500, status: '正常', remark: '符合外事接待规定' },
          { code: 'FY-009', name: '调研考察费', standard: '≤总预算15%', control: '需特批', budget: 5000, spent: 3500, status: '正常', remark: '现场教学点门票与讲解' }
        ],
        bills: [
          { id: 'BL-01', item: '师资费', amount: 18000, vendor: '专家劳务课酬发放表(9人)', invoiceNo: 'FP20260901', time: '2026-09-10', status: '已核销' },
          { id: 'BL-02', item: '住宿费', amount: 35000, vendor: '京西宾馆结算凭证', invoiceNo: 'FP20260915', time: '2026-09-16', status: '已核销' },
          { id: 'BL-03', item: '伙食费', amount: 15000, vendor: '学院机关食堂转账单', invoiceNo: 'FP20260920', time: '2026-09-21', status: '已核销' }
        ]
      }
    },

    // 学员数据（含外事干部职级、政治礼宾顺序权重、考勤情况、成绩与照片）
    students: [
      { id: 'S101', name: '王振华', gender: '男', dept: '外交部办公厅', title: '正处长 / 一级调研员', rankLevel: 1, rankWeight: 98, phone: '13800010001', idCard: '110101197801011111', photo: '👤', attendRate: 100, score: 96, certNo: 'WJ-2026-0901', status: '在训' },
      { id: 'S102', name: '陈志强', gender: '男', dept: '北美大洋洲司', title: '副司长 / 巡视员', rankLevel: 0, rankWeight: 100, phone: '13800010002', idCard: '110101197505052222', photo: '👤', attendRate: 92, score: 94, certNo: 'WJ-2026-0902', status: '请假中' },
      { id: 'S103', name: '赵雅芝', gender: '女', dept: '欧洲司二处', title: '处长 / 一级调研员', rankLevel: 1, rankWeight: 97, phone: '13800010003', idCard: '110101198003033333', photo: '👤', attendRate: 100, score: 98, certNo: 'WJ-2026-0903', status: '在训' },
      { id: 'S104', name: '李建立', gender: '男', dept: '亚洲司一处', title: '副处长 / 二级调研员', rankLevel: 2, rankWeight: 89, phone: '13800010004', idCard: '110101198207074444', photo: '👤', attendRate: 98, score: 91, certNo: 'WJ-2026-0904', status: '在训' },
      { id: 'S105', name: '孙梅', gender: '女', dept: '国际司多边处', title: '副处长 / 二级调研员', rankLevel: 2, rankWeight: 88, phone: '13800010005', idCard: '110101198309095555', photo: '👤', attendRate: 100, score: 95, certNo: 'WJ-2026-0905', status: '在训' },
      { id: 'S106', name: '周立峰', gender: '男', dept: '边界与海洋事务司', title: '三级调研员', rankLevel: 3, rankWeight: 82, phone: '13800010006', idCard: '110101198511116666', photo: '👤', attendRate: 95, score: 87, certNo: 'WJ-2026-0906', status: '在训' },
      { id: 'S107', name: '钱文波', gender: '男', dept: '领事司涉外安全处', title: '三级调研员', rankLevel: 3, rankWeight: 81, phone: '13800010007', idCard: '110101198612127777', photo: '👤', attendRate: 100, score: 89, certNo: 'WJ-2026-0907', status: '在训' },
      { id: 'S108', name: '郑小敏', gender: '女', dept: '新闻司发布处', title: '四级调研员', rankLevel: 4, rankWeight: 75, phone: '13800010008', idCard: '110101198804048888', photo: '👤', attendRate: 100, score: 92, certNo: 'WJ-2026-0908', status: '在训' },
      { id: 'S109', name: '韩雪', gender: '女', dept: '外事翻译司', title: '高级翻译 / 副处级', rankLevel: 2, rankWeight: 86, phone: '13800010009', idCard: '110101198708089999', photo: '👤', attendRate: 100, score: 99, certNo: 'WJ-2026-0909', status: '在训' },
      { id: 'S110', name: '吴天豪', gender: '男', dept: '驻美使馆政治处', title: '一等秘书 / 副处级', rankLevel: 2, rankWeight: 87, phone: '13800010010', idCard: '110101198402020000', photo: '👤', attendRate: 90, score: 88, certNo: 'WJ-2026-0910', status: '在训' }
    ],

    // 师资库与分级分类标签 (PRD 4.6 & 6.1 专项一)
    teachers: [
      { id: 'T01', name: '欧阳文华', title: '特聘教授 / 博士生导师', dept: '中国国际问题研究院', field: '国际战略、习近平外交思想', levelTag: '国家部委级', domainTag: '外交理论', score: 9.8, hoursTotal: 120, status: '空闲' },
      { id: 'T02', name: '司马仪', title: '前驻外资深特命全权大使', dept: '外交部政策规划司退休干部', field: '大国外交、礼宾礼仪、涉外谈判', levelTag: '系统外事级', domainTag: '外事礼仪', score: 9.9, hoursTotal: 86, status: '空闲' },
      { id: 'T03', name: '诸葛宏', title: '研究员 / 所长', dept: '国际战略研究所', field: '多边安全、全球治理、博弈推演', levelTag: '高校科研级', domainTag: '案例实战', score: 9.5, hoursTotal: 64, status: '空闲' },
      { id: 'T04', name: '端木清', title: '教授', dept: '外交学院涉外法治研究中心', field: '涉外法律、海外利益安保', levelTag: '院内骨干级', domainTag: '涉外法治', score: 9.6, hoursTotal: 92, status: '空闲' }
    ],

    // 教室与智能人脸考勤门禁设备 (PRD 4.8 & 6.6 专项六)
    rooms: [
      { id: 'R101', name: '第一多媒体阶梯报告厅', capacity: 120, deviceId: 'DEV-FAC-01', location: '教学楼5层中区', status: '空闲', faceSyncStatus: '已同步(45人底库已下发)' },
      { id: 'R102', name: '第二阶梯教室', capacity: 80, deviceId: 'DEV-FAC-02', location: '教学楼5层西区', status: '空闲', faceSyncStatus: '已同步' },
      { id: 'R203', name: '外事实战研讨模拟厅', capacity: 50, deviceId: 'DEV-FAC-03', location: '教学楼6层研讨区', status: '已排课占用', faceSyncStatus: '已同步(45人底库已下发)' }
    ],

    // 三员用户与权限互斥配置 (PRD 6.3 专项三)
    threeUsers: [
      { id: 'SEC-01', name: '刘系统 (系统管理员)', type: '系统管理员', dept: '信息技术处', account: 'admin_sys', duties: '负责软硬件维护、网络监控、数据库配置', status: '在职' },
      { id: 'SEC-02', name: '陈保密 (安全保密管理员)', type: '安全保密管理员', dept: '保密办公室', account: 'admin_sec', duties: '负责用户账号开通、角色权限审批、分保密钥管控', status: '在职' },
      { id: 'SEC-03', name: '张审计 (安全审计员)', type: '安全审计员', dept: '纪检监督室', account: 'admin_aud', duties: '负责全系统操作日志审计、三员异常互斥监控、敏感访问追踪', status: '在职' }
    ],

    // 审计复核记录
    auditRecords: [
      { id: 'AUD-01', time: '2026-09-24 11:20', operator: '陈保密 (安全保密管理员)', target: '新增张三为班次管理员', reviewer: '张审计 (安全审计员)', status: '复核通过', result: '无互斥风险' },
      { id: 'AUD-02', time: '2026-09-20 15:40', operator: '刘系统 (系统管理员)', target: '注销备用考勤终端DEV-99', reviewer: '张审计 (安全审计员)', status: '复核通过', result: '双人核准' }
    ]
  };

  class TreaStore {
    constructor() {
      this.init();
    }

    init() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.save();
      } else {
        try {
          this.data = JSON.parse(stored);
          if (!this.data.classes || this.data.classes.length < 12) {
            this.data.classes = JSON.parse(JSON.stringify(DEFAULT_DATA.classes));
            this.save();
          }
        } catch (e) {
          console.error('Store parse error, resetting:', e);
          this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
          this.save();
        }
      }
    }

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    reset() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.save();
    }

    getBudget(classId) {
      if (!this.data.budgets) this.data.budgets = {};
      if (this.data.budgets[classId]) return this.data.budgets[classId];
      const cls = this.getClass(classId);
      const total = cls ? cls.budgetTotal : 150000;
      const spent = cls && cls.status === '已结业' ? Math.round(total * 0.95) : (cls && cls.status === '在办' ? Math.round(total * (cls.prog / 100)) : (cls && cls.status === '待结班' ? Math.round(total * 0.92) : 0));
      const bg = {
        totalLimit: Math.round(total * 1.1),
        approvedTotal: total,
        spentTotal: spent,
        isLocked: cls && cls.status !== '筹备',
        items: [
          { code: 'FY-001', name: '师资费', standard: '≤500元/天(正高),≤300(中级)', control: '禁止提交', budget: Math.round(total * 0.28), spent: Math.round(spent * 0.3), status: '正常', remark: '正高/副高专家授课课酬' },
          { code: 'FY-002', name: '住宿费', standard: '≤350元/间天', control: '需特批', budget: Math.round(total * 0.32), spent: Math.round(spent * 0.35), status: '正常', remark: '学院学员集中住宿' },
          { code: 'FY-003', name: '伙食费', standard: '≤150元/人天', control: '禁止提交', budget: Math.round(total * 0.18), spent: Math.round(spent * 0.18), status: '正常', remark: '学员自助工作餐' },
          { code: 'FY-004', name: '场地费', standard: '≤总预算30%', control: '需特批', budget: Math.round(total * 0.10), spent: Math.round(spent * 0.08), status: '正常', remark: '实训模拟厅与多媒体教室' },
          { code: 'FY-005', name: '资料费', standard: '≤200元/人', control: '禁止提交', budget: Math.round(total * 0.05), spent: Math.round(spent * 0.04), status: '正常', remark: '教学培训讲义印制与书籍' },
          { code: 'FY-006', name: '交通费', standard: '≤100元/人次', control: '禁止提交', budget: Math.round(total * 0.03), spent: Math.round(spent * 0.02), status: '正常', remark: '统一安排现场研学大巴接送' },
          { code: 'FY-008', name: '公务接待费', standard: '≤总预算5%', control: '需特批', budget: Math.round(total * 0.02), spent: Math.round(spent * 0.01), status: '正常', remark: '严格遵循外事接待规定' },
          { code: 'FY-009', name: '调研考察费', standard: '≤总预算15%', control: '需特批', budget: Math.round(total * 0.02), spent: Math.round(spent * 0.02), status: '正常', remark: '涉外现场教学点调研与讲解' }
        ],
        bills: spent > 0 ? [
          { id: 'BL-' + (classId || '01') + '-1', item: '师资费', amount: Math.round(spent * 0.4), vendor: '劳务报酬发放汇总表', invoiceNo: 'FP2026' + (cls ? cls.id : '01'), time: (cls ? cls.start : '2026-09-10'), status: '已核销' },
          { id: 'BL-' + (classId || '01') + '-2', item: '住宿与伙食', amount: Math.round(spent * 0.6), vendor: '培训保障中心结算单', invoiceNo: 'FP2026' + (cls ? cls.id : '02'), time: (cls ? cls.start : '2026-09-15'), status: '已核销' }
        ] : []
      };
      this.data.budgets[classId] = bg;
      this.save();
      return bg;
    }

    // ====== 用户与三员分立 ======
    getCurrentUser() {
      return this.data.currentUser;
    }

    switchUser(roleName) {
      const roleMap = {
        '院领导': { id: 'U100', name: '李院长', role: '一级管理员', roles: ['一级管理员', '院领导'], avatar: '李', dept: '院务会' },
        '处领导': { id: 'U102', name: '李处长', role: '二级管理员', roles: ['二级管理员', '处领导'], avatar: '李', dept: '教务管理处' },
        '办训人员': { id: 'U101', name: '张三', role: '三级管理员', roles: ['三级管理员', '班次管理员', '组织员'], avatar: '张', dept: '教务管理办' },
        '教研教师': { id: 'T01', name: '欧阳文华', role: '教研教师', roles: ['教研教师', '特聘专家'], avatar: '欧', dept: '中国国际问题研究院' },
        '系统管理员': { id: 'SEC-01', name: '刘系统', role: '系统管理员', roles: ['系统管理员'], avatar: '刘', dept: '信息技术处' },
        '安全保密管理员': { id: 'SEC-02', name: '陈保密', role: '安全保密管理员', roles: ['安全保密管理员'], avatar: '陈', dept: '保密办公室' },
        '安全审计员': { id: 'SEC-03', name: '张审计', role: '安全审计员', roles: ['安全审计员'], avatar: '张', dept: '纪检监督室' }
      };
      if (roleMap[roleName]) {
        this.data.currentUser = Object.assign({}, this.data.currentUser, roleMap[roleName]);
        this.save();
      }
    }

    // 三员互斥校验 (PRD 6.3 专项三)
    verifyThreeMembersMutualExclusion(targetUserId, assignRole) {
      const threeRoles = ['系统管理员', '安全保密管理员', '安全审计员'];
      if (!threeRoles.includes(assignRole)) return { valid: true };

      // 检查该用户是否已有其他两员身份
      const user = this.data.threeUsers.find(u => u.id === targetUserId);
      if (user && user.type !== assignRole && threeRoles.includes(user.type)) {
        return {
          valid: false,
          error: `【等保合规硬拦截】用户 ${user.name} 已经担任「${user.type}」，依据三员分立安全原则，同一自然人绝不能兼任「${assignRole}」！`
        };
      }
      return { valid: true };
    }

    // ====== 班次管理 ======
    getClasses() {
      return this.data.classes;
    }

    getClass(id) {
      return this.data.classes.find(c => c.id === id);
    }

    updateClassHeadTeacher(id, teacherName) {
      const cls = this.getClass(id);
      if (cls) {
        cls.headTeacher = teacherName;
        this.save();
        return true;
      }
      return false;
    }

    updateClassRoom(id, room) {
      const cls = this.getClass(id);
      if (cls) {
        cls.room = room;
        this.save();
        return true;
      }
      return false;
    }

    addClass(newClass) {
      newClass.id = 'B' + (2500 + this.data.classes.length + 1);
      newClass.prog = 0;
      newClass.status = '筹备';
      newClass.archived = false;
      this.data.classes.unshift(newClass);
      // 同时初始化该班次预算台账
      this.data.budgets[newClass.id] = {
        totalLimit: newClass.budgetTotal || 150000,
        approvedTotal: 0,
        spentTotal: 0,
        isLocked: false,
        items: JSON.parse(JSON.stringify(DEFAULT_DATA.budgets['B2503'].items.map(it => ({ ...it, budget: 0, spent: 0 })))),
        bills: []
      };
      this.save();
      return newClass;
    }

    // ====== 拖拽排课与审批状态流转 (PRD 4.3-P04/P05 & 6.4 专项四) ======
    getSchedules(classId) {
      if (classId) return this.data.schedules.filter(s => s.classId === classId);
      return this.data.schedules;
    }

    // 提交排课申请单 (进入“审核中”，预锁定师资和场地资源)
    submitSchedule(scheduleData) {
      const schId = 'SCH-' + String(this.data.schedules.length + 1).padStart(3, '0');
      const apvId = 'APV-2026-' + String(this.data.approvals.length + 1).padStart(3, '0');

      const sch = Object.assign({}, scheduleData, {
        id: schId,
        status: '审核中', // 预锁定
        approvalId: apvId
      });
      this.data.schedules.push(sch);

      // 联动生成审批中心待办 (打通审批)
      const apv = {
        id: apvId,
        type: '排课审批',
        title: `${sch.className} ${sch.date} ${sch.courseName} 排课申请`,
        classId: sch.classId,
        applicant: this.data.currentUser.name + ' (办训人员)',
        submitTime: new Date().toLocaleString(),
        level: '二级审批 (处领导)',
        currentApprover: '处领导',
        status: '待审批',
        amount: null,
        detail: {
          course: sch.courseName,
          teacher: sch.teacherName,
          room: sch.roomName,
          time: `${sch.date} ${sch.timeSlot}`
        },
        logs: [
          { time: new Date().toLocaleString(), user: this.data.currentUser.name, action: '提交排课申请单 (系统已即时预锁定师资与场地资源)' }
        ]
      };
      this.data.approvals.unshift(apv);
      this.save();
      return { schedule: sch, approval: apv };
    }

    // 审批通过 / 驳回 / 作废
    reviewApproval(approvalId, isApprove, remark = '') {
      const apv = this.data.approvals.find(a => a.id === approvalId);
      if (!apv) return false;

      const user = this.data.currentUser;
      const now = new Date().toLocaleString();

      if (isApprove) {
        apv.status = '已通过';
        apv.logs.push({ time: now, user: user.name + ` (${user.role})`, action: `审批通过。${remark}` });

        // 如果是排课审批，将排课从“审核中”转为“已排课” (正式锁定)
        if (apv.type === '排课审批') {
          const sch = this.data.schedules.find(s => s.approvalId === apv.id);
          if (sch) sch.status = '已排课';
        }
        // 如果是预算特批
        if (apv.type === '预算特批') {
          const bg = this.data.budgets[apv.classId];
          if (bg) {
            bg.isLocked = true;
            bg.approvedTotal = apv.amount;
          }
        }
      } else {
        apv.status = '已驳回';
        apv.logs.push({ time: now, user: user.name + ` (${user.role})`, action: `审批驳回：${remark} (已自动释放预锁定资源)` });

        // 释放排课资源
        if (apv.type === '排课审批') {
          const sch = this.data.schedules.find(s => s.approvalId === apv.id);
          if (sch) sch.status = '审批驳回'; // 资源释放
        }
      }
      this.save();
      return true;
    }

    // ====== 专项二：FY-001 ~ FY-009 预算规则校验引擎 (Rule Engine) ======
    checkBudgetRule(code, amount, params = {}) {
      // 规则库核心逻辑
      const rules = {
        'FY-001': {
          name: '师资费',
          desc: '副高及以上≤500元/天，中级≤300元/天',
          check: (val, { days = 1, level = '副高' }) => {
            const limit = (level === '正高' || level === '副高') ? 500 : 300;
            const maxAllowed = limit * days;
            if (val > maxAllowed) {
              return { pass: false, type: '禁止提交', limit: maxAllowed, suggest: maxAllowed, msg: `师资费超标！${level}每天最高${limit}元，${days}天最高为${maxAllowed}元。按规定【禁止提交】！` };
            }
            return { pass: true };
          }
        },
        'FY-002': {
          name: '住宿费',
          desc: '单间≤350元/间天，超标需特批',
          check: (val, { days = 1, rooms = 1 }) => {
            const maxStandard = 350 * days * rooms;
            if (val > maxStandard) {
              return { pass: false, type: '需特批', limit: maxStandard, suggest: maxStandard, msg: `住宿费超出标准(≤350元/间天)！超出${val - maxStandard}元。允许提交但【强制路由一级审批(院领导特批)】，必须填写超标说明！` };
            }
            return { pass: true };
          }
        },
        'FY-003': {
          name: '伙食费',
          desc: '≤150元/人天，不得使用高档食材酒水',
          check: (val, { days = 1, persons = 1 }) => {
            const maxAllowed = 150 * days * persons;
            if (val > maxAllowed) {
              return { pass: false, type: '禁止提交', limit: maxAllowed, suggest: maxAllowed, msg: `伙食费超标！人均每日上限150元，${persons}人${days}天上限为${maxAllowed}元。按规定【禁止提交】！` };
            }
            return { pass: true };
          }
        },
        'FY-004': {
          name: '场地费',
          desc: '≤总预算30%，校外场地比价≥3家',
          check: (val, { totalBudget = 100000 }) => {
            const maxAllowed = totalBudget * 0.3;
            if (val > maxAllowed) {
              return { pass: false, type: '需特批', limit: maxAllowed, suggest: Math.floor(maxAllowed), msg: `场地费超出总预算30%上限(最高${maxAllowed}元)！须履行【一级特批程序】并附三家比价材料。` };
            }
            return { pass: true };
          }
        },
        'FY-005': {
          name: '资料费',
          desc: '≤200元/人，鼓励电子化',
          check: (val, { persons = 1 }) => {
            const maxAllowed = 200 * persons;
            if (val > maxAllowed) {
              return { pass: false, type: '禁止提交', limit: maxAllowed, suggest: maxAllowed, msg: `资料费超标！人均上限200元，${persons}人上限为${maxAllowed}元。按规定【禁止提交】！` };
            }
            return { pass: true };
          }
        },
        'FY-006': {
          name: '交通费',
          desc: '市内交通≤100元/人次',
          check: (val, { trips = 1, persons = 1 }) => {
            const maxAllowed = 100 * trips * persons;
            if (val > maxAllowed) {
              return { pass: false, type: '禁止提交', limit: maxAllowed, suggest: maxAllowed, msg: `交通费超标！市内交通每人次最高100元。按规定【禁止提交】！` };
            }
            return { pass: true };
          }
        },
        'FY-008': {
          name: '公务接待费',
          desc: '≤总预算5%，提供公函与清单',
          check: (val, { totalBudget = 100000 }) => {
            const maxAllowed = totalBudget * 0.05;
            if (val > maxAllowed) {
              return { pass: false, type: '需特批', limit: maxAllowed, suggest: Math.floor(maxAllowed), msg: `公务接待费超上限(≤5%，最高${maxAllowed}元)！超出廉政标准，【需院领导一级特批】。` };
            }
            return { pass: true };
          }
        },
        'FY-009': {
          name: '调研考察费',
          desc: '≤总预算15%，现场教学讲解门票',
          check: (val, { totalBudget = 100000 }) => {
            const maxAllowed = totalBudget * 0.15;
            if (val > maxAllowed) {
              return { pass: false, type: '需特批', limit: maxAllowed, suggest: Math.floor(maxAllowed), msg: `调研考察费超出总预算15%上限(最高${maxAllowed}元)！【需特批】并附教学审批路线。` };
            }
            return { pass: true };
          }
        }
      };

      if (!rules[code]) return { pass: true };
      return rules[code].check(amount, params);
    }

    // 提交班次预算申请 (分级审批: ≤5万处领导, >5万追加院领导)
    submitBudgetPlan(classId, budgetItems, totalAmount, reason = '') {
      const cls = this.getClass(classId);
      const isOver50k = totalAmount > 50000;
      let hasSpecialApproval = false;
      const overLimits = [];

      budgetItems.forEach(item => {
        if (item.ruleResult && !item.ruleResult.pass) {
          if (item.ruleResult.type === '需特批') {
            hasSpecialApproval = true;
            overLimits.push(`${item.name}: ${item.ruleResult.msg}`);
          }
        }
      });

      const needLevel1 = isOver50k || hasSpecialApproval;
      const apvId = 'APV-2026-' + String(this.data.approvals.length + 1).padStart(3, '0');

      const apv = {
        id: apvId,
        type: '预算特批',
        title: `${cls.name} 经费预算审批 (${(totalAmount/10000).toFixed(1)}万元${needLevel1 ? '·含特批/超5万' : ''})`,
        classId: classId,
        applicant: this.data.currentUser.name + ' (带班教务)',
        submitTime: new Date().toLocaleString(),
        level: needLevel1 ? '一级审批 (院领导特批)' : '二级审批 (处领导)',
        currentApprover: needLevel1 ? '院领导' : '处领导',
        status: '待审批',
        amount: totalAmount,
        overLimitItems: overLimits,
        detail: {
          total: totalAmount,
          reason: reason || (needLevel1 ? '预算总额超5万元或包含特批科目，系统自动路由一级特批。' : '合规预算，处级审批生效。')
        },
        logs: [
          { time: new Date().toLocaleString(), user: this.data.currentUser.name, action: `录入预算明细完成，系统规则引擎校验完毕，自动路由至【${needLevel1 ? '院领导一级特批' : '处领导二级审批'}】` }
        ]
      };

      this.data.approvals.unshift(apv);
      if (this.data.budgets[classId]) {
        this.data.budgets[classId].items = budgetItems;
      }
      this.save();
      return apv;
    }

    // ====== 外交与外事干部礼宾顺序算法 (Protocol Sorting Algorithm) ======
    // 规则：按政治职务与职级权重 (rankWeight) 从高到低降序；同职级按部门重要度与姓名拼音排序
    getStudentsSortedByProtocol() {
      return [...this.data.students].sort((a, b) => {
        if (b.rankWeight !== a.rankWeight) return b.rankWeight - a.rankWeight;
        return a.name.localeCompare(b.name, 'zh-Hans-CN');
      });
    }

    // 座位排布算法：职级从高到低，位置“从前到后、从中间到两侧”
    generateSeatLayout(rows = 5, cols = 8) {
      const sorted = this.getStudentsSortedByProtocol();
      const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
      const centerCol = Math.floor(cols / 2); // 中间列
      let stuIdx = 0;

      for (let r = 0; r < rows; r++) {
        // 每行从中间向两侧摆放：先中间，再中偏右，再中偏左...
        const rowPositions = [];
        rowPositions.push(centerCol);
        for (let offset = 1; offset <= centerCol; offset++) {
          if (centerCol - offset >= 0) rowPositions.push(centerCol - offset);
          if (centerCol + offset < cols) rowPositions.push(centerCol + offset);
        }

        for (let colPos of rowPositions) {
          if (stuIdx < sorted.length) {
            grid[r][colPos] = sorted[stuIdx++];
          }
        }
      }
      return grid;
    }

    // 档案归档完整性硬校验 (PRD 4.13)
    validateClassArchiving(classId) {
      const cls = this.getClass(classId);
      if (!cls) return { pass: false, error: '班次不存在' };

      const errors = [];
      const schedules = this.getSchedules(classId);
      const budget = this.data.budgets[classId];

      if (schedules.length === 0) {
        errors.push('课表记录缺失：未找到已执行的排课日程');
      }
      if (!budget || !budget.isLocked) {
        errors.push('预算决算缺失：该班次经费未完成审批锁定或结算');
      }
      if (cls.prog < 100 && cls.status !== '已结业' && cls.status !== '待结班') {
        errors.push(`教学周期未完结：当前进度 ${cls.prog}%，班次状态为「${cls.status}」`);
      }

      return {
        pass: errors.length === 0,
        errors: errors,
        checkItems: [
          { name: '班次学员花名册 (含干部职级与学籍)', pass: true },
          { name: '全周期教学课表与授课师资考勤', pass: schedules.length > 0 },
          { name: '学员结业考核成绩与电子证书归档', pass: true },
          { name: '多维度教学评估报告与教员授课档案', pass: true },
          { name: '财务预算执行三对照表与报销发票清单', pass: budget && budget.isLocked },
          { name: '训后岗位成效回访登记表', pass: true }
        ]
      };
    }
  }

  global.TREA_STORE = new TreaStore();
})(window);
