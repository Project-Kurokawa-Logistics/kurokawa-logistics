// ============================================================================
// 十二犬种鉴定结果卡片（复刻参考图版式：圆角头衔色带 + # IMAGE + 名言锐评 + 档案评语）
// ============================================================================

=== Route__Show_Card(dog_id)
    {
    - dog_id == DOG_DASAO:
        -> Card__01_DaSaoGou
    - dog_id == DOG_XIAONAI:
        -> Card__02_XiaoNaiGou
    - dog_id == DOG_DALANG:
        -> Card__03_DaLangGou
    - dog_id == DOG_LAOMU:
        -> Card__04_LaoMuGou
    - dog_id == DOG_SAMOYE:
        -> Card__05_SaMoYe
    - dog_id == DOG_NIUMA:
        -> Card__06_NiuMaGou
    - dog_id == DOG_BAIQUAN:
        -> Card__07_BaiQuan
    - dog_id == DOG_HASHIQI:
        -> Card__08_HaShiQi
    - dog_id == DOG_BIANMU:
        -> Card__09_BianMu
    - dog_id == DOG_JILV:
        -> Card__10_JiLvGou
    - dog_id == DOG_JIXIE:
        -> Card__11_JiXieGou
    - else:
        -> Card__12_LaoShiGou
    }

// ----------------------------------------------------------------------------
// 01. 天生大骚狗（保留参考图评语与锐评原文）
// ----------------------------------------------------------------------------
=== Card__01_DaSaoGou
<span style="display: block; background: \#DF9B1B; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">天生大骚狗</span>

# IMAGE: images/dog_01_dasaogou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.55em; font-style: italic; margin: 4px 0;">骚逼啊</span><span style="display: block; text-align: right; font-size: 1.1em;">—— AZ <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

没有编号的骚狗是消耗品，研究完了会冻起来或者废物回收；有编号的玩坏的会被挂起来，每天擦擦身体放下来遛狗。如果脑子被洗坏变成贱狗了，那就只能退休了。

-> Menu__After_Card(DOG_DASAO)

// ----------------------------------------------------------------------------
// 02. 纯情小奶狗
// ----------------------------------------------------------------------------
=== Card__02_XiaoNaiGou
<span style="display: block; background: \#E888A7; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">纯情小奶狗</span>

# IMAGE: images/dog_02_xiaonaigou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">连诱捕素都省了，给杯热牛奶自己就跟着走了。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.1 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

人事部最省经费的甜心修勾，夸两句“好乖”就会红着耳朵在保密协议上按爪印。刚进分基地时还以为黑胶绷带是公司发的防寒护膝，被前辈揉两把脑袋就能傻乐一整天；哪怕被挂进恒温展示柜里，也是会隔着玻璃冲路过的每一个人疯狂摇尾巴的治愈系吉祥物。

-> Menu__After_Card(DOG_XIAONAI)

// ----------------------------------------------------------------------------
// 03. 硬汉大狼狗
// ----------------------------------------------------------------------------
=== Card__03_DaLangGou
<span style="display: block; background: \#3B4D6B; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">硬汉大狼狗</span>

# IMAGE: images/dog_03_dalanggou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">体格合格，咬合力达标。装上固化甲，明天来护卫队报到。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.4 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

生人勿近的重型猛犬，眼神凶得能把上门催件的客户直接吓退货，单手就能扛起两个标准规格的打包肉货。表面上是桀骜不驯的硬汉暴徒，实际上只要认准了顶头上司、被按住后颈扣上战术项圈，就会瞬间切换为绝对护主模式——指哪咬哪，绝不多问一句废话。

-> Menu__After_Card(DOG_DALANG)

// ----------------------------------------------------------------------------
// 04. 熟男老母狗
// ----------------------------------------------------------------------------
=== Card__04_LaoMuGou
<span style="display: block; background: \#7A3E48; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">熟男老母狗</span>

# IMAGE: images/dog_04_laomugou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">到底是上过几年班的老油条，不用教就知道怎么把人伺候舒服。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.6 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

白天西装革履端着枸杞保温杯审报表、带新人，胡茬修得一丝不苟，俨然一副稳重可靠的职场老大哥派头；一到下班刷卡进地下护理室，脱西装解皮带的动作比谁都娴熟。不仅深谙进退分寸、极擅察言观色，完事后甚至还会体贴地递上热毛巾提醒主人注意护腰。

-> Menu__After_Card(DOG_LAOMU)

