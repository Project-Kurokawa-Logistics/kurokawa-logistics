=== function Get__Forced_Intrusion()

{
    // 优先级与原始启动检查一致：先检查缺失的关键工作路线，再检查缺失的面试，最后检查缺失的健身房。
    - Get__Sanity_State(SAN_SCORE) == "BAD" and (COUNT_ROUTE_WORK_BUSINESS_TRIP == 0 or COUNT_ROUTE_WORK_OFF_WORK == 0):
        ~ return "WORK"

    - Get__Sanity_State(SAN_SCORE) == "BAD" and COUNT_ROUTE_BREAK_INTERVIEW == 0:
        ~ return "BREAK"

    - Get__Sanity_State(SAN_SCORE) != "FINE" and COUNT_ROUTE_WORK_GYM == 0:
        ~ return "WORK"

    - else:
        ~ return "NONE"
}
