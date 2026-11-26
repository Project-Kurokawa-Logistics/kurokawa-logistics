// ============================================================================
// 《测测你是什么狗》全局变量与常量定义
// ============================================================================

// 十二犬种枚举常量
CONST DOG_DASAO   = 1   // 大骚狗
CONST DOG_XIAONAI = 2   // 小奶狗
CONST DOG_DALANG  = 3   // 大狼狗
CONST DOG_LAOMU   = 4   // 熟男老母狗
CONST DOG_SAMOYE  = 5   // 邪恶萨摩耶
CONST DOG_NIUMA   = 6   // 社畜牛马狗
CONST DOG_BAIQUAN = 7   // 傲娇败犬
CONST DOG_HASHIQI = 8   // 发疯哈士奇
CONST DOG_BIANMU  = 9   // 高智商边牧
CONST DOG_JILV    = 10  // 狂热纪律狗
CONST DOG_JIXIE   = 11  // 赛博机械狗
CONST DOG_LAOSHI  = 12  // 看门老实狗

// 单局十二犬种累计得分
VAR SCORE_DASAO   = 0
VAR SCORE_XIAONAI = 0
VAR SCORE_DALANG  = 0
VAR SCORE_LAOMU   = 0
VAR SCORE_SAMOYE  = 0
VAR SCORE_NIUMA   = 0
VAR SCORE_BAIQUAN = 0
VAR SCORE_HASHIQI = 0
VAR SCORE_BIANMU  = 0
VAR SCORE_JILV    = 0
VAR SCORE_JIXIE   = 0
VAR SCORE_LAOSHI  = 0

// 单局流程控制状态
VAR QUIZ_MODE        = "QUICK"  // "QUICK" = 随机 9 题速测 | "FULL" = 完整 27 题深测
VAR CURRENT_STEP     = 0        // 当前已进入题号（1..TOTAL_STEPS）
VAR TOTAL_STEPS      = 9        // 本局总题数（9 或 27）
VAR LAST_PRIMARY_DOG = 1        // 最近一次主选倾向，用于极端同分时优先响应玩家最新直觉
VAR IS_PREVIEW_MODE  = false    // 图鉴预览模式标记（不累加测试次数与解锁状态）

// 跨周目图鉴与彩蛋记录（点击“再测一次”保留，仅在宿主 RESTART 时清空）
VAR COUNT_PLAYED          = 0
VAR COUNT_MENU_SEPARATOR  = 0
VAR UNLOCKED_ALL_PREVIEW  = false

VAR UNLOCKED_DASAO   = false
VAR UNLOCKED_XIAONAI = false
VAR UNLOCKED_DALANG  = false
VAR UNLOCKED_LAOMU   = false
VAR UNLOCKED_SAMOYE  = false
VAR UNLOCKED_NIUMA   = false
VAR UNLOCKED_BAIQUAN = false
VAR UNLOCKED_HASHIQI = false
VAR UNLOCKED_BIANMU  = false
VAR UNLOCKED_JILV    = false
VAR UNLOCKED_JIXIE   = false
VAR UNLOCKED_LAOSHI  = false
