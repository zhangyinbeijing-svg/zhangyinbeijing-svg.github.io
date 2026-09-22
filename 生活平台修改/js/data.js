// 核心数据模型与配置数据
window.APP_DATA = {
  // 当前运行方案: 'scheme1' (标准固定模式) | 'scheme2' (模版配置与统计看板模式)
  currentScheme: 'scheme1',
  
  // 当前视图: 'mobile' (小程序用户端) | 'admin' (管理后台端) | 'docs' (方案对比说明)
  currentView: 'mobile',

  // 小程序当前选择的业务订单: 'hukou' | 'supplies'
  currentMobileBiz: 'hukou',

  // 订单数据（对齐用户截图2）
  orders: {
    hukou: {
      id: 'DB20260109105058A0001',
      bizType: '集体户籍首页借用',
      bizKey: 'hukou',
      status: '已完成',
      applicant: '张寅',
      phone: '138****5448',
      applyType: '本人借用',
      purposeType: '夫妻投靠落户',
      auditResult: '审核成功',
      validPeriod: '2026年02月09日(1个月)',
      auditNote: '112223',
      updateTime: '2026-01-09 10:53:12',
      explain: '123',
      tips: '222123',
      isFeedbackDone: false, // 是否已完成服务跟踪
      feedbackId: null
    },
    supplies: {
      id: 'BG20260218142012B0089',
      bizType: '办公用品',
      bizKey: 'supplies',
      status: '已完成',
      applicant: '李晓晨',
      phone: '139****7890',
      applyType: '部门申领',
      purposeType: '日常办公消耗物资',
      auditResult: '审核通过，已领用发放',
      validPeriod: '即领即用',
      auditNote: '已于物资库5号窗口核验签字发放',
      updateTime: '2026-02-18 14:20:12',
      explain: '申领A4复印纸2箱，黑色中性笔1盒，订书机1个',
      tips: '物资发放后请妥善保管，如需领用硒鼓墨盒请提前3日提报',
      isFeedbackDone: false,
      feedbackId: null
    }
  },

  // 方案一：固定题目数据（严格限定：填空、问答、选择）
  scheme1Questions: {
    hukou: [
      {
        id: 'q1',
        type: 'choice_single', // 选择题-单选
        typeName: '选择题(单选)',
        title: '本次办理户籍首页借用，经办窗口/人员的服务态度与办事效率如何？',
        required: true,
        options: ['非常满意，热情高效', '满意，流程顺畅', '基本满意，耗时略长', '不满意，办理拖沓']
      },
      {
        id: 'q2',
        type: 'choice_multi', // 选择题-多选
        typeName: '选择题(多选)',
        title: '在借用办理全流程中，您认为哪些环节体验较好？（可多选）',
        required: true,
        options: ['线上申请与审批迅速', '线下核验取件快捷', '户籍首页原件与印章完备清晰', '借还时限与注意事项提醒到位']
      },
      {
        id: 'q3',
        type: 'fill', // 填空题
        typeName: '填空题',
        title: '本次借用户籍首页实际归还（或预计归还）的具体日期是？',
        required: true,
        placeholder: '例如：2026-03-01，借用约3天'
      },
      {
        id: 'q4',
        type: 'fill', // 填空题
        typeName: '填空题',
        title: '您本次借用户籍首页的主要受理窗口/网点是？',
        required: false,
        placeholder: '例如：行政服务大厅3号户籍窗口'
      },
      {
        id: 'q5',
        type: 'essay', // 问答题
        typeName: '问答题',
        title: '您对集体户籍首页借用、使用及归还流程有何改进建议？',
        required: false,
        placeholder: '请输入您的意见或建议，协助我们持续优化流程体验（限300字）'
      }
    ],
    supplies: [
      {
        id: 'sq1',
        type: 'choice_single',
        typeName: '选择题(单选)',
        title: '本次申请领用的办公用品，发放时效与核验效率满意度如何？',
        required: true,
        options: ['非常及时，随申随取', '比较及时，半日内发放', '一般，排队等待较久', '较慢，影响办公进度']
      },
      {
        id: 'sq2',
        type: 'choice_multi',
        typeName: '选择题(多选)',
        title: '本次领用物资的品质与规格是否满足您的工作需要？（可多选）',
        required: true,
        options: ['物资质量优良无损坏', '规格型号与申请一致', '领用清单清晰明了', '物资包装完好整洁']
      },
      {
        id: 'sq3',
        type: 'fill',
        typeName: '填空题',
        title: '本次领用物资中，您平时消耗频次最高或最紧缺的是哪一项？',
        required: true,
        placeholder: '例如：A4复印纸 / 黑色中性笔 / 订书针'
      },
      {
        id: 'sq4',
        type: 'fill',
        typeName: '填空题',
        title: '领用人所属部门及办公工位区域是？',
        required: false,
        placeholder: '例如：科技研发中心 6F-B区'
      },
      {
        id: 'sq5',
        type: 'essay',
        typeName: '问答题',
        title: '您希望办公用品库增添哪些常用物资？或对申领流程有何建议？',
        required: false,
        placeholder: '请输入您的需求建议，协助我们优化物资采购与供给清单（限300字）'
      }
    ]
  },

  // 方案一：固定问卷模版列表（系统内置，开箱即用，题型固定）
  scheme1Templates: [
    {
      id: 'TPL-FIXED-HK',
      bizType: 'hukou',
      name: '集体户籍首页借用服务跟踪模版 (固定标准)',
      version: 'V1.0 内置',
      status: '启用中',
      createTime: '2026-01-10',
      questionCount: 5,
      boundBiz: ['集体户籍首页借用'],
      description: '方案一系统固化标准模版，包含单选、多选、填空、问答题型，单据办结后自动推送',
      questionsSummary: '① 窗口态度与效率(单选)  ② 满意环节(多选)  ③ 预计归还日期(填空)  ④ 受理窗口(填空)  ⑤ 改进建议(问答)',
      statsRefId: 'TPL-HK-001'
    },
    {
      id: 'TPL-FIXED-SP',
      bizType: 'supplies',
      name: '办公用品领用服务跟踪模版 (固定标准)',
      version: 'V1.0 内置',
      status: '启用中',
      createTime: '2026-01-10',
      questionCount: 5,
      boundBiz: ['办公用品'],
      description: '方案一系统固化标准模版，包含单选、多选、填空、问答题型，领用签收后自动推送',
      questionsSummary: '① 发放时效与效率(单选)  ② 品质与规格(多选)  ③ 紧缺消耗品(填空)  ④ 所属部门工位(填空)  ⑤ 需求建议(问答)',
      statsRefId: 'TPL-SP-002'
    }
  ],

  // 方案二：自定义模版库
  scheme2Templates: [
    {
      id: 'TPL-HK-001',
      name: '集体户籍首页借用全周期服务跟踪模版(标准)',
      version: 'V1.2',
      status: '启用',
      createTime: '2026-01-15',
      questionCount: 5,
      boundBiz: ['集体户籍首页借用'],
      description: '涵盖窗口态度、办理时效、证件印章质量、归还计划及开放意见',
      questions: [
        {
          id: 'hk_q1',
          type: 'choice_single',
          typeName: '选择题(单选)',
          title: '本次办理户籍首页借用，经办窗口/人员的服务态度与办事效率如何？',
          required: true,
          options: ['非常满意，热情高效', '满意，流程顺畅', '基本满意，耗时略长', '不满意，办理拖沓']
        },
        {
          id: 'hk_q2',
          type: 'choice_multi',
          typeName: '选择题(多选)',
          title: '在借用办理全流程中，您认为哪些环节体验较好？（可多选）',
          required: true,
          options: ['线上申请与审批迅速', '线下核验取件快捷', '户籍首页原件与印章完备清晰', '借还时限与注意事项提醒到位']
        },
        {
          id: 'hk_q3',
          type: 'fill',
          typeName: '填空题',
          title: '本次借用户籍首页实际归还（或预计归还）的具体日期是？',
          required: true,
          placeholder: '例如：2026-03-01，借用约3天'
        },
        {
          id: 'hk_q4',
          type: 'fill',
          typeName: '填空题',
          title: '您本次借用户籍首页的主要受理窗口/网点是？',
          required: false,
          placeholder: '例如：行政服务大厅3号户籍窗口'
        },
        {
          id: 'hk_q5',
          type: 'essay',
          typeName: '问答题',
          title: '您对集体户籍首页借用、使用及归还流程有何改进建议？',
          required: false,
          placeholder: '请输入您的意见或建议，协助我们持续优化流程体验（限300字）'
        }
      ]
    },
    {
      id: 'TPL-SP-002',
      name: '办公用品领用满意度与消耗跟踪模版',
      version: 'V2.0',
      status: '启用',
      createTime: '2026-02-01',
      questionCount: 5,
      boundBiz: ['办公用品'],
      description: '涵盖发放时效、物资规格品质、高频耗品统计及备料建议',
      questions: [
        {
          id: 'sp_q1',
          type: 'choice_single',
          typeName: '选择题(单选)',
          title: '本次申请领用的办公用品，发放时效与核验效率满意度如何？',
          required: true,
          options: ['非常及时，随申随取', '比较及时，半日内发放', '一般，排队等待较久', '较慢，影响办公进度']
        },
        {
          id: 'sp_q2',
          type: 'choice_multi',
          typeName: '选择题(多选)',
          title: '本次领用物资的品质与规格是否满足您的工作需要？（可多选）',
          required: true,
          options: ['物资质量优良无损坏', '规格型号与申请一致', '领用清单清晰明了', '物资包装完好整洁']
        },
        {
          id: 'sp_q3',
          type: 'fill',
          typeName: '填空题',
          title: '本次领用物资中，您平时消耗频次最高或最紧缺的是哪一项？',
          required: true,
          placeholder: '例如：A4复印纸 / 黑色中性笔 / 订书针'
        },
        {
          id: 'sp_q4',
          type: 'fill',
          typeName: '填空题',
          title: '领用人所属部门及办公工位区域是？',
          required: false,
          placeholder: '例如：科技研发中心 6F-B区'
        },
        {
          id: 'sp_q5',
          type: 'essay',
          typeName: '问答题',
          title: '您希望办公用品库增添哪些常用物资？或对申领流程有何建议？',
          required: false,
          placeholder: '请输入您的需求建议，协助我们优化物资采购与供给清单（限300字）'
        }
      ]
    },
    {
      id: 'TPL-CM-003',
      name: '政务与综合行政公共服务满意度通用调查模版',
      version: 'V1.0',
      status: '未启用',
      createTime: '2026-02-20',
      questionCount: 3,
      boundBiz: [],
      description: '适用于通用行政类申请的快速单选与建议问答',
      questions: [
        {
          id: 'cm_q1',
          type: 'choice_single',
          typeName: '选择题(单选)',
          title: '本次综合服务事项的受理时效与服务态度综合评价？',
          required: true,
          options: ['非常满意', '满意', '基本满意', '不满意']
        },
        {
          id: 'cm_q2',
          type: 'fill',
          typeName: '填空题',
          title: '您的所属部门或经办联系方式是？',
          required: true,
          placeholder: '例如：财务部 - 张女士 13800000000'
        },
        {
          id: 'cm_q3',
          type: 'essay',
          typeName: '问答题',
          title: '请留下您的其他意见与改进建议：',
          required: false,
          placeholder: '请输入您的具体建议或诉求'
        }
      ]
    }
  ],

  // 方案二：业务与模版绑定关系
  bizBindings: [
    {
      bizCode: 'hukou',
      bizName: '集体户籍首页借用',
      moduleCategory: '户籍与身份服务',
      templateId: 'TPL-HK-001',
      templateName: '集体户籍首页借用全周期服务跟踪模版(标准)',
      triggerPoint: '订单变更为[已完成]后即刻开放',
      status: true,
      lastUpdated: '2026-02-10 16:30'
    },
    {
      bizCode: 'supplies',
      bizName: '办公用品',
      moduleCategory: '后勤与办公支持',
      templateId: 'TPL-SP-002',
      templateName: '办公用品领用满意度与消耗跟踪模版',
      triggerPoint: '领用确认签字完成时开放',
      status: true,
      lastUpdated: '2026-02-18 10:15'
    }
  ],

  // 后台「服务跟踪」列表初始数据（对齐用户截图1风格）
  trackingRecords: [
    {
      id: '562131199502495744',
      bizType: '集体户籍首页借用',
      orderId: 'DB20260109105058A0001',
      userName: '刘宝玉',
      phone: '157****5456',
      status: '已反馈',
      submitTime: '2026-09-22 13:28:41',
      answers: {
        'q1': '非常满意，热情高效',
        'q2': ['线上申请与审批迅速', '户籍首页原件与印章完备清晰'],
        'q3': '2026-09-25，借用3天',
        'q4': '市民综合服务大厅3号户籍窗口',
        'q5': '前台经办人员很耐心，取件5分钟就完成了，非常方便！'
      }
    },
    {
      id: '544279914074034176',
      bizType: '办公用品',
      orderId: 'BG20260804071403C8120',
      userName: '刘璐',
      phone: '156****5905',
      status: '已反馈',
      submitTime: '2026-08-04 07:14:03',
      answers: {
        'sq1': '比较及时，半日内发放',
        'sq2': ['物资质量优良无损坏', '规格型号与申请一致'],
        'sq3': 'A4复印纸与蓝色中性笔',
        'sq4': '技术研发中心-4F',
        'sq5': '建议仓库多采购一些细头荧光笔，日常开会标记重点很需要。'
      }
    },
    {
      id: '540300127708139520',
      bizType: '集体户籍首页借用',
      orderId: 'DB20260724080339A4410',
      userName: '顾松华',
      phone: '139****9720',
      status: '未反馈',
      submitTime: '2026-07-24 08:03:39',
      answers: {
        'q1': '基本满意，耗时略长',
        'q2': ['线上申请与审批迅速'],
        'q3': '2026-07-30，借用7天',
        'q4': '城南政务便民中心',
        'q5': '落户派出所排期较久，希望借出期限能从1个月放宽支持线上申请续借。'
      }
    },
    {
      id: '537417728580120576',
      bizType: '办公用品',
      orderId: 'BG20260716084611B2109',
      userName: '谢超',
      phone: '186****5203',
      status: '已反馈',
      submitTime: '2026-07-16 08:46:11',
      answers: {
        'sq1': '非常及时，随申随取',
        'sq2': ['物资质量优良无损坏', '包装完好整洁'],
        'sq3': 'A4复印纸与长尾夹',
        'sq4': '市场运营部-2F',
        'sq5': '服务态度很好，希望能增加彩色记号笔配置。'
      }
    },
    {
      id: '524702283505168768',
      bizType: '集体户籍首页借用',
      orderId: 'DB20260611123711C9002',
      userName: '梁迪',
      phone: '188****1830',
      status: '已反馈',
      submitTime: '2026-06-11 12:37:11',
      answers: {
        'q1': '非常满意，热情高效',
        'q2': ['线上申请与审批迅速', '线下核验取件快捷', '户籍首页原件与印章完备清晰'],
        'q3': '2026-06-15，借用4天',
        'q4': '市民之家户政大厅',
        'q5': '一切顺利，办事窗口非常规范，赞！'
      }
    },
    {
      id: '442581809243533312',
      bizType: '办公用品',
      orderId: 'BG20251027160206A1009',
      userName: '海江',
      phone: '139****5105',
      status: '未反馈',
      submitTime: '2025-10-27 16:02:06',
      answers: {
        'sq1': '一般，排队等待较久',
        'sq2': ['物资质量优良无损坏'],
        'sq3': '黑色签字笔',
        'sq4': '财务审计部-3F',
        'sq5': '周一上午领用人数较多，建议按部门分批次预约领用。'
      }
    }
  ],

  // 方案二：统计分析看板数据（按模版维度区分）
  statistics: {
    // 按模版ID索引的统计数据
    byTemplate: {
      'TPL-HK-001': {
        templateName: '集体户籍首页借用全周期服务跟踪模版(标准)',
        kpis: {
          totalFeedbacks: 812,
          fillRate: '82.6%',
          feedbackedCount: 672,
          unfeedbackedCount: 140
        },
        questionStats: [
          {
            title: '经办窗口/人员的服务态度与办事效率',
            type: '选择题(单选)',
            options: [
              { label: '非常满意，热情高效', count: 520, percent: 64 },
              { label: '满意，流程顺畅', count: 188, percent: 23 },
              { label: '基本满意，耗时略长', count: 80, percent: 10 },
              { label: '不满意，办理拖沓', count: 24, percent: 3 }
            ]
          },
          {
            title: '哪些环节体验较好（多选）',
            type: '选择题(多选)',
            options: [
              { label: '线上申请与审批迅速', count: 680, percent: 85 },
              { label: '户籍原件与印章清晰规范', count: 648, percent: 81 },
              { label: '线下核验取件快捷', count: 592, percent: 74 },
              { label: '借还时限与注意事项提醒到位', count: 512, percent: 64 }
            ]
          },
          {
            title: '本次借用户籍首页实际借还周期（填空题聚类）',
            type: '填空题',
            options: [
              { label: '1~3天内快速归还', count: 486, percent: 72 },
              { label: '4~7天正常归还', count: 154, percent: 23 },
              { label: '7天以上（含申请延期）', count: 32, percent: 5 }
            ]
          },
          {
            title: '主要受理窗口分布（填空题聚类）',
            type: '填空题',
            options: [
              { label: '行政大厅3号户籍窗口', count: 350, percent: 52 },
              { label: '市民服务中心2号窗口', count: 228, percent: 34 },
              { label: '总部综合办公区窗口', count: 94, percent: 14 }
            ]
          }
        ]
      },
      'TPL-SP-002': {
        templateName: '办公用品领用满意度与消耗跟踪模版',
        kpis: {
          totalFeedbacks: 616,
          fillRate: '73.8%',
          feedbackedCount: 454,
          unfeedbackedCount: 162
        },
        questionStats: [
          {
            title: '发放时效与核验效率满意度',
            type: '选择题(单选)',
            options: [
              { label: '非常及时，随申随取', count: 312, percent: 51 },
              { label: '比较及时，半日内发放', count: 198, percent: 32 },
              { label: '一般，排队等待较久', count: 82, percent: 13 },
              { label: '较慢，影响办公进度', count: 24, percent: 4 }
            ]
          },
          {
            title: '物资品质与规格满足度（多选）',
            type: '选择题(多选)',
            options: [
              { label: '物资质量优良无损坏', count: 480, percent: 78 },
              { label: '规格型号与申请一致', count: 440, percent: 71 },
              { label: '领用清单清晰明了', count: 388, percent: 63 },
              { label: '物资包装完好整洁', count: 326, percent: 53 }
            ]
          },
          {
            title: '高频紧缺消耗品（填空题聚类）',
            type: '填空题',
            options: [
              { label: 'A4复印纸', count: 480, percent: 60 },
              { label: '黑色中性签字笔', count: 424, percent: 53 },
              { label: '订书机及订书针', count: 288, percent: 36 },
              { label: '长尾夹/回形针', count: 216, percent: 27 },
              { label: '文件夹与档案袋', count: 184, percent: 23 }
            ]
          }
        ]
      }
    }
  }
};
