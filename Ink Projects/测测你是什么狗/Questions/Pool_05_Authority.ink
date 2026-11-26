// ============================================================================
// 第五题组：面对高层与权威的本能反应（Pool 05）
// 向量组：
//   E2: (DOG_BAIQUAN, DOG_XIAONAI, DOG_DASAO)
//   F2: (DOG_BIANMU,  DOG_NIUMA,   DOG_LAOMU)
//   G2: (DOG_JILV,    DOG_JIXIE,   DOG_DALANG)
//   H2: (DOG_HASHIQI, DOG_LAOSHI,  DOG_SAMOYE)
// ============================================================================

=== Pool_05__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 摸头突袭】</p>

电梯门打开，顶头上司正好站在里面。看你最近干活卖力，上司顺手抬起手掌，重重揉了两把你的脑袋和耳朵根。你当场的反应是：

+   [“啪”地立正站直，眼神炽热地汇报：“感谢长官关怀！属下定当肝脑涂地！”]
    ~ Apply__Choice(DOG_JILV, DOG_JIXIE, DOG_DALANG)
    # CLEAR
    ->->

+   [嘴上炸毛抗议“别拿我当小狗摸啊没大没小的！”，脑袋却诚实地往掌心里又蹭了两下]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_XIAONAI, DOG_DASAO)
    # CLEAR
    ->->

+   [顺势自然地低下头配合高度，微笑着递上刚整理好的部门简报：“您今天心情不错？”]
    ~ Apply__Choice(DOG_BIANMU, DOG_NIUMA, DOG_LAOMU)
    # CLEAR
    ->->

+   [被揉得发型乱成蒲公英，呆呆地从兜里掏出半块旺旺雪饼：“领导，礼尚往来，你吃饼吗？”]
    ~ Apply__Choice(DOG_HASHIQI, DOG_LAOSHI, DOG_SAMOYE)
    # CLEAR
    ->->

=== Pool_05__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 大佬巡视】</p>

传说中统领全司的研发部部长 No.AZ 散着步路过你的工作区，手里还拎着那只标志性的面罩箱。周围同事瞬间鸦雀无声，而你正在：

+   [丝滑切回工作界面，用余光精准预判大佬的行走路线，提前推开玻璃门省得对方动手]
    ~ Apply__Choice(DOG_BIANMU, DOG_NIUMA, DOG_LAOMU)
    # CLEAR
    ->->

+   [耳朵一竖呼吸急促，明明紧张得爪子抠紧了裤缝，眼神却直勾勾盯着那个面罩箱移不开眼]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_XIAONAI, DOG_DASAO)
    # CLEAR
    ->->

+   [完全没认出这是大老板，热心地指了指拐角：“大兄弟送货啊？大件包裹得走东边货梯！”]
    ~ Apply__Choice(DOG_HASHIQI, DOG_LAOSHI, DOG_SAMOYE)
    # CLEAR
    ->->

+   [第一时间进入最高戒备护卫姿态，顺便用眼神刀死旁边站姿不够端正的新人]
    ~ Apply__Choice(DOG_JILV, DOG_JIXIE, DOG_DALANG)
    # CLEAR
    ->->

=== Pool_05__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 夸奖测试】</p>

如果你把一件棘手的差事办得漂漂亮亮，上级问你想要什么奖励，以下哪种兑现方式最能戳中你的爽点？

+   [关起门来按在沙发上，掐着下巴低声夸一句“真是个听话的好狗狗”]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_XIAONAI, DOG_DASAO)
    # CLEAR
    ->->

+   [全司通报表扬加授“月度模范标兵”红绶带，允许佩戴最高等级执勤装备]
    ~ Apply__Choice(DOG_JILV, DOG_JIXIE, DOG_DALANG)
    # CLEAR
    ->->

+   [实在点，直接打进这个月绩效奖金里，再批两天不夺命连环 call 的带薪假]
    ~ Apply__Choice(DOG_BIANMU, DOG_NIUMA, DOG_LAOMU)
    # CLEAR
    ->->

+   [批一张食堂无限畅吃券——或者特许我在办公楼顶天台狂奔撒欢半小时！]
    ~ Apply__Choice(DOG_HASHIQI, DOG_LAOSHI, DOG_SAMOYE)
    # CLEAR
    ->->
