// ============================================================================
// 第七题组：行政部教育与嘴硬程度测试（Pool 07）
// 向量组：
//   I1: (DOG_DASAO,   DOG_NIUMA,  DOG_JIXIE)
//   J1: (DOG_LAOMU,   DOG_LAOSHI, DOG_DALANG)
//   K1: (DOG_XIAONAI, DOG_BIANMU, DOG_HASHIQI)
//   L1: (DOG_JILV,    DOG_BAIQUAN, DOG_SAMOYE)
// ============================================================================

=== Pool_07__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 晨间点名】</p>

行政部推行“清晨六点思想建设早操”，谁迟到就要被留下来单独谈心。面对这项铁血制度，你的日常状态是：

+   [五点半就戴着红袖章站在门口抓人，谁领口没扣好或者眼神不够虔诚立刻记名通报！]
    ~ Apply__Choice(DOG_JILV, DOG_BAIQUAN, DOG_SAMOYE)
    # CLEAR
    ->->

+   [故意踩着六点零一秒进门：“听说迟到能留下来单独上强度？还有这种好事？”]
    ~ Apply__Choice(DOG_DASAO, DOG_NIUMA, DOG_JIXIE)
    # CLEAR
    ->->

+   [按生物钟准点到场，顺手给宿醉起不来的年轻后辈塞了包热豆浆打掩护]
    ~ Apply__Choice(DOG_LAOMU, DOG_LAOSHI, DOG_DALANG)
    # CLEAR
    ->->

+   [顶着一头睡炸的呆毛钻在队伍最中间，眼睛闭着都能靠肌肉记忆跟着大伙整齐摇尾巴]
    ~ Apply__Choice(DOG_XIAONAI, DOG_BIANMU, DOG_HASHIQI)
    # CLEAR
    ->->

=== Pool_07__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 限制锚体验】</p>

假设研发部要给你安装一枚测试版“服从限制锚”，安装师问你对参数灵敏度有什么个人诉求，你会说：

+   [“直接拉到最大功率焊死吧！不需要保留任何逃跑冗余，请务必把我调成最耐玩的型号！”]
    ~ Apply__Choice(DOG_DASAO, DOG_NIUMA, DOG_JIXIE)
    # CLEAR
    ->->

+   [眨着湿漉漉的大眼睛歪头卖萌：“痛不痛呀？装完之后会有骨头饼干奖励吗？”]
    ~ Apply__Choice(DOG_XIAONAI, DOG_BIANMU, DOG_HASHIQI)
    # CLEAR
    ->->

+   [沉稳点头：“按标准工业安全规范走就行，别影响我日常带队干活和照顾下属。”]
    ~ Apply__Choice(DOG_LAOMU, DOG_LAOSHI, DOG_DALANG)
    # CLEAR
    ->->

+   [“装完我的赶紧去给隔壁那几个刺头也装上！一个个散漫得不成体统！”]
    ~ Apply__Choice(DOG_JILV, DOG_BAIQUAN, DOG_SAMOYE)
    # CLEAR
    ->->

=== Pool_07__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 展览柜值班】</p>

运输部开辟了“优秀藏品静态展览”创收业务，需要抽调一名员工站在玻璃恒温柜里当半天模特。被抽中后你的表现是：

+   [把胸脯挺得笔直，像雕塑一样纹丝不动站满全程，谁在玻璃外指指点点就拿眼神镇住谁]
    ~ Apply__Choice(DOG_LAOMU, DOG_LAOSHI, DOG_DALANG)
    # CLEAR
    ->->

+   [不仅主动换上最涩的束缚姿势贴在玻璃上，还嫌半天太短申请包月常驻]
    ~ Apply__Choice(DOG_DASAO, DOG_NIUMA, DOG_JIXIE)
    # CLEAR
    ->->

+   [隔着玻璃跟外面的参观者玩石头剪刀布，逗得整条走廊跟逛动物园一样热闹]
    ~ Apply__Choice(DOG_XIAONAI, DOG_BIANMU, DOG_HASHIQI)
    # CLEAR
    ->->

+   [一边维持标准示范姿态，一边在心里暗暗记下外面哪几个同事笑得最大声准备回头算账]
    ~ Apply__Choice(DOG_JILV, DOG_BAIQUAN, DOG_SAMOYE)
    # CLEAR
    ->->
