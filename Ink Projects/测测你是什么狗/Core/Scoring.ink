// ============================================================================
// 计分、重置、胜出判定与图鉴辅助函数
// ============================================================================

=== function Reset__Current_Run(mode)
    ~ SCORE_DASAO   = 0
    ~ SCORE_XIAONAI = 0
    ~ SCORE_DALANG  = 0
    ~ SCORE_LAOMU   = 0
    ~ SCORE_SAMOYE  = 0
    ~ SCORE_NIUMA   = 0
    ~ SCORE_BAIQUAN = 0
    ~ SCORE_HASHIQI = 0
    ~ SCORE_BIANMU  = 0
    ~ SCORE_JILV    = 0
    ~ SCORE_JIXIE   = 0
    ~ SCORE_LAOSHI  = 0

    ~ QUIZ_MODE = mode
    ~ CURRENT_STEP = 0
    { mode == "FULL":
        ~ TOTAL_STEPS = 27
    - else:
        ~ TOTAL_STEPS = 9
    }
    ~ LAST_PRIMARY_DOG = 1
    ~ IS_PREVIEW_MODE = false

=== function Add__Score_By_Id(dog_id, pts)
    {
    - dog_id == DOG_DASAO:
        ~ SCORE_DASAO = SCORE_DASAO + pts
    - dog_id == DOG_XIAONAI:
        ~ SCORE_XIAONAI = SCORE_XIAONAI + pts
    - dog_id == DOG_DALANG:
        ~ SCORE_DALANG = SCORE_DALANG + pts
    - dog_id == DOG_LAOMU:
        ~ SCORE_LAOMU = SCORE_LAOMU + pts
    - dog_id == DOG_SAMOYE:
        ~ SCORE_SAMOYE = SCORE_SAMOYE + pts
    - dog_id == DOG_NIUMA:
        ~ SCORE_NIUMA = SCORE_NIUMA + pts
    - dog_id == DOG_BAIQUAN:
        ~ SCORE_BAIQUAN = SCORE_BAIQUAN + pts
    - dog_id == DOG_HASHIQI:
        ~ SCORE_HASHIQI = SCORE_HASHIQI + pts
    - dog_id == DOG_BIANMU:
        ~ SCORE_BIANMU = SCORE_BIANMU + pts
    - dog_id == DOG_JILV:
        ~ SCORE_JILV = SCORE_JILV + pts
    - dog_id == DOG_JIXIE:
        ~ SCORE_JIXIE = SCORE_JIXIE + pts
    - dog_id == DOG_LAOSHI:
        ~ SCORE_LAOSHI = SCORE_LAOSHI + pts
    }

// 每个选项赋予：主倾向 +3，次倾向 +2，微倾向 +1
=== function Apply__Choice(primary_id, secondary_id, tertiary_id)
    ~ LAST_PRIMARY_DOG = primary_id
    ~ Add__Score_By_Id(primary_id, 3)
    ~ Add__Score_By_Id(secondary_id, 2)
    ~ Add__Score_By_Id(tertiary_id, 1)

=== function Get__Dog_Score(dog_id)
    {
    - dog_id == DOG_DASAO:
        ~ return SCORE_DASAO
    - dog_id == DOG_XIAONAI:
        ~ return SCORE_XIAONAI
    - dog_id == DOG_DALANG:
        ~ return SCORE_DALANG
    - dog_id == DOG_LAOMU:
        ~ return SCORE_LAOMU
    - dog_id == DOG_SAMOYE:
        ~ return SCORE_SAMOYE
    - dog_id == DOG_NIUMA:
        ~ return SCORE_NIUMA
    - dog_id == DOG_BAIQUAN:
        ~ return SCORE_BAIQUAN
    - dog_id == DOG_HASHIQI:
        ~ return SCORE_HASHIQI
    - dog_id == DOG_BIANMU:
        ~ return SCORE_BIANMU
    - dog_id == DOG_JILV:
        ~ return SCORE_JILV
    - dog_id == DOG_JIXIE:
        ~ return SCORE_JIXIE
    - dog_id == DOG_LAOSHI:
        ~ return SCORE_LAOSHI
    }
    ~ return 0

=== function Get__Dog_Name(dog_id)
    {
    - dog_id == DOG_DASAO:
        ~ return "大骚狗"
    - dog_id == DOG_XIAONAI:
        ~ return "小奶狗"
    - dog_id == DOG_DALANG:
        ~ return "大狼狗"
    - dog_id == DOG_LAOMU:
        ~ return "熟男老母狗"
    - dog_id == DOG_SAMOYE:
        ~ return "邪恶萨摩耶"
    - dog_id == DOG_NIUMA:
        ~ return "社畜牛马狗"
    - dog_id == DOG_BAIQUAN:
        ~ return "傲娇败犬"
    - dog_id == DOG_HASHIQI:
        ~ return "发疯哈士奇"
    - dog_id == DOG_BIANMU:
        ~ return "高智商边牧"
    - dog_id == DOG_JILV:
        ~ return "狂热纪律狗"
    - dog_id == DOG_JIXIE:
        ~ return "赛博机械狗"
    - dog_id == DOG_LAOSHI:
        ~ return "看门老实狗"
    }
    ~ return "未知犬种"

