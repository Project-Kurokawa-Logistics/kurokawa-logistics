// LEGACY: This route hub is no longer included by the runtime entry. The main navigation offers route choices directly.

=== Break__Route_Hub

{

-   COUNT_ROUTE_BREAK_INTERVIEW != 0 and COUNT_ROUTE_BREAK_CINEMA != 0 and COUNT_ROUTE_BREAK_HOME != 0:

    哪里也不想去。

    ->  Break__Shutdown

-   else:

    ->  Flow__Going_To.Choice

}
