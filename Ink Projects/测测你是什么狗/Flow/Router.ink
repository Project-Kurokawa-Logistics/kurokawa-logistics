// ============================================================================
// 状态机式题库路由（零隧道栈开销，支持在任意题号随时“返回上一题”并无损回滚计分）
// ============================================================================

=== Flow__Router

= Start
    -> Dispatch

= Dispatch
    {
    - CURRENT_STEP < 1:
        # CLEAR
        -> Page__Title
    - CURRENT_STEP > TOTAL_STEPS:
        -> Settle
    - QUIZ_MODE == "FULL":
        -> Dispatch_Full
    - else:
        -> Dispatch_Quick
    }

// 返回上一题：回退题号并精确撤回上一题加分，再重新渲染上一题
= Back
    ~ CURRENT_STEP = CURRENT_STEP - 1
    ~ Undo__Step(CURRENT_STEP)
    # CLEAR
    -> Dispatch

// 第 1 题返回标题页
= Cancel
    # CLEAR
    -> Page__Title

// ----------------------------------------------------------------------------
// 随机 9 题速测分发（读取开局预抽样的 PICK_P01..PICK_P09，返回上一题题目保持不变）
// ----------------------------------------------------------------------------

= Dispatch_Quick
    {
    - CURRENT_STEP == 1:
        {
        - PICK_P01 == 1:
            -> Pool_01__Q1
        - PICK_P01 == 2:
            -> Pool_01__Q2
        - else:
            -> Pool_01__Q3
        }
    - CURRENT_STEP == 2:
        {
        - PICK_P02 == 1:
            -> Pool_02__Q1
        - PICK_P02 == 2:
            -> Pool_02__Q2
        - else:
            -> Pool_02__Q3
        }
    - CURRENT_STEP == 3:
        {
        - PICK_P03 == 1:
            -> Pool_03__Q1
        - PICK_P03 == 2:
            -> Pool_03__Q2
        - else:
            -> Pool_03__Q3
        }
    - CURRENT_STEP == 4:
        {
        - PICK_P04 == 1:
            -> Pool_04__Q1
        - PICK_P04 == 2:
            -> Pool_04__Q2
        - else:
            -> Pool_04__Q3
        }
    - CURRENT_STEP == 5:
        {
        - PICK_P05 == 1:
            -> Pool_05__Q1
        - PICK_P05 == 2:
            -> Pool_05__Q2
        - else:
            -> Pool_05__Q3
        }
    - CURRENT_STEP == 6:
        {
        - PICK_P06 == 1:
            -> Pool_06__Q1
        - PICK_P06 == 2:
            -> Pool_06__Q2
        - else:
            -> Pool_06__Q3
        }
    - CURRENT_STEP == 7:
        {
        - PICK_P07 == 1:
            -> Pool_07__Q1
        - PICK_P07 == 2:
            -> Pool_07__Q2
        - else:
            -> Pool_07__Q3
        }
    - CURRENT_STEP == 8:
        {
        - PICK_P08 == 1:
            -> Pool_08__Q1
        - PICK_P08 == 2:
            -> Pool_08__Q2
        - else:
            -> Pool_08__Q3
        }
    - else:
        {
        - PICK_P09 == 1:
            -> Pool_09__Q1
        - PICK_P09 == 2:
            -> Pool_09__Q2
        - else:
            -> Pool_09__Q3
        }
    }

// ----------------------------------------------------------------------------
// 完整 27 题深测分发
// ----------------------------------------------------------------------------

= Dispatch_Full
    {
    - CURRENT_STEP == 1:
        -> Pool_01__Q1
    - CURRENT_STEP == 2:
        -> Pool_01__Q2
    - CURRENT_STEP == 3:
        -> Pool_01__Q3
    - CURRENT_STEP == 4:
        -> Pool_02__Q1
    - CURRENT_STEP == 5:
        -> Pool_02__Q2
    - CURRENT_STEP == 6:
        -> Pool_02__Q3
    - CURRENT_STEP == 7:
        -> Pool_03__Q1
    - CURRENT_STEP == 8:
        -> Pool_03__Q2
    - CURRENT_STEP == 9:
        -> Pool_03__Q3
    - CURRENT_STEP == 10:
        -> Pool_04__Q1
    - CURRENT_STEP == 11:
        -> Pool_04__Q2
    - CURRENT_STEP == 12:
        -> Pool_04__Q3
    - CURRENT_STEP == 13:
        -> Pool_05__Q1
    - CURRENT_STEP == 14:
        -> Pool_05__Q2
    - CURRENT_STEP == 15:
        -> Pool_05__Q3
    - CURRENT_STEP == 16:
        -> Pool_06__Q1
    - CURRENT_STEP == 17:
        -> Pool_06__Q2
    - CURRENT_STEP == 18:
        -> Pool_06__Q3
    - CURRENT_STEP == 19:
        -> Pool_07__Q1
    - CURRENT_STEP == 20:
        -> Pool_07__Q2
    - CURRENT_STEP == 21:
        -> Pool_07__Q3
    - CURRENT_STEP == 22:
        -> Pool_08__Q1
    - CURRENT_STEP == 23:
        -> Pool_08__Q2
    - CURRENT_STEP == 24:
        -> Pool_08__Q3
    - CURRENT_STEP == 25:
        -> Pool_09__Q1
    - CURRENT_STEP == 26:
        -> Pool_09__Q2
    - else:
        -> Pool_09__Q3
    }

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
