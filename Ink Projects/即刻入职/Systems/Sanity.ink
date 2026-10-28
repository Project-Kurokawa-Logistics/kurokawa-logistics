=== function Get__Sanity_State(score)

{
    // AWFUL 表示所有普通路线都已看过；Break__Shutdown 是最后一条必需路线。
    - score >= 60 and COUNT_ROUTE_WORK_GYM != 0 and COUNT_ROUTE_WORK_OFF_WORK != 0 and COUNT_ROUTE_WORK_BUSINESS_TRIP != 0 and COUNT_ROUTE_WORK_NAPPING != 0 and COUNT_ROUTE_WORK_SHUTDOWN != 0 and COUNT_ROUTE_BREAK_INTERVIEW != 0 and COUNT_ROUTE_BREAK_CINEMA != 0 and COUNT_ROUTE_BREAK_HOME != 0:
        ~ return "AWFUL"

    - score >= 60:
        ~ return "BAD"

    - score >= 30 and score < 60:
        ~ return "OK"

    - score < 30:
        ~ return "FINE"
}
