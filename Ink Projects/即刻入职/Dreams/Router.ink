=== Dream__Router

= Check
{
    - Get__Aboard_Status() == "DRONE":
        -> Check__Environment

    - Get__Aboard_Status() == "No.8" and HAS_ENTERED_FINAL_RECONCILIATION == false:
        // 白空间和解就是最终的苏醒；不要再先抽取一次梦境。
        -> Ending__Final_Reconciliation

    - Get__Aboard_Status() == "No.8" and HAS_ENTERED_FINAL_RECONCILIATION == true:
        -> Ending__No8_Reality

    - Get__Forced_Intrusion() != "NONE":
        // 强制的 AZ 入侵优先于随机梦境抽取。
        -> Flow__Startup.Check

    - Get__Sanity_State(SAN_SCORE) == "FINE":
        -> Flow__Startup

    - else:
        -> Check__Dream_Chance
}

= Check__Dream_Chance

~ temp Roll = RANDOM(1,100)

{
    - Get__Sanity_State(SAN_SCORE) == "OK" and Roll <= 50:
        -> Shuffle

    - Get__Sanity_State(SAN_SCORE) == "OK" and Roll > 50:
        -> Flow__Startup

    - Get__Sanity_State(SAN_SCORE) == "BAD" and Roll <= 75:
        -> Shuffle

    - Get__Sanity_State(SAN_SCORE) == "BAD" and Roll > 75:
        -> Flow__Startup

    - Get__Sanity_State(SAN_SCORE) == "AWFUL":
        -> Shuffle

    - else:
        -> Dev__BUG
}

= Shuffle

{ shuffle:
    - <- Dream1
    - <- Dream2
    - <- Dream3
    - <- Dream4
    - <- Dream5
    - <- Dream6
}

-> Flow__Startup
