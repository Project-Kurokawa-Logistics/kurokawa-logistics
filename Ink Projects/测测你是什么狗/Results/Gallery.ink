// ============================================================================
// 犬种档案图鉴与关于页
// ============================================================================

=== Page__Gallery
<h2>📖 黑川物流 · 犬种档案图鉴</h2>

{ UNLOCKED_ALL_PREVIEW:
    <p style="color: \#966495;">🔓 后台预览模式已开启（全部 12 种卡片均可直接检视）｜实际测出：{Get__Unlocked_Count()} / 12</p>
- else:
    <p style="opacity: 0.75;">当前已点亮：{Get__Unlocked_Count()} / 12（重测解锁更多犬种，或在标题页狂戳分割线开启后台预览）</p>
}

<hr>

+   { UNLOCKED_DASAO or UNLOCKED_ALL_PREVIEW } [01 · 天生大骚狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__01_DaSaoGou

+   { UNLOCKED_XIAONAI or UNLOCKED_ALL_PREVIEW } [02 · 纯情小奶狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__02_XiaoNaiGou

+   { UNLOCKED_DALANG or UNLOCKED_ALL_PREVIEW } [03 · 硬汉大狼狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__03_DaLangGou

+   { UNLOCKED_LAOMU or UNLOCKED_ALL_PREVIEW } [04 · 熟男老母狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__04_LaoMuGou

+   { UNLOCKED_SAMOYE or UNLOCKED_ALL_PREVIEW } [05 · 邪恶萨摩耶]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__05_SaMoYe

+   { UNLOCKED_NIUMA or UNLOCKED_ALL_PREVIEW } [06 · 社畜牛马狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__06_NiuMaGou

+   { UNLOCKED_BAIQUAN or UNLOCKED_ALL_PREVIEW } [07 · 傲娇小败犬]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__07_BaiQuan

+   { UNLOCKED_HASHIQI or UNLOCKED_ALL_PREVIEW } [08 · 发疯哈士奇]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__08_HaShiQi

+   { UNLOCKED_BIANMU or UNLOCKED_ALL_PREVIEW } [09 · 高智商边牧]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__09_BianMu

+   { UNLOCKED_JILV or UNLOCKED_ALL_PREVIEW } [10 · 狂热纪律狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__10_JiLvGou

+   { UNLOCKED_JIXIE or UNLOCKED_ALL_PREVIEW } [11 · 赛博机械狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__11_JiXieGou

+   { UNLOCKED_LAOSHI or UNLOCKED_ALL_PREVIEW } [12 · 看门老实狗]
    ~ IS_PREVIEW_MODE = true
    # CLEAR
    -> Card__12_LaoShiGou

+   [🏠 返回标题页]
    # CLEAR
    -> Page__Title

// ============================================================================
// 关于与制作人员
// ============================================================================

=== Page__Credits
<h2>ℹ️ 关于《测测你是什么狗》</h2>

<hr>

企划归属：黑川物流（Kurokawa Logistics）沙雕支线企划

联合出品：黑川物流人事部 × 市场部（经费从后勤部狗粮预算里扣）

题库规模：9 大维度题组 × 3 题 = 27 题对称题库｜共收录 12 种犬科鉴定结果

AIGC by Google Gemini 4 Carbon

<hr>

⚠️ 免责声明：本测试纯属沙雕娱乐，若测出结果过于精准导致您在群里社死或被行政部顺着网线打包，本司概不负责。

我们随时欢迎您来黑川物流参观（及领项圈）。

<hr>

+   [🏠 返回标题页]
    # CLEAR
    -> Page__Title

+   [🔄 完全重置所有记录（RESTART）]
    # RESTART
    -> END
