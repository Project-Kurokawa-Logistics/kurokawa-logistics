// LEGACY / ISOLATED DEV: This route hub is no longer included by the runtime entry.
// It keeps the pre-migration knot name Break__Route_Hub for reference only; the main
// navigation offers route choices directly. Do not divert to it from release code.

=== Break__Route_Hub

{

-   COUNT_ROUTE_BREAK_INTERVIEW != 0 and COUNT_ROUTE_BREAK_CINEMA != 0 and COUNT_ROUTE_BREAK_HOME != 0:

    哪里也不想去。

    ->  Break__Shutdown

-   else:

    ->  Flow__Going_To.Choice

}