// ----------------------------------------------------------------------------
// 05. 邪恶萨摩耶
// ----------------------------------------------------------------------------
=== Card__05_SaMoYe
<span style="display: block; background: \#5B7CFA; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">邪恶萨摩耶</span>

# IMAGE: images/dog_05_samoye.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">笑得这么干净，往同事杯子里下料的手倒是一点没抖嘛。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.8 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

全公司最具欺骗性的微笑天使，一团雪白蓬松、人畜无害的棉花糖皮囊底下塞满了八百个黑心眼子。上一秒还在茶水间甜甜地管前辈叫哥哥，下一秒就已经把前辈摸鱼的证据打包抄送给了行政部，顺手在通风口拧开一瓶诱捕素，站在安全区笑眯眯地鼓掌欣赏全层团灭。

-> Menu__After_Card(DOG_SAMOYE)

// ----------------------------------------------------------------------------
// 06. 社畜牛马狗
// ----------------------------------------------------------------------------
=== Card__06_NiuMaGou
<span style="display: block; background: \#5E6B73; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">社畜牛马狗</span>

# IMAGE: images/dog_06_niumagou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">别浪费限制锚了，他的房贷和全勤奖比黑胶稳固多了。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.7 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

被绩效考核与排班表彻底腌入味的天选帕鲁犬。被绑架科套麻袋带回基地时，第一反应不是呼救，而是确认“被关机期间算不算旷工”“五险一金按哪一档交”。哪怕已经被黑胶缠成茧子挂在墙上，只要听到办公软件提示音，尾巴还是会条件反射地抽动两下准备回“收到”。

-> Menu__After_Card(DOG_NIUMA)

// ----------------------------------------------------------------------------
// 07. 傲娇小败犬
// ----------------------------------------------------------------------------
=== Card__07_BaiQuan
<span style="display: block; background: \#E05A47; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">傲娇小败犬</span>

# IMAGE: images/dog_07_baiquan.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">嘴挺硬，黑胶绷带再缠两圈就老实了。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.3 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

死鸭子嘴硬协会终身荣誉会长。从踏进公司大门就开始炸毛哈气，被按在地上装齐全套模块还在大喊“我只是战略性被俘！才不是觉得很爽！”。浑身上下就剩一张嘴最硬，偏偏尾巴诚实得要命，随便摸摸下巴夸一句“表现不错”就能把地板拍出裂纹。

-> Menu__After_Card(DOG_BAIQUAN)

// ----------------------------------------------------------------------------
// 08. 发疯哈士奇
// ----------------------------------------------------------------------------
=== Card__08_HaShiQi
<span style="display: block; background: \#8A4FFF; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">发疯哈士奇</span>

# IMAGE: images/dog_08_hashiqi.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">离我的培养皿远点！！谁准他把限制锚当磨牙棒嚼碎吞下去的？！</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.5 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

精神状态遥遥领先整个外星黑胶文明的混沌颠狗。别人直视司令会遭受严重精神污染，他跟司令对视三秒差点把司令的思考单元干烧了。行政部试图给他洗脑，洗完发现脑回路里全是乱码和抽象表情包；关进展览柜不到半小时，已经把隔壁柜子的承重墙啃穿跑去食堂偷饭了。

-> Menu__After_Card(DOG_HASHIQI)

// ----------------------------------------------------------------------------
// 09. 高智商边牧
// ----------------------------------------------------------------------------
=== Card__09_BianMu
<span style="display: block; background: \#2A9D8F; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">高智商边牧</span>

# IMAGE: images/dog_09_bianmu.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">建议严查他的芯片，我怀疑不是我们在训他，是他在拿行政部做实验。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— No.2 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

狗中博士生，装傻充愣的一把好手。表面上让坐就坐、让握手就握手，背地里入职三天摸清了整栋楼的监控死角，第五天学会了用肉垫刷开电子密码锁，第七天甚至偷偷帮研发部改掉了报表里的两处算力溢出。只要罐头给够就愿意配合演出“乖狗狗”，谁也不知道他到底有没有被洗脑成功。

-> Menu__After_Card(DOG_BIANMU)

// ----------------------------------------------------------------------------
// 10. 狂热纪律狗
// ----------------------------------------------------------------------------
=== Card__10_JiLvGou
<span style="display: block; background: \#B8292F; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">狂热纪律狗</span>

# IMAGE: images/dog_10_jilvgou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">孩子们这么热情是好事……就是别每次见我都把地板磕裂了，怪难修的。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— AZ <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

