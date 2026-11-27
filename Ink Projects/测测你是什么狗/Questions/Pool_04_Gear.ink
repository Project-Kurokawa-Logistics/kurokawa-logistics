// ============================================================================
// 第四题组：项圈、黑胶绷带与穿搭审美（Pool 04）
// 向量组：
//   E1: (DOG_DASAO,  DOG_BAIQUAN, DOG_XIAONAI)
//   F1: (DOG_LAOMU,  DOG_BIANMU,  DOG_NIUMA)
//   G1: (DOG_DALANG, DOG_JILV,    DOG_JIXIE)
//   H1: (DOG_SAMOYE, DOG_HASHIQI, DOG_LAOSHI)
// ============================================================================

=== Pool_04__Q1
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 工装定制】</p>

物资科通知新员工去领定制制服，货架上摆着四套风格迥异的装备。不用别人催，你的手已经诚实地伸向了：

+   [高弹全包覆亮面黑胶紧身衣，胸口和腰侧还贴心地留了挂牵引绳的金属 D 型环]
    ~ Submit__Answer(DOG_DASAO, DOG_BAIQUAN, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [剪裁考究的三件套深色西装，表面斯文禁欲，只有解开衬衫领口才能看见锁骨上的暗扣皮环]
    ~ Submit__Answer(DOG_LAOMU, DOG_BIANMU, DOG_NIUMA)
    # CLEAR
    -> Flow__Router.Dispatch

+   [外覆固化装甲板的重型防暴作战服，配战术护目镜与止咬嘴套，安全感和压迫感双双拉满]
    ~ Submit__Answer(DOG_DALANG, DOG_JILV, DOG_JIXIE)
    # CLEAR
    -> Flow__Router.Dispatch

+   [宽松舒适的纯棉大裤衩配荧光绿反光背心——谁敢往我蓬松的毛上糊黑胶我就跟谁急！]
    ~ Submit__Answer(DOG_SAMOYE, DOG_HASHIQI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_04__Q2
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 打包实训】</p>

运输部组织“黑胶绷带打包技能实操课”，两人一组互相练习把对方缠成标准规格的仓储包裹。轮到你上场时，你的表现是：

+   [熟练地躺平摆好最省空间的姿势，甚至主动指导搭档：“大腿根再缠紧半圈，这样吊起来不会滑。”]
    ~ Submit__Answer(DOG_DASAO, DOG_BAIQUAN, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [三下五除二以教科书级手法把搭档捆成严丝合缝的菱形方块，贴好条形码一肩扛去验收区]
    ~ Submit__Answer(DOG_DALANG, DOG_JILV, DOG_JIXIE)
    # CLEAR
    -> Flow__Router.Dispatch

+   [笑嘻嘻地假装手滑，把胶带连同旁边路过的讲师一起缠在了柱子上，场面一度十分艺术]
    ~ Submit__Answer(DOG_SAMOYE, DOG_HASHIQI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [先和搭档商量好松紧暗号，缠得既符合验收标准又留足了摸鱼透气的暗扣余量]
    ~ Submit__Answer(DOG_LAOMU, DOG_BIANMU, DOG_NIUMA)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back

=== Pool_04__Q3
<p style="opacity: 0.65;">【第 {CURRENT_STEP} / {TOTAL_STEPS} 题 · 专属犬牌】</p>

如果公司强制要求每位员工在脖子上挂一块激光刻印的金属铭牌，允许自定义一行小字，你会刻什么？

+   [工整刻上工号、血型与紧急维护接口参数，字迹严谨得像出厂说明书]
    ~ Submit__Answer(DOG_DALANG, DOG_JILV, DOG_JIXIE)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“日结包饭，请勿投喂巧克力，捡到请送回一楼收发室谢谢”]
    ~ Submit__Answer(DOG_SAMOYE, DOG_HASHIQI, DOG_LAOSHI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [正面刻着体面的职务头衔，翻过来背面刻着一行极小的：“拽一下链子就听话”]
    ~ Submit__Answer(DOG_LAOMU, DOG_BIANMU, DOG_NIUMA)
    # CLEAR
    -> Flow__Router.Dispatch

+   [“用力拽，别客气♡”（刻完还嫌不够显眼，特意选了亮橙色牵引绳配一套）]
    ~ Submit__Answer(DOG_DASAO, DOG_BAIQUAN, DOG_XIAONAI)
    # CLEAR
    -> Flow__Router.Dispatch

+   [⬅️ 返回上一题]
    -> Flow__Router.Back
