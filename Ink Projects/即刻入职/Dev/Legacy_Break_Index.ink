// 遗留／隔离开发：运行入口已不再 INCLUDE 这个路线中枢。
// 它仅保留迁移前的节点名 Break__Route_Hub 作为参考；主导航会直接给出路线选项。
// 不要从发布代码跳转到这里。

=== Break__Route_Hub

{

-   COUNT_ROUTE_BREAK_INTERVIEW != 0 and COUNT_ROUTE_BREAK_CINEMA != 0 and COUNT_ROUTE_BREAK_HOME != 0:

    哪里也不想去。

    ->  Break__Shutdown

-   else:

    ->  Flow__Going_To.Choice

}
