=== function Get__Forced_Intrusion()

{
    // Priority matches the original startup checks: missing key work routes, missing interview, then missing gym.
    - Get__Sanity_State(SAN_SCORE) == "BAD" and (COUNT_ROUTE_WORK_BUSINESS_TRIP == 0 or COUNT_ROUTE_WORK_OFF_WORK == 0):
        ~ return "WORK"

    - Get__Sanity_State(SAN_SCORE) == "BAD" and COUNT_ROUTE_BREAK_INTERVIEW == 0:
        ~ return "BREAK"

    - Get__Sanity_State(SAN_SCORE) != "FINE" and COUNT_ROUTE_WORK_GYM == 0:
        ~ return "WORK"

    - else:
        ~ return "NONE"
}
