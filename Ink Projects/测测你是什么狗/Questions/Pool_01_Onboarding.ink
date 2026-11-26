// ============================================================================
// 第一题组：入职与人事部初见（Pool 01）
// 向量组：
//   A1: (DOG_DASAO,   DOG_LAOMU,   DOG_JILV)
//   B1: (DOG_XIAONAI, DOG_LAOSHI,  DOG_NIUMA)
//   C1: (DOG_DALANG,  DOG_BAIQUAN, DOG_HASHIQI)
//   D1: (DOG_SAMOYE,  DOG_BIANMU,  DOG_JIXIE)
// ============================================================================

=== Pool_01__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 面试现场】</p>

你去黑川物流面试，人事部的红狐狸笑眯眯地递来一份厚达八十页的《入职知情同意书》，桌角还顺手放着一条亮闪闪的黑色项圈。此时你的第一反应是：

+   [眼睛一亮，合同看都不看先拿项圈比划自己脖子围度]
    ~ Apply__Choice(DOG_DASAO, DOG_LAOMU, DOG_JILV)
    # CLEAR
    ->->

+   [双手接过笔乖巧道谢，以为项圈是公司送给实习生的防丢工牌挂绳]
    ~ Apply__Choice(DOG_XIAONAI, DOG_LAOSHI, DOG_NIUMA)
    # CLEAR
    ->->

+   [眉头紧锁把桌子拍得咚一声：“少整花里胡哨的，先说清楚是不是正经安保岗！”]
    ~ Apply__Choice(DOG_DALANG, DOG_BAIQUAN, DOG_HASHIQI)
    # CLEAR
    ->->

+   [保持微笑快速翻到第七十三页附加免责条款，顺便瞄了一眼天花板的监控盲区]
    ~ Apply__Choice(DOG_SAMOYE, DOG_BIANMU, DOG_JIXIE)
    # CLEAR
    ->->

=== Pool_01__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 上门揽件】</p>

周末你在家睡懒觉，门外突然传来敲门声：“您好，黑川物流上门退货揽件！”透过猫眼，你看到门外站着一头身材高大、气场微妙的白虎快递员。你会：

+   [礼貌开门递上打包好的纸箱，顺便热情地问师傅渴不渴要不要喝杯凉白开]
    ~ Apply__Choice(DOG_XIAONAI, DOG_LAOSHI, DOG_NIUMA)
    # CLEAR
    ->->

+   [隔着防盗链冷脸审视对方工牌：“我没下退货单，报一下运单号后四位。”]
    ~ Apply__Choice(DOG_SAMOYE, DOG_BIANMU, DOG_JIXIE)
    # CLEAR
    ->->

+   [领口故意往下扯了两寸才去开门：“师傅，没有退货……但你看我本人能寄吗？”]
    ~ Apply__Choice(DOG_DASAO, DOG_LAOMU, DOG_JILV)
    # CLEAR
    ->->

+   [抄起玄关的棒球棍把门拉开一条缝，龇牙低吼：“私闯民宅？信不信我现在把你连车扛下楼！”]
    ~ Apply__Choice(DOG_DALANG, DOG_BAIQUAN, DOG_HASHIQI)
    # CLEAR
    ->->

=== Pool_01__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 新人破冰】</p>

入职培训第一天，主持人让大家上台用一句话做自我介绍，好让各部门部长挑选苗子。你走上讲台，握住麦克风开口就是：

+   [“本人抗压能力强、出拳速度快，谁敢在背后搞小动作，咱们练功房见。”]
    ~ Apply__Choice(DOG_DALANG, DOG_BAIQUAN, DOG_HASHIQI)
    # CLEAR
    ->->

+   [露出人畜无害的标准八颗牙微笑：“大家好呀～我没什么特长，最喜欢帮助同事解决（物理）烦恼了。”]
    ~ Apply__Choice(DOG_SAMOYE, DOG_BIANMU, DOG_JIXIE)
    # CLEAR
    ->->

+   [诚恳鞠躬九十度：“各位前辈好！我吃苦耐劳不挑食，给口热乎饭就能干到退休！”]
    ~ Apply__Choice(DOG_XIAONAI, DOG_LAOSHI, DOG_NIUMA)
    # CLEAR
    ->->

+   [扶了扶领口低声轻笑：“脏活累活或者……私底下的贴身伺候活，各位部长尽管吩咐。”]
    ~ Apply__Choice(DOG_DASAO, DOG_LAOMU, DOG_JILV)
    # CLEAR
    ->->
