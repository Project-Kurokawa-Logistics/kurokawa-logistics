// ============================================================================
// 第六题组：基地事故与精神状态抽检（Pool 06）
// 向量组：
//   E3: (DOG_XIAONAI, DOG_DASAO,  DOG_BAIQUAN)
//   F3: (DOG_NIUMA,   DOG_LAOMU,  DOG_BIANMU)
//   G3: (DOG_JIXIE,   DOG_DALANG, DOG_JILV)
//   H3: (DOG_LAOSHI,  DOG_SAMOYE, DOG_HASHIQI)
// ============================================================================

=== Pool_06__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 收容警报】</p>

地下三层突然拉响红色警报，广播里循环播放：“注意，二号培养槽发生黑胶泄露，请非战斗人员有序撤离！”此时正在走廊里的你会：

+   [熟练按保存键锁屏电脑、顺手拎起灭火器掩护实习生往安全出口撤离]
    ~ Submit__Answer(DOG_NIUMA, DOG_LAOMU, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [咔哒一声合上防护面甲，开启全功率液压推进迎着警报声冲去封堵闸门]
    ~ Submit__Answer(DOG_JIXIE, DOG_DALANG, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [耳朵吓得贴成飞机耳，眼泪汪汪地一把抱住身边最高最壮的前辈大腿：“呜哇带带我！”]
    ~ Submit__Answer(DOG_XIAONAI, DOG_DASAO, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [拎着拖把站在安全门外探头看热闹：“哎哟这地弄得乌漆嘛黑的，保洁阿姨看见得骂街咯。”]
    ~ Submit__Answer(DOG_LAOSHI, DOG_SAMOYE, DOG_HASHIQI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_06__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 停电惊魂】</p>

暴雨夜基地突发三分钟断电，应急灯还没亮起，漆黑的备品室里只有你和另一名呼吸微热的神秘同事。黑暗中有什么柔软的触手状物体轻轻擦过了你的脚踝：

+   [腿一软差点跌进对方怀里，小声试探：“前、前辈是你吗？要是缠上来的话轻一点哦……”]
    ~ Submit__Answer(DOG_XIAONAI, DOG_DASAO, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [瞬间开启红外夜视扫描热源轮廓，反手一把钳住不明物体测算抗拉强度]
    ~ Submit__Answer(DOG_JIXIE, DOG_DALANG, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [淡定掏出钥匙扣手电筒照向电闸箱：“别慌，三号空气开关跳闸了，我推上去就行。”]
    ~ Submit__Answer(DOG_NIUMA, DOG_LAOMU, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [善良地弯腰拍了拍那根触手：“谁家的数据线掉地上了？小心别让人踩断喽。”]
    ~ Submit__Answer(DOG_LAOSHI, DOG_SAMOYE, DOG_HASHIQI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_06__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 精神体检】</p>

体检科医生拿着一张抽象墨渍图（罗夏测验），严肃地问你：“盯着这张黑漆漆的图案看五秒，你看到了什么？”你的回答是：

+   [“一滩打翻在快递单上的墨水……医生咱能快点签字吗？我下午还有三车件要盘点呢。”]
    ~ Submit__Answer(DOG_NIUMA, DOG_LAOMU, DOG_BIANMU)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“像素分辨率过低，边缘呈非牛顿流体扩散特征，建议更换激光打印机硒鼓。”]
    ~ Submit__Answer(DOG_JIXIE, DOG_DALANG, DOG_JILV)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“像一双很大很温暖的手正在给我戴项圈……医生你为什么用那种眼神看我？”]
    ~ Submit__Answer(DOG_XIAONAI, DOG_DASAO, DOG_BAIQUAN)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“像烤糊了的红薯皮！医生你饿不饿，楼下门口烤红薯大爷今天出摊了！”]
    ~ Submit__Answer(DOG_LAOSHI, DOG_SAMOYE, DOG_HASHIQI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back