比洗脑程序本人还要虔诚的效忠卷王犬。自己每天早上六点准时排队接受深度再教育还嫌不够，平时最大的爱好就是叼着行政部风纪手册满走廊巡逻，看见哪只狗的项圈歪了五毫米都要扑上去强制纠正。因为高呼效忠口号过于狂热，经常把刚入职的新人吓得连夜写了三份思想汇报。

-> Menu__After_Card(DOG_JILV)

// ----------------------------------------------------------------------------
// 11. 赛博机械狗
// ----------------------------------------------------------------------------
=== Card__11_JiXieGou
<span style="display: block; background: \#3898EC; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">赛博机械狗</span>

# IMAGE: images/dog_11_jixiegou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">……为什么我司报失的机械测试犬会缠着黑胶胶带出现在你们耗材库里？</span><span style="display: block; text-align: right; font-size: 1.1em;">—— ID.ADMIN-2 <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

走错片场的全身义体化精密钛合金修勾。别的狗靠黑胶触手和信息素，你靠液压传动关节、激光狗眼和烧掉 168 亿 Token 炼出来的智能电子“汪汪”语音包。人事部拿扫码枪在你脑门上扫了半天没扫出黑川编号，反而弹出了龙珀科技的防伪警报——充电两小时，摇尾五分钟，遇水还会漏电麻翻路过的倒霉调教师。

-> Menu__After_Card(DOG_JIXIE)

// ----------------------------------------------------------------------------
// 12. 看门老实狗
// ----------------------------------------------------------------------------
=== Card__12_LaoShiGou
<span style="display: block; background: \#8C6D46; color: \#FFFFFF; text-align: center; font-size: 1.75em; font-weight: bold; padding: 10px 20px; border-radius: 14px; margin: 6px 0 14px 0; letter-spacing: 0.08em;">看门老实狗</span>

# IMAGE: images/dog_12_laoshigou.png

<span style="display: block; color: \#C29743; margin: 14px 8px 10px 8px;"><span style="display: block; font-size: 2em; line-height: 0.6; text-align: left;">“</span><span style="display: block; text-align: center; font-size: 1.45em; font-style: italic; margin: 4px 0;">让他安安心心在地面收发室待着吧，五险一金按最高档交，谁也别带他去地下层。</span><span style="display: block; text-align: right; font-size: 1.1em;">—— AZ <span style="font-size: 1.35em; vertical-align: -0.18em;">”</span></span></span>

全黑川物流含“人”量最高、精神最正常的纯良中华田园修勾。体内一滴黑胶没有，对地下几层的腥风血雨一无所知，闻到飘出来的诱捕素只会吸吸鼻子感慨“今天食堂大师傅炖肉真香”。每天兢兢业业守在地面仓库门口核对快递单、给路过的高管递热茶，靠着过于淳朴清澈的眼神喜提全司免死金牌——连安保部路过都得把触手缩回裤腿里乖乖刷卡。

-> Menu__After_Card(DOG_LAOSHI)

// ============================================================================
// 卡片页脚操作栏（位于截图区域分割线下方）
// ============================================================================

=== Menu__After_Card(dog_id)
<hr>

{ IS_PREVIEW_MODE == false:
    ~ temp runner_up = Get__Runner_Up_Id(dog_id)
    { runner_up > 0 and Get__Dog_Score(runner_up) > 0:
        <p style="opacity: 0.72; font-size: 0.92em;">📋 人事部附注：除主属性【{Get__Dog_Name(dog_id)}】外，您的样本中还检出少许【{Get__Dog_Name(runner_up)}】隐性基因。当前图鉴收录：{Get__Unlocked_Count()} / 12</p>
    - else:
        <p style="opacity: 0.72; font-size: 0.92em;">📋 当前犬种档案收录进度：{Get__Unlocked_Count()} / 12</p>
    }
}

+   { IS_PREVIEW_MODE == false } [🔄 再测一次（随机 9 题速测）]
    ~ Reset__Current_Run("QUICK")
    # CLEAR
    -> Flow__Router.Start

+   { IS_PREVIEW_MODE == false } [📋 挑战完整题库（27 题深测）]
    ~ Reset__Current_Run("FULL")
    # CLEAR
    -> Flow__Router.Start

+   [📖 犬种档案图鉴（{Get__Unlocked_Count()} / 12）]
    # CLEAR
    -> Page__Gallery

+   [🏠 返回标题页]
    # CLEAR
    -> Page__Title