// 从最近一次主选犬种开始环形扫描最高分，避免同分时固定偏向 1 号犬种
=== function Get__Winner_Id()
    ~ temp best_id = LAST_PRIMARY_DOG
    ~ temp best_score = Get__Dog_Score(best_id)
    ~ temp offset = 1
    ~ temp candidate_id = 1
    ~ temp candidate_score = 0

    ~ candidate_id = ((LAST_PRIMARY_DOG + 0) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 1) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 2) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 3) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 4) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 5) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 6) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 7) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 8) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 9) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ candidate_id = ((LAST_PRIMARY_DOG + 10) mod 12) + 1
    ~ candidate_score = Get__Dog_Score(candidate_id)
    { candidate_score > best_score:
        ~ best_score = candidate_score
        ~ best_id = candidate_id
    }

    ~ return best_id

// 获取副犬种（得分第二高的犬种），用于页脚彩蛋提示
=== function Get__Runner_Up_Id(winner_id)
    ~ temp second_id = 0
    ~ temp second_score = -1
    ~ temp s = 0

    { winner_id != DOG_DASAO:
        ~ s = SCORE_DASAO
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_DASAO
        }
    }
    { winner_id != DOG_XIAONAI:
        ~ s = SCORE_XIAONAI
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_XIAONAI
        }
    }
    { winner_id != DOG_DALANG:
        ~ s = SCORE_DALANG
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_DALANG
        }
    }
    { winner_id != DOG_LAOMU:
        ~ s = SCORE_LAOMU
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_LAOMU
        }
    }
    { winner_id != DOG_SAMOYE:
        ~ s = SCORE_SAMOYE
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_SAMOYE
        }
    }
    { winner_id != DOG_NIUMA:
        ~ s = SCORE_NIUMA
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_NIUMA
        }
    }
    { winner_id != DOG_BAIQUAN:
        ~ s = SCORE_BAIQUAN
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_BAIQUAN
        }
    }
    { winner_id != DOG_HASHIQI:
        ~ s = SCORE_HASHIQI
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_HASHIQI
        }
    }
    { winner_id != DOG_BIANMU:
        ~ s = SCORE_BIANMU
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_BIANMU
        }
    }
    { winner_id != DOG_JILV:
        ~ s = SCORE_JILV
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_JILV
        }
    }
    { winner_id != DOG_JIXIE:
        ~ s = SCORE_JIXIE
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_JIXIE
        }
    }
    { winner_id != DOG_LAOSHI:
        ~ s = SCORE_LAOSHI
        { s > second_score:
            ~ second_score = s
            ~ second_id = DOG_LAOSHI
        }
    }
    ~ return second_id

=== function Unlock__Dog(dog_id)
    {
    - dog_id == DOG_DASAO:
        ~ UNLOCKED_DASAO = true
    - dog_id == DOG_XIAONAI:
        ~ UNLOCKED_XIAONAI = true
    - dog_id == DOG_DALANG:
        ~ UNLOCKED_DALANG = true
    - dog_id == DOG_LAOMU:
        ~ UNLOCKED_LAOMU = true
    - dog_id == DOG_SAMOYE:
        ~ UNLOCKED_SAMOYE = true
    - dog_id == DOG_NIUMA:
        ~ UNLOCKED_NIUMA = true
    - dog_id == DOG_BAIQUAN:
        ~ UNLOCKED_BAIQUAN = true
    - dog_id == DOG_HASHIQI:
        ~ UNLOCKED_HASHIQI = true
    - dog_id == DOG_BIANMU:
        ~ UNLOCKED_BIANMU = true
    - dog_id == DOG_JILV:
        ~ UNLOCKED_JILV = true
    - dog_id == DOG_JIXIE:
        ~ UNLOCKED_JIXIE = true
    - dog_id == DOG_LAOSHI:
        ~ UNLOCKED_LAOSHI = true
    }

=== function Get__Unlocked_Count()
    ~ temp total = 0
    { UNLOCKED_DASAO:
        ~ total = total + 1
    }
    { UNLOCKED_XIAONAI:
        ~ total = total + 1
    }
    { UNLOCKED_DALANG:
        ~ total = total + 1
    }
    { UNLOCKED_LAOMU:
        ~ total = total + 1
    }
    { UNLOCKED_SAMOYE:
        ~ total = total + 1
    }
    { UNLOCKED_NIUMA:
        ~ total = total + 1
    }
    { UNLOCKED_BAIQUAN:
        ~ total = total + 1
    }
    { UNLOCKED_HASHIQI:
        ~ total = total + 1
    }
    { UNLOCKED_BIANMU:
        ~ total = total + 1
    }
    { UNLOCKED_JILV:
        ~ total = total + 1
    }
    { UNLOCKED_JIXIE:
        ~ total = total + 1
    }
    { UNLOCKED_LAOSHI:
        ~ total = total + 1
    }
    ~ return total
