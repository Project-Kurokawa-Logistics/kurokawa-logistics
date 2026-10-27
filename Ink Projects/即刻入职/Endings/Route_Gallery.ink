=== Ending__Route_Gallery

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

=   Index

+   {COUNT_ROUTE_WORK_BUSINESS_TRIP != 0} 出差

    <-  Ending__Work__Business_Trip

    ->  Menu__Endings

+   {COUNT_ROUTE_WORK_GYM != 0} 健身房

    <-  Ending__Work__Gym

    ->  Menu__Endings

+   {COUNT_ROUTE_WORK_OFF_WORK != 0} 下班路上

    <-  Ending__Work__Off_Work

    ->  Menu__Endings

+   {COUNT_ROUTE_WORK_NAPPING != 0} 小憩

    <-  Ending__Work__Napping

    ->  Menu__Endings

+   {COUNT_ROUTE_WORK_SHUTDOWN != 0} 办公室

    <-  Ending__Work__Shutdown

    ->  Menu__Endings

+   <hr>

    ->  Ending__Route_Gallery

+   {COUNT_ROUTE_BREAK_INTERVIEW != 0} 面试

    <-  Ending__Break__Interview

    ->  Menu__Endings

+   {COUNT_ROUTE_BREAK_CINEMA != 0} 电影院

    <-  Ending__Break__Cinema

    ->  Menu__Endings

+   {COUNT_ROUTE_BREAK_HOME != 0} 收快递

    <-  Ending__Break__Home

    ->  Menu__Endings

+   {COUNT_ROUTE_BREAK_SHUTDOWN != 0} 在家

    <-  Ending__Break__Shutdown

    ->  Menu__Endings

+   <hr>

    ->  Ending__Route_Gallery

+   {COUNT_MENU_SEPARATOR <= 5} [返回上一级]

    ->  Menu__Main

+   {COUNT_MENU_SEPARATOR > 5} 重置游戏

    # RESTART

    ->  END
