// ============================================================================
// 第二题组：气味、食堂与诱捕素直觉（Pool 02）
// 向量组：
//   A2: (DOG_LAOMU,   DOG_JILV,    DOG_DASAO)
//   B2: (DOG_LAOSHI,  DOG_NIUMA,   DOG_XIAONAI)
//   C2: (DOG_BAIQUAN, DOG_HASHIQI, DOG_DALANG)
//   D2: (DOG_BIANMU,  DOG_JIXIE,   DOG_SAMOYE)
// ============================================================================

=== Pool_02__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 可疑香气】</p>

路过研发部走廊通风口时，空气里突然飘来一股你这辈子最迷恋、最上头的奇妙香味（多态神经诱捕素泄露中）。你吸了吸鼻子，脑海里浮现的念头是：

+   [“卧槽食堂今天居然炖红烧排骨了？！快走两步去晚了只剩菜汤了！”]
    ~ Apply__Choice(DOG_LAOSHI, DOG_NIUMA, DOG_XIAONAI)
    # CLEAR
    ->->

+   [瞬间屏息切为内循环换气，顺手掏出手机记录气溶胶浓度并后撤到上风口]
    ~ Apply__Choice(DOG_BIANMU, DOG_JIXIE, DOG_SAMOYE)
    # CLEAR
    ->->

+   [熟门熟路地叹了口气：“又是三号配方的诱捕素……算了，哪位长官在里面？我自己进来。”]
    ~ Apply__Choice(DOG_LAOMU, DOG_JILV, DOG_DASAO)
    # CLEAR
    ->->

+   [耳朵通红地死死捂住鼻子大骂“什么下三滥暗器！”，结果两条腿根本迈不动道]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_HASHIQI, DOG_DALANG)
    # CLEAR
    ->->

=== Pool_02__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 特调饮品】</p>

后勤部茶水间推出了一款没有贴标签的“高蛋白特调营养奶昔”，据喝过的前辈说不仅提神醒脑，还能大幅增强体质。端起杯子的你会：

+   [先滴两滴在试纸上测酸碱度，再假装喝完实则倒进了旁边绿萝花盆里]
    ~ Apply__Choice(DOG_BIANMU, DOG_JIXIE, DOG_SAMOYE)
    # CLEAR
    ->->

+   [面不改色一饮而尽，甚至擦擦嘴角评价道：“今天后勤部的火候稍微淡了一点，再来一杯。”]
    ~ Apply__Choice(DOG_LAOMU, DOG_JILV, DOG_DASAO)
    # CLEAR
    ->->

+   [嫌弃地把杯子推开八丈远：“谁要喝这种来路不明的怪东西啊！……看什么看，我就舔一口尝尝咸淡！”]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_HASHIQI, DOG_DALANG)
    # CLEAR
    ->->

+   [美滋滋地吨吨吨灌完：“不愧是大公司福利，免费下午茶居然这么实在，还能续杯吗？”]
    ~ Apply__Choice(DOG_LAOSHI, DOG_NIUMA, DOG_XIAONAI)
    # CLEAR
    ->->

=== Pool_02__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 深夜觅食】</p>

凌晨一点值夜班肚子饿得咕咕叫，打开部门公共冰箱，发现里面整整齐齐码着十几袋印有条形码的黑色果冻状补给包。你的选择是：

+   [炸毛关上冰箱门：“搞什么鬼，连包正常的火腿肠都没有！信不信我把冰箱门卸了！”]
    ~ Apply__Choice(DOG_BAIQUAN, DOG_HASHIQI, DOG_DALANG)
    # CLEAR
    ->->

+   [老老实实掏出自己带的保温饭盒去微波炉热剩饭——公家的东西咱不乱动]
    ~ Apply__Choice(DOG_LAOSHI, DOG_NIUMA, DOG_XIAONAI)
    # CLEAR
    ->->

+   [按编号挑了一袋年份最醇的常温化开，顺便在登记表上工整签下自己的领用记录]
    ~ Apply__Choice(DOG_LAOMU, DOG_JILV, DOG_DASAO)
    # CLEAR
    ->->

+   [用扫码软件破译包装袋上的批次码，顺手把两袋快过期的挪到最外层留给讨厌的同事]
    ~ Apply__Choice(DOG_BIANMU, DOG_JIXIE, DOG_SAMOYE)
    # CLEAR
    ->->
