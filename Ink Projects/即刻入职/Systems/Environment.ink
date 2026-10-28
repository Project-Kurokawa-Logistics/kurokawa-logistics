=== Check__Environment

/*

////////////////////////////////

////////////////////////////////

////////////////////////////////

////////////////////////////////

【DEV】SAN_SCORE = {SAN_SCORE}

【DEV】SAN：{Get__Sanity_State(SAN_SCORE)}

<hr>

【DEV】健身房 = {COUNT_ROUTE_WORK_GYM}

【DEV】下班 = {COUNT_ROUTE_WORK_OFF_WORK}

【DEV】出差 = {COUNT_ROUTE_WORK_BUSINESS_TRIP}

【DEV】小憩 = {COUNT_ROUTE_WORK_NAPPING}

【DEV】办公室 = {COUNT_ROUTE_WORK_SHUTDOWN}

<hr>

【DEV】面试 = {COUNT_ROUTE_BREAK_INTERVIEW}

【DEV】电影院 = {COUNT_ROUTE_BREAK_CINEMA}

【DEV】快递 = {COUNT_ROUTE_BREAK_HOME}

【DEV】家 = {COUNT_ROUTE_BREAK_SHUTDOWN}

////////////////////////////////

////////////////////////////////

////////////////////////////////

////////////////////////////////

【DEV】启动检查，如果出现了提前被标记上的终结事件则直接进入乱码页，反之进入正常主界面。

【DEV】Get__Aboard_Status()：{Get__Aboard_Status()}

【DEV】COUNT_ROUTE_WORK_SHUTDOWN = {COUNT_ROUTE_WORK_SHUTDOWN}

*/

{

-   Get__Aboard_Status() == "DRONE":

    ->  Page__Drone

-   else:

    ->  Page__Title

}
