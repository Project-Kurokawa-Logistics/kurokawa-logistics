// ============================================================================
// 第三题组：工位牛马日常与突发加班（Pool 03）
// 向量组：
//   A3: (DOG_JILV,    DOG_DASAO,   DOG_LAOMU)
//   B3: (DOG_NIUMA,   DOG_XIAONAI, DOG_LAOSHI)
//   C3: (DOG_HASHIQI, DOG_DALANG,  DOG_BAIQUAN)
//   D3: (DOG_JIXIE,   DOG_SAMOYE,  DOG_BIANMU)
// ============================================================================

=== Pool_03__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 周五下班前】</p>

周五下午五点五十八分，你刚背上包准备走人，工作群突然弹出一条全员艾特：“紧急大单，今晚全员留司支援打包作业！”此时你的精神状态是：

+   [面无表情坐回工位打开 OA 打卡：“请问今晚按 1.5 倍算加班费还是能抵下周调休？”]
    ~ Submit__Answer(DOG_NIUMA, DOG_XIAONAI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [当场两眼一翻仰天长嚎，叼起桌上的A4草稿纸甩得满天都是，试图用发疯逼退主管]
    ~ Submit__Answer(DOG_HASHIQI, DOG_DALANG, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [第一个秒回“坚决服从公司安排！！”，并主动站在电梯口拦截每一个试图溜走的摸鱼同事]
    ~ Submit__Answer(DOG_JILV, DOG_DASAO, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [提前五分钟设好了自动回复脚本：“正在外勤派件信号不佳”，人已经在地铁站刷卡进站了]
    ~ Submit__Answer(DOG_JIXIE, DOG_SAMOYE, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_03__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 带薪休假】</p>

财务部通知你今年还剩五天年假没休，可以选一种“公司内部特色疗养套餐”抵扣。看着宣传单上的四个选项，你毫不犹豫勾选了：

+   [【全封闭深度调理舱】：听说能让人彻底放空大脑、挂在恒温架上享受全套擦身侍奉]
    ~ Submit__Answer(DOG_JILV, DOG_DASAO, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [【折算三倍日薪补贴】：休什么假？只要钱给到位，我能连轴转把服务器踩冒烟]
    ~ Submit__Answer(DOG_NIUMA, DOG_XIAONAI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [【硬件升级与算力维护】：给我换一套钛合金护腰外骨骼，顺便清理一下脑机缓存垃圾]
    ~ Submit__Answer(DOG_JIXIE, DOG_SAMOYE, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [【荒野拆迁发泄营】：给我准备十吨废旧集装箱和一屋子假人，我要把它们全撕成碎片！]
    ~ Submit__Answer(DOG_HASHIQI, DOG_DALANG, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_03__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 系统卡死】</p>

月底赶报表最要命的时候，面前的办公电脑突然蓝屏死机，三个小时没保存的表格灰飞烟灭。这一刻你会：

+   [冷静拆开机箱短接主板排线抢救硬盘扇区，顺便查出是隔壁工位下电影占满了带宽]
    ~ Submit__Answer(DOG_JIXIE, DOG_SAMOYE, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [灵魂出窍三秒钟，认命地叹口气泡杯浓茶，从头再敲一遍——反正也不是第一次了]
    ~ Submit__Answer(DOG_NIUMA, DOG_XIAONAI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [把键盘拍出火星子，冲着屏幕狂吠三分钟，差点一口咬在显示器边框上]
    ~ Submit__Answer(DOG_HASHIQI, DOG_DALANG, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [立刻起身去行政部自领“工作失误责罚”，诚恳检讨自己未能与公司设备达成心灵共鸣]
    ~ Submit__Answer(DOG_JILV, DOG_DASAO, DOG_LAOMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back
