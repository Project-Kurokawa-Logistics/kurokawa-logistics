=== function Get__Sanity_State(score)

{
    // AWFUL means all ordinary routes have been seen; Break__Shutdown is the final required route.
    - score >= 60 and COUNT_ROUTE_WORK_GYM != 0 and COUNT_ROUTE_WORK_OFF_WORK != 0 and COUNT_ROUTE_WORK_BUSINESS_TRIP != 0 and COUNT_ROUTE_WORK_NAPPING != 0 and COUNT_ROUTE_WORK_SHUTDOWN != 0 and COUNT_ROUTE_BREAK_INTERVIEW != 0 and COUNT_ROUTE_BREAK_CINEMA != 0 and COUNT_ROUTE_BREAK_HOME != 0:
        ~ return "AWFUL"

    - score >= 60:
        ~ return "BAD"

    - score >= 30 and score < 60:
        ~ return "OK"

    - score < 30:
        ~ return "FINE"
}
