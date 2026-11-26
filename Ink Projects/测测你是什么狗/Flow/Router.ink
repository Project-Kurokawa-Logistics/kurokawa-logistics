// ============================================================================
// 题库抽样与推进路由
// - QUICK 模式：从 9 大主题题组各随机抽取 1 题（共 9 题，绝不重复，且保持计分完全对称）
// - FULL  模式：按顺序完整体验全部 27 道题
// ============================================================================

=== Flow__Router

= Start
    { QUIZ_MODE == "FULL":
        -> Full_Q01
    - else:
        -> Quick_P01
    }

// ----------------------------------------------------------------------------
// 随机 9 题速测路由（每组 3 选 1）
// ----------------------------------------------------------------------------

= Quick_P01
    ~ CURRENT_STEP = 1
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_01__Q1 -> Quick_P02
    - pick == 2:
        -> Pool_01__Q2 -> Quick_P02
    - else:
        -> Pool_01__Q3 -> Quick_P02
    }

= Quick_P02
    ~ CURRENT_STEP = 2
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_02__Q1 -> Quick_P03
    - pick == 2:
        -> Pool_02__Q2 -> Quick_P03
    - else:
        -> Pool_02__Q3 -> Quick_P03
    }

= Quick_P03
    ~ CURRENT_STEP = 3
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_03__Q1 -> Quick_P04
    - pick == 2:
        -> Pool_03__Q2 -> Quick_P04
    - else:
        -> Pool_03__Q3 -> Quick_P04
    }

= Quick_P04
    ~ CURRENT_STEP = 4
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_04__Q1 -> Quick_P05
    - pick == 2:
        -> Pool_04__Q2 -> Quick_P05
    - else:
        -> Pool_04__Q3 -> Quick_P05
    }

= Quick_P05
    ~ CURRENT_STEP = 5
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_05__Q1 -> Quick_P06
    - pick == 2:
        -> Pool_05__Q2 -> Quick_P06
    - else:
        -> Pool_05__Q3 -> Quick_P06
    }

= Quick_P06
    ~ CURRENT_STEP = 6
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_06__Q1 -> Quick_P07
    - pick == 2:
        -> Pool_06__Q2 -> Quick_P07
    - else:
        -> Pool_06__Q3 -> Quick_P07
    }

= Quick_P07
    ~ CURRENT_STEP = 7
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_07__Q1 -> Quick_P08
    - pick == 2:
        -> Pool_07__Q2 -> Quick_P08
    - else:
        -> Pool_07__Q3 -> Quick_P08
    }

= Quick_P08
    ~ CURRENT_STEP = 8
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_08__Q1 -> Quick_P09
    - pick == 2:
        -> Pool_08__Q2 -> Quick_P09
    - else:
        -> Pool_08__Q3 -> Quick_P09
    }

= Quick_P09
    ~ CURRENT_STEP = 9
    ~ temp pick = RANDOM(1, 3)
    {
    - pick == 1:
        -> Pool_09__Q1 -> Settle
    - pick == 2:
        -> Pool_09__Q2 -> Settle
    - else:
        -> Pool_09__Q3 -> Settle
    }

// ----------------------------------------------------------------------------
// 完整 27 题深测路由
// ----------------------------------------------------------------------------

= Full_Q01
    ~ CURRENT_STEP = 1
    -> Pool_01__Q1 -> Full_Q02
= Full_Q02
    ~ CURRENT_STEP = 2
    -> Pool_01__Q2 -> Full_Q03
= Full_Q03
    ~ CURRENT_STEP = 3
    -> Pool_01__Q3 -> Full_Q04

= Full_Q04
    ~ CURRENT_STEP = 4
    -> Pool_02__Q1 -> Full_Q05
= Full_Q05
    ~ CURRENT_STEP = 5
    -> Pool_02__Q2 -> Full_Q06
= Full_Q06
    ~ CURRENT_STEP = 6
    -> Pool_02__Q3 -> Full_Q07

= Full_Q07
    ~ CURRENT_STEP = 7
    -> Pool_03__Q1 -> Full_Q08
= Full_Q08
    ~ CURRENT_STEP = 8
    -> Pool_03__Q2 -> Full_Q09
= Full_Q09
    ~ CURRENT_STEP = 9
    -> Pool_03__Q3 -> Full_Q10

= Full_Q10
    ~ CURRENT_STEP = 10
    -> Pool_04__Q1 -> Full_Q11
= Full_Q11
    ~ CURRENT_STEP = 11
    -> Pool_04__Q2 -> Full_Q12
= Full_Q12
    ~ CURRENT_STEP = 12
    -> Pool_04__Q3 -> Full_Q13

= Full_Q13
    ~ CURRENT_STEP = 13
    -> Pool_05__Q1 -> Full_Q14
= Full_Q14
    ~ CURRENT_STEP = 14
    -> Pool_05__Q2 -> Full_Q15
= Full_Q15
    ~ CURRENT_STEP = 15
    -> Pool_05__Q3 -> Full_Q16

= Full_Q16
    ~ CURRENT_STEP = 16
    -> Pool_06__Q1 -> Full_Q17
= Full_Q17
    ~ CURRENT_STEP = 17
    -> Pool_06__Q2 -> Full_Q18
= Full_Q18
    ~ CURRENT_STEP = 18
    -> Pool_06__Q3 -> Full_Q19

= Full_Q19
    ~ CURRENT_STEP = 19
    -> Pool_07__Q1 -> Full_Q20
= Full_Q20
    ~ CURRENT_STEP = 20
    -> Pool_07__Q2 -> Full_Q21
= Full_Q21
    ~ CURRENT_STEP = 21
    -> Pool_07__Q3 -> Full_Q22

= Full_Q22
    ~ CURRENT_STEP = 22
    -> Pool_08__Q1 -> Full_Q23
= Full_Q23
    ~ CURRENT_STEP = 23
    -> Pool_08__Q2 -> Full_Q24
= Full_Q24
    ~ CURRENT_STEP = 24
    -> Pool_08__Q3 -> Full_Q25

= Full_Q25
    ~ CURRENT_STEP = 25
    -> Pool_09__Q1 -> Full_Q26
= Full_Q26
    ~ CURRENT_STEP = 26
    -> Pool_09__Q2 -> Full_Q27
= Full_Q27
    ~ CURRENT_STEP = 27
    -> Pool_09__Q3 -> Settle

// ----------------------------------------------------------------------------
// 结算分发
// ----------------------------------------------------------------------------

= Settle
    ~ temp winner = Get__Winner_Id()
    ~ COUNT_PLAYED = COUNT_PLAYED + 1
    ~ IS_PREVIEW_MODE = false
    ~ Unlock__Dog(winner)
    # CLEAR
    -> Route__Show_Card(winner)
