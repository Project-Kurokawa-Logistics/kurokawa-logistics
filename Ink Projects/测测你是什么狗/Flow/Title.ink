// ============================================================================
// 标题页与主菜单
// ============================================================================

=== Page__Title

# IMAGE: images/cover_title.png

<h1 style="color: \#DF9B1B; margin-bottom: 4px;">🐾 测测你是什么狗</h1>

<p style="opacity: 0.78;">黑川物流人事部 × 市场部联合出品 · 员工犬科属性摸底测试</p>

<hr>

尊敬的受试者（准员工／路过人类／疑似犬科）：

为进一步优化我司耗材分类、展示柜排班与狗粮采购预算，人事部特联合市场部推出本套**完全不讲科学依据**的直觉摸底测试。

请凭第一反应作答——毕竟在黑川物流，嘴上装得再像人，尾巴也是藏不住的。

{ COUNT_PLAYED > 0:
    <p style="opacity: 0.72;">📊 当前已累计完成 {COUNT_PLAYED} 次犬检｜已点亮犬种档案：{Get__Unlocked_Count()} / 12</p>
}

<hr>

-> Menu__Main

=== Menu__Main

+   [⚡ 开始犬检（随机抽题 · 9 题速测）]
    ~ Reset__Current_Run("QUICK")
    # CLEAR
    -> Flow__Router.Start

+   [📋 深度体检（完整题库 · 27 题全开）]
    ~ Reset__Current_Run("FULL")
    # CLEAR
    -> Flow__Router.Start

+   [📖 犬种档案图鉴（{Get__Unlocked_Count()} / 12）]
    # CLEAR
    -> Page__Gallery

+   ————————
    ~ COUNT_MENU_SEPARATOR = COUNT_MENU_SEPARATOR + 1
    {
    - COUNT_MENU_SEPARATOR >= 5 and UNLOCKED_ALL_PREVIEW == false:
        ~ UNLOCKED_ALL_PREVIEW = true
        # CLEAR
        <p style="color: \#966495;"><b>【人事部后台权限已激活】</b></p>
        “行了行了别扒拉分隔线了，爪子都快把屏幕挠花了。”
        No.8 叹了口气，把整本《黑川物流犬科样本图鉴》拍在了你面前——现在你可以在图鉴中直接预览全部 12 种结果卡片了。
        -> Page__Gallery
    - COUNT_MENU_SEPARATOR >= 5 and UNLOCKED_ALL_PREVIEW == true:
        全图鉴预览权限已经开着啦，请直接点击上方「犬种档案图鉴」检视卡片。
        -> Menu__Main
    - else:
        {汪？（这是一条正经的分割线，不是磨牙棒。）|别啃了！黑胶做的分割线也不经咬啊！|再刨坑行政部要来贴罚单了！|你这手欠程度高低沾点哈士奇……}
        -> Menu__Main
    }

+   [ℹ️ 关于本测试]
    # CLEAR
    -> Page__Credits
