// ============================================================================
// 第八题组：下班私密癖好与保养待遇（Pool 08）
// 向量组：
//   I2: (DOG_NIUMA,   DOG_JIXIE,   DOG_DASAO)
//   J2: (DOG_LAOSHI,  DOG_DALANG,  DOG_LAOMU)
//   K2: (DOG_BIANMU,  DOG_HASHIQI, DOG_XIAONAI)
//   L2: (DOG_BAIQUAN, DOG_SAMOYE,  DOG_JILV)
// ============================================================================

=== Pool_08__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 护理科保养】</p>

忙完一整周，你躺进了后勤部护理科的按摩理疗室。金毛犬理疗师笑呵呵地问今天想重点保养哪个部位，你脱口而出：

+   [“腰椎第四节和肩颈斜方肌，谢谢……天天坐工位敲表，骨头缝都快生锈了。”]
    ~ Submit__Answer(DOG_NIUMA, DOG_JIXIE, DOG_DASAO)
    # CLEAR
    -> Flow__Router.Dispatch

+   [浑身绷紧像块铁板：“不、不用摸尾巴根！我根本不累！……嘶——左边再按重一点！”]
    ~ Submit__Answer(DOG_BAIQUAN, DOG_SAMOYE, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“随便揉揉爪垫和肚皮就行～顺便问一下咱们理疗室的精油是不是偷换了供应商？”]
    ~ Submit__Answer(DOG_BIANMU, DOG_HASHIQI, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [客客气气地摆手：“不用麻烦小哥，我自己泡个热水脚擦把脸就成，留给受伤的兄弟们按吧。”]
    ~ Submit__Answer(DOG_LAOSHI, DOG_DALANG, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_08__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 宿舍突击检查】</p>

假如现在突击打开你的员工宿舍房门，里面最有可能出现以下哪幅画面？

+   [床铺叠得像豆腐块，哑铃、护具与泡着枸杞的搪瓷缸摆放得整整齐齐，一尘不染]
    ~ Submit__Answer(DOG_LAOSHI, DOG_DALANG, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [桌上支着三块屏幕跑自动脚本，枕头底下藏着整栋楼的万能门禁卡和半箱偷攒的零食]
    ~ Submit__Answer(DOG_BIANMU, DOG_HASHIQI, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [人正挂在充电桩（或行军床）上待机补觉，床头贴着精确到分钟的明日排班闹钟表]
    ~ Submit__Answer(DOG_NIUMA, DOG_JIXIE, DOG_DASAO)
    # CLEAR
    -> Flow__Router.Dispatch

+   [手忙脚乱把一床毛绒玩偶（或不可描述的定制项圈画册）往被窝里塞：“谁准你不敲门进来的？！”]
    ~ Submit__Answer(DOG_BAIQUAN, DOG_SAMOYE, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_08__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 遛弯路线】</p>

难得放风半天可以自由外出“遛弯”，没人跟着你，你会把这宝贵的半天花在哪里？

+   [去公园草坪追飞盘、刨泥坑、跟路过的每一只流浪猫吵架，把精力彻底挥霍一空！]
    ~ Submit__Answer(DOG_BIANMU, DOG_HASHIQI, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [逛菜市场挑两根最新鲜的筒骨回宿舍煲汤，顺便帮传达室大爷捎带两斤橘子]
    ~ Submit__Answer(DOG_LAOSHI, DOG_DALANG, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [找家格调隐秘的地下酒吧点一杯威士忌，优雅地坐在吧台角落观察今晚有没有顺眼的猎物]
    ~ Submit__Answer(DOG_BAIQUAN, DOG_SAMOYE, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [哪也不去，关掉所有通讯设备在被窝里昏天黑地睡死过去——移动一步都算浪费假期]
    ~ Submit__Answer(DOG_NIUMA, DOG_JIXIE, DOG_DASAO)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back
