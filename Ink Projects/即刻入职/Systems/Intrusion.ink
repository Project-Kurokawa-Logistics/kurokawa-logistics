=== function Get__Forced_Intrusion()

{
    // Preserve the existing escalation thresholds and priority.
    - Check__SAN(INDEX) == "BAD" and (Flag__Work__Business_Trip == 0 or Flag__Work__Off_Work == 0):
        ~ return "WORK"

    - Check__SAN(INDEX) == "BAD" and Flag__Break__Interview == 0:
        ~ return "BREAK"

    - Check__SAN(INDEX) != "FINE" and Flag__Work__Gym == 0:
        ~ return "WORK"

    - else:
        ~ return "NONE"
}
