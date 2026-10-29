//  好感度
VAR Rate_LeiHu = 0 


//  倾向
VAR Choose_YeHen = 0
VAR Choose_CenYe = 0
VAR Choose_LeiHu = 0

// 当前周目布尔状态：开场选择“雷琥的事”直接导向雷琥线结局（RAW 原稿），不是正式结局记录
VAR Dormitory_LeiHu_Direct = false

//  结局计数（只统计正片实际达成的不同结局）
VAR FinaleCount = 0

// 正片结局达成记录：不因 Knot 被访问或开发者预览而自动设置
VAR Ending_F1_Achieved = false
VAR Ending_F2_Achieved = false
VAR Ending_F3_Achieved = false
VAR Ending_F4_Achieved = false
VAR Ending_F5_Achieved = false
VAR Ending_F6_Achieved = false
VAR Ending_F7_Achieved = false
VAR Ending_F8_Achieved = false
VAR Ending_F9_Achieved = false
VAR Ending_F10_Achieved = false
VAR Ending_F11_Achieved = false

// 从结局回顾或开发者菜单预览时，不记录新的正片结局
VAR IsPreviewMode = false

=== CleanData
~   Rate_LeiHu = 0
//————————————————
~   Choose_YeHen = 0
~   Choose_CenYe = 0
~   Choose_LeiHu = 0
~   Dormitory_LeiHu_Direct = false
~   IsPreviewMode = false
->->

=== ShowData
雷琥好感度：{Rate_LeiHu}
三三三三三三三三
夜痕：{Choose_YeHen}
岑烨：{Choose_CenYe}
雷琥：{Choose_LeiHu}
->->

=== CountFinale
~ FinaleCount = 0

{Ending_F1_Achieved:
    ~   FinaleCount++
}
{Ending_F2_Achieved:
    ~   FinaleCount++
}
{Ending_F3_Achieved:
    ~   FinaleCount++
}
{Ending_F4_Achieved:
    ~   FinaleCount++
}
{Ending_F5_Achieved:
    ~   FinaleCount++
}
{Ending_F6_Achieved:
    ~   FinaleCount++
}
{Ending_F7_Achieved:
    ~   FinaleCount++
}
{Ending_F8_Achieved:
    ~   FinaleCount++
}
{Ending_F9_Achieved:
    ~   FinaleCount++
}
{Ending_F10_Achieved:
    ~   FinaleCount++
}
{Ending_F11_Achieved:
    ~   FinaleCount++
}
您已经尝试攻略雷琥 {START} 次，达成了 {FinaleCount} 个结局，共计 11 个结局。
{FinaleCount > START:
    #   IMAGE: https:\/\/cntracker.net/file/AgACAgUAAyEGAASG8mT0AAMeZ2t6Va7lOcCvYERXKq1LWKOvXUsAAvG_MRu62FlX4mAjhwTdXD8BAAMCAANtAAM2BA.jpg
    这下你满意了吧！！！
}
{FinaleCount == 0:别再观望了，快来玩玩看吧～}
{FinaleCount == 11:
    #   IMAGE:  https:\/\/cntracker.net/file/AgACAgUAAyEGAASG8mT0AAMgZ2t7Gbkt9NHx03ZLNS34ptk7tBkAAvW_MRu62FlXnJB-6wN9pvUBAAMCAANtAAM2BA.gif
    哇哦！您已经看完了所有的内容了，再次感谢您的游玩～！
}
{FinaleCount > 11:
    #   IMAGE: https:\/\/cntracker.net/file/AgACAgUAAyEGAASG8mT0AAMfZ2t6zllfsecOxwk7NtMXk3_P93kAAvO_MRu62FlXDvXZiQHe_R4BAAMCAANtAAM2BA.gif
    ……您是怎么做到的……？我这瓜有问题啊？请您反馈给黑川物流市场部，谢谢您。
}
-   ->->


=== FinaleList
+   {Ending_F1_Achieved}1.普通结局《臭味》
        ~ IsPreviewMode = true
        ->Finale.F1
+   {Ending_F2_Achieved}2.最佳结局《“为什么告诉我这些”》
        ~ IsPreviewMode = true
        ->Finale.F2
+   {Ending_F3_Achieved}3.好结局《“我知道了”》
        ~ IsPreviewMode = true
        ->Finale.F3
+   {Ending_F4_Achieved}4.普通结局《唉……体育生》
        ~ IsPreviewMode = true
        ->Finale.F4
+   {Ending_F5_Achieved}5.普通结局《服从》
        ~ IsPreviewMode = true
        ->Finale.F5
+   {Ending_F6_Achieved}6.普通结局《“求主人……”》
        ~ IsPreviewMode = true
        ->Finale.F6
+   {Ending_F7_Achieved}7.坏结局《失踪》
        ~ IsPreviewMode = true
        ->Finale.F7
+   {Ending_F8_Achieved}8.一般结局《担心身体》
        ~ IsPreviewMode = true
        ->Finale.F8
+   {Ending_F9_Achieved}9.好结局《好好吃饭》
        ~ IsPreviewMode = true
        ->Finale.F9
+   {Ending_F10_Achieved}10.真正结局《袒露心声》
        ~ IsPreviewMode = true
        ->Finale.F10
+   {Ending_F11_Achieved}11.最坏结局《圣诞快乐》
        ~ IsPreviewMode = true
        ->Finale.F11
+   (Dev_Unlock)————————————————
        {Dev_Unlock < 5:
            {你戳我干什么神魔！！！我就是个分隔符！！！|你再戳我就要闹了！|啊啊啊！！！别烦我！！！|正在启动自毁装置……3……2…}
        -   else:
            ->  Unlock_All  ->
            {stopping:
                -   好吧，被你发现了，但是我们仍然建议您自行体验内容，而不是直接看结局。
                    如果要清除，点击上方的 RESTART 就可以全部清除了。
                -   我发誓这里没有什么别的内容了。
            }
        }
            ->  FinaleList
+   {Unlock_All}[查看所有结局]
        ->  All_Finale  ->
        ->->
+   [返回上一级]
->->



=== Unlock_All
->->

=== All_Finale
+   1.普通结局《臭味》
        ~ IsPreviewMode = true
        ->Finale.F1
+   2.最佳结局《“为什么告诉我这些”》
        ~ IsPreviewMode = true
        ->Finale.F2
+   3.好结局《“我知道了”》
        ~ IsPreviewMode = true
        ->Finale.F3
+   4.普通结局《唉……体育生》
        ~ IsPreviewMode = true
        ->Finale.F4
+   5.普通结局《服从》
        ~ IsPreviewMode = true
        ->Finale.F5
+   6.普通结局《“求主人……”》
        ~ IsPreviewMode = true
        ->Finale.F6
+   7.坏结局《失踪》
        ~ IsPreviewMode = true
        ->Finale.F7
+   8.一般结局《担心身体》
        ~ IsPreviewMode = true
        ->Finale.F8
+   9.好结局《好好吃饭》
        ~ IsPreviewMode = true
        ->Finale.F9
+   10.真正结局《袒露心声》
        ~ IsPreviewMode = true
        ->Finale.F10
+   11.最坏结局《圣诞快乐》
        ~ IsPreviewMode = true
        ->Finale.F11
+   [返回上一级]
->->