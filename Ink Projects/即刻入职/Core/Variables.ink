=== Core__Variables

// Mental-state score. -1 identifies the first launch; each new route adds 10, repeats add 5.
VAR SAN_SCORE = -1

// Retained for compatibility with the original story data; currently not used by route logic.
VAR LAST_NODE = "First"

// Completed route endings / reconnect count.
VAR COUNT_GAME_OVER = 0

// Hidden title-menu interaction counter.
VAR COUNT_MENU_SEPARATOR = 0

// Route visit counters: 0 = unseen, 1 = first visit, >1 = repeated visits.
VAR COUNT_ROUTE_WORK_GYM = 0
VAR COUNT_ROUTE_WORK_OFF_WORK = 0
VAR COUNT_ROUTE_WORK_BUSINESS_TRIP = 0
VAR COUNT_ROUTE_WORK_NAPPING = 0
VAR COUNT_ROUTE_WORK_SHUTDOWN = 0
VAR COUNT_ROUTE_BREAK_INTERVIEW = 0
VAR COUNT_ROUTE_BREAK_CINEMA = 0
VAR COUNT_ROUTE_BREAK_HOME = 0
VAR COUNT_ROUTE_BREAK_SHUTDOWN = 0

// True only after entering the final white-space reconciliation scene (the hidden menu easter egg may set it too).
VAR HAS_ENTERED_FINAL_RECONCILIATION = false

// Secret database easter egg; deliberately separate from the actual final reconciliation.
VAR UNLOCKED_NO8_DATABASE = false

-> DONE
