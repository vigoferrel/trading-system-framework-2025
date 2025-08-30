// SCRIPT DE CORRECCIÓN DE INCONSISTENCIAS
// Generado automáticamente: 2025-08-25T08:39:04.961Z

const VALID_BINANCE_DATA = {
  "AGIXUSDT": {
    "price": 0.7009,
    "priceChange": 0.1108,
    "priceChangePercent": 18.776,
    "volume": 176909480
  },
  "BELUSDT": {
    "price": 0.2475,
    "priceChange": -0.0129,
    "priceChangePercent": -4.954,
    "volume": 19609319
  },
  "SAGAUSDT": {
    "price": 0.2568,
    "priceChange": -0.016,
    "priceChangePercent": -5.865,
    "volume": 67800043.1
  },
  "FUNUSDT": {
    "price": 0.00942,
    "priceChange": -0.000174,
    "priceChangePercent": -1.814,
    "volume": 1342987600
  },
  "BTCDOMUSDT": {
    "price": 3798,
    "priceChange": 24.2,
    "priceChangePercent": 0.641,
    "volume": 7476.022
  },
  "FILUSDT": {
    "price": 2.317,
    "priceChange": -0.128,
    "priceChangePercent": -5.235,
    "volume": 110119964.3
  },
  "AXSUSDT": {
    "price": 2.319,
    "priceChange": -0.086,
    "priceChangePercent": -3.576,
    "volume": 11742671
  },
  "WLDUSDT": {
    "price": 0.9295,
    "priceChange": -0.0442,
    "priceChangePercent": -4.539,
    "volume": 250765338
  },
  "DOGEUSDT": {
    "price": 0.22096,
    "priceChange": -0.01147,
    "priceChangePercent": -4.935,
    "volume": 10164771716
  },
  "SFPUSDT": {
    "price": 0.4462,
    "priceChange": -0.0161,
    "priceChangePercent": -3.483,
    "volume": 5355540
  },
  "MKRUSDT": {
    "price": 1508.9,
    "priceChange": -67.8,
    "priceChangePercent": -4.3,
    "volume": 32927.178
  },
  "CKBUSDT": {
    "price": 0.004863,
    "priceChange": -0.000113,
    "priceChangePercent": -2.271,
    "volume": 1874847915
  },
  "DARUSDT": {
    "price": 0.1425,
    "priceChange": -0.0119,
    "priceChangePercent": -7.707,
    "volume": 58361256.8
  },
  "ICPUSDT": {
    "price": 5.118,
    "priceChange": -0.162,
    "priceChangePercent": -3.068,
    "volume": 10032202
  },
  "UNIUSDT": {
    "price": 10.353,
    "priceChange": -0.75,
    "priceChangePercent": -6.755,
    "volume": 26448279
  },
  "PENDLEUSDT": {
    "price": 5.5076,
    "priceChange": -0.4457,
    "priceChangePercent": -7.487,
    "volume": 22101461
  },
  "SWELLUSDT": {
    "price": 0.0103,
    "priceChange": -0.00081,
    "priceChangePercent": -7.291,
    "volume": 282325009
  },
  "UNFIUSDT": {
    "price": 1.73,
    "priceChange": -0.1,
    "priceChangePercent": -5.464,
    "volume": 29086976
  },
  "SYSUSDT": {
    "price": 0.04244,
    "priceChange": -0.00161,
    "priceChangePercent": -3.655,
    "volume": 51329199
  },
  "KSMUSDT": {
    "price": 15.259,
    "priceChange": -0.773,
    "priceChangePercent": -4.822,
    "volume": 634259.4
  },
  "OBOLUSDT": {
    "price": 0.11117,
    "priceChange": -0.00414,
    "priceChangePercent": -3.59,
    "volume": 32310565
  },
  "HIVEUSDT": {
    "price": 0.20634,
    "priceChange": -0.00473,
    "priceChangePercent": -2.241,
    "volume": 13107149
  },
  "JELLYJELLYUSDT": {
    "price": 0.01783,
    "priceChange": -0.00119,
    "priceChangePercent": -6.257,
    "volume": 172871688
  },
  "FTMUSDT": {
    "price": 0.7702,
    "priceChange": -0.0612,
    "priceChangePercent": -7.361,
    "volume": 97559660
  },
  "SOLVUSDT": {
    "price": 0.04218,
    "priceChange": -0.0015,
    "priceChangePercent": -3.434,
    "volume": 96544448
  },
  "TWTUSDT": {
    "price": 0.7609,
    "priceChange": -0.0227,
    "priceChangePercent": -2.897,
    "volume": 5228645
  },
  "AGTUSDT": {
    "price": 0.004815,
    "priceChange": -0.000245,
    "priceChangePercent": -4.842,
    "volume": 2057306210
  },
  "ACHUSDT": {
    "price": 0.020992,
    "priceChange": -0.000318,
    "priceChangePercent": -1.492,
    "volume": 1154696271
  },
  "OMNIUSDT": {
    "price": 3.517,
    "priceChange": -0.22,
    "priceChangePercent": -5.887,
    "volume": 6681967.64
  },
  "DUSDT": {
    "price": 0.03264,
    "priceChange": -0.00132,
    "priceChangePercent": -3.887,
    "volume": 47419677
  },
  "SCRUSDT": {
    "price": 0.3718,
    "priceChange": -0.014,
    "priceChangePercent": -3.629,
    "volume": 26524568
  },
  "PIXELUSDT": {
    "price": 0.03296,
    "priceChange": -0.00149,
    "priceChangePercent": -4.325,
    "volume": 192635380
  },
  "BIDUSDT": {
    "price": 0.10197,
    "priceChange": 0.01017,
    "priceChangePercent": 11.078,
    "volume": 2083951340
  },
  "GRIFFAINUSDT": {
    "price": 0.03395,
    "priceChange": -0.00346,
    "priceChangePercent": -9.249,
    "volume": 299631937
  },
  "ETHUSDT": {
    "price": 4607.49,
    "priceChange": -166.62,
    "priceChangePercent": -3.49,
    "volume": 8050926.81
  },
  "WIFUSDT": {
    "price": 0.841,
    "priceChange": -0.0423,
    "priceChangePercent": -4.789,
    "volume": 503590870.2
  },
  "HYPERUSDT": {
    "price": 0.3059,
    "priceChange": -0.0144,
    "priceChangePercent": -4.496,
    "volume": 71238957
  },
  "TUTUSDT": {
    "price": 0.06029,
    "priceChange": -0.00677,
    "priceChangePercent": -10.095,
    "volume": 480149584
  },
  "AUSDT": {
    "price": 0.49665,
    "priceChange": -0.00873,
    "priceChangePercent": -1.727,
    "volume": 24936087
  },
  "JOEUSDT": {
    "price": 0.15278,
    "priceChange": -0.00497,
    "priceChangePercent": -3.151,
    "volume": 34376062
  },
  "PUFFERUSDT": {
    "price": 0.20356,
    "priceChange": -0.0073,
    "priceChangePercent": -3.462,
    "volume": 6596334
  },
  "DIAUSDT": {
    "price": 0.6594,
    "priceChange": -0.0131,
    "priceChangePercent": -1.948,
    "volume": 11422903
  },
  "ZROUSDT": {
    "price": 1.9769,
    "priceChange": -0.098,
    "priceChangePercent": -4.723,
    "volume": 18947114.6
  },
  "B2USDT": {
    "price": 0.3677,
    "priceChange": -0.0031,
    "priceChangePercent": -0.836,
    "volume": 3309837
  },
  "EIGENUSDT": {
    "price": 1.303,
    "priceChange": -0.0915,
    "priceChangePercent": -6.561,
    "volume": 63036882.7
  },
  "SOONUSDT": {
    "price": 0.23685,
    "priceChange": -0.02434,
    "priceChangePercent": -9.319,
    "volume": 244178088
  },
  "FHEUSDT": {
    "price": 0.05924,
    "priceChange": -0.01081,
    "priceChangePercent": -15.432,
    "volume": 1828388203
  },
  "XNYUSDT": {
    "price": 0.007342,
    "priceChange": 0.001042,
    "priceChangePercent": 16.54,
    "volume": 25974192894
  },
  "CYBERUSDT": {
    "price": 2.032,
    "priceChange": -0.162,
    "priceChangePercent": -7.384,
    "volume": 14135828.9
  },
  "GHSTUSDT": {
    "price": 0.4632,
    "priceChange": -0.0156,
    "priceChangePercent": -3.258,
    "volume": 2948985
  },
  "ANKRUSDT": {
    "price": 0.01525,
    "priceChange": -0.00061,
    "priceChangePercent": -3.846,
    "volume": 475301636
  },
  "TRUMPUSDT": {
    "price": 8.442,
    "priceChange": -0.257,
    "priceChangePercent": -2.954,
    "volume": 36828670.05
  },
  "ALPHAUSDT": {
    "price": 0.01429,
    "priceChange": -0.00033,
    "priceChangePercent": -2.257,
    "volume": 305601862
  },
  "DEGENUSDT": {
    "price": 0.003501,
    "priceChange": -0.000225,
    "priceChangePercent": -6.039,
    "volume": 1231178238
  },
  "ACEUSDT": {
    "price": 0.544,
    "priceChange": -0.0193,
    "priceChangePercent": -3.426,
    "volume": 4468553.5
  },
  "BUSDT": {
    "price": 0.54914,
    "priceChange": 0.02141,
    "priceChangePercent": 4.057,
    "volume": 21639506
  },
  "COMPUSDT": {
    "price": 44.84,
    "priceChange": -2.26,
    "priceChangePercent": -4.798,
    "volume": 738507.972
  },
  "ENJUSDT": {
    "price": 0.06918,
    "priceChange": -0.00299,
    "priceChangePercent": -4.143,
    "volume": 109493808
  },
  "YGGUSDT": {
    "price": 0.1603,
    "priceChange": -0.0061,
    "priceChangePercent": -3.666,
    "volume": 50913314
  },
  "COOKIEUSDT": {
    "price": 0.1322,
    "priceChange": -0.0053,
    "priceChangePercent": -3.855,
    "volume": 122058603
  },
  "NILUSDT": {
    "price": 0.2884,
    "priceChange": -0.0144,
    "priceChangePercent": -4.756,
    "volume": 13007613.7
  },
  "LITUSDT": {
    "price": 0.592,
    "priceChange": 0.002,
    "priceChangePercent": 0.339,
    "volume": 10983597
  },
  "DOLOUSDT": {
    "price": 0.28174,
    "priceChange": -0.017566,
    "priceChangePercent": -5.869,
    "volume": 267242883
  },
  "BNXUSDT": {
    "price": 2,
    "priceChange": 0.7979,
    "priceChangePercent": 66.376,
    "volume": 318403038.1
  },
  "ZKUSDT": {
    "price": 0.06438,
    "priceChange": -0.00204,
    "priceChangePercent": -3.071,
    "volume": 763790950
  },
  "AGLDUSDT": {
    "price": 0.685,
    "priceChange": -0.0204,
    "priceChangePercent": -2.892,
    "volume": 7892287
  },
  "OLUSDT": {
    "price": 0.03455,
    "priceChange": -0.00088,
    "priceChangePercent": -2.484,
    "volume": 66749185
  },
  "FLMUSDT": {
    "price": 0.0338,
    "priceChange": 0.0021,
    "priceChangePercent": 6.625,
    "volume": 507587579
  },
  "CHESSUSDT": {
    "price": 0.0734,
    "priceChange": -0.00254,
    "priceChangePercent": -3.345,
    "volume": 51843596
  },
  "STRAXUSDT": {
    "price": 1.4174,
    "priceChange": -0.1516,
    "priceChangePercent": -9.662,
    "volume": 37657105
  },
  "SONICUSDT": {
    "price": 0.1997,
    "priceChange": -0.0049,
    "priceChangePercent": -2.395,
    "volume": 33947934.3
  },
  "ERAUSDT": {
    "price": 0.8117,
    "priceChange": -0.0399,
    "priceChangePercent": -4.685,
    "volume": 18490540
  },
  "C98USDT": {
    "price": 0.0504,
    "priceChange": -0.0025,
    "priceChangePercent": -4.726,
    "volume": 173179313
  },
  "LRCUSDT": {
    "price": 0.08839,
    "priceChange": -0.00084,
    "priceChangePercent": -0.941,
    "volume": 87555486
  },
  "1000LUNCUSDT": {
    "price": 0.05889,
    "priceChange": -0.00192,
    "priceChangePercent": -3.157,
    "volume": 232195514
  },
  "VICUSDT": {
    "price": 0.2353,
    "priceChange": -0.0046,
    "priceChangePercent": -1.917,
    "volume": 19602442
  },
  "HIPPOUSDT": {
    "price": 0.001723,
    "priceChange": -0.000125,
    "priceChangePercent": -6.764,
    "volume": 4531507039
  },
  "BDXNUSDT": {
    "price": 0.04016,
    "priceChange": 0.00002,
    "priceChangePercent": 0.05,
    "volume": 52274642
  },
  "BLURUSDT": {
    "price": 0.07568,
    "priceChange": -0.0032,
    "priceChangePercent": -4.057,
    "volume": 150168136
  },
  "ACXUSDT": {
    "price": 0.1724,
    "priceChange": -0.0079,
    "priceChangePercent": -4.382,
    "volume": 13229315.2
  },
  "ARUSDT": {
    "price": 6.8,
    "priceChange": -0.299,
    "priceChangePercent": -4.212,
    "volume": 3513975.8
  },
  "MDTUSDT": {
    "price": 0.06331,
    "priceChange": 0.0045,
    "priceChangePercent": 7.652,
    "volume": 210133426
  },
  "USTCUSDT": {
    "price": 0.013474,
    "priceChange": -0.000565,
    "priceChangePercent": -4.025,
    "volume": 563131783
  },
  "MINAUSDT": {
    "price": 0.1796,
    "priceChange": -0.0061,
    "priceChangePercent": -3.285,
    "volume": 74192640
  },
  "VTHOUSDT": {
    "price": 0.001899,
    "priceChange": -0.000012,
    "priceChangePercent": -0.628,
    "volume": 2306228160
  },
  "MBOXUSDT": {
    "price": 0.06016,
    "priceChange": -0.00124,
    "priceChangePercent": -2.02,
    "volume": 62622567
  },
  "SEIUSDT": {
    "price": 0.2984,
    "priceChange": -0.0176,
    "priceChangePercent": -5.57,
    "volume": 510569462
  },
  "GLMRUSDT": {
    "price": 0.2592,
    "priceChange": -0.0095,
    "priceChangePercent": -3.536,
    "volume": 24710605
  },
  "MANTAUSDT": {
    "price": 0.2147,
    "priceChange": -0.0095,
    "priceChangePercent": -4.237,
    "volume": 66760547.7
  },
  "TOWNSUSDT": {
    "price": 0.02381,
    "priceChange": -0.00096,
    "priceChangePercent": -3.876,
    "volume": 999643608
  },
  "AVAAIUSDT": {
    "price": 0.02627,
    "priceChange": -0.00104,
    "priceChangePercent": -3.808,
    "volume": 406863615
  },
  "LAUSDT": {
    "price": 0.3253,
    "priceChange": -0.0233,
    "priceChangePercent": -6.684,
    "volume": 67026569.6
  },
  "BONDUSDT": {
    "price": 1.069,
    "priceChange": 0.011,
    "priceChangePercent": 1.04,
    "volume": 9640937.9
  },
  "DGBUSDT": {
    "price": 0.01922,
    "priceChange": 0.00305,
    "priceChangePercent": 18.862,
    "volume": 2592148978
  },
  "TRUUSDT": {
    "price": 0.03189,
    "priceChange": -0.00116,
    "priceChangePercent": -3.51,
    "volume": 164119002
  },
  "BNTUSDT": {
    "price": 0.7969,
    "priceChange": -0.02111,
    "priceChangePercent": -2.581,
    "volume": 6503808
  },
  "SANDUSDT": {
    "price": 0.28493,
    "priceChange": -0.00876,
    "priceChangePercent": -2.983,
    "volume": 155172479
  },
  "DENTUSDT": {
    "price": 0.000783,
    "priceChange": -0.000027,
    "priceChangePercent": -3.333,
    "volume": 7136950903
  },
  "CVCUSDT": {
    "price": 0.09202,
    "priceChange": -0.00233,
    "priceChangePercent": -2.47,
    "volume": 26099313
  },
  "MOCAUSDT": {
    "price": 0.06971,
    "priceChange": -0.00217,
    "priceChangePercent": -3.019,
    "volume": 51840726
  },
  "ATHUSDT": {
    "price": 0.03299,
    "priceChange": -0.00116,
    "priceChangePercent": -3.397,
    "volume": 127047526
  },
  "RAYSOLUSDT": {
    "price": 3.4484,
    "priceChange": -0.1786,
    "priceChangePercent": -4.924,
    "volume": 15828545.1
  },
  "TACUSDT": {
    "price": 0.01246,
    "priceChange": -0.00168,
    "priceChangePercent": -11.881,
    "volume": 286012588
  },
  "PROMPTUSDT": {
    "price": 0.3467,
    "priceChange": 0.0149,
    "priceChangePercent": 4.491,
    "volume": 3143928951
  },
  "MORPHOUSDT": {
    "price": 2.4393,
    "priceChange": -0.2015,
    "priceChangePercent": -7.63,
    "volume": 7879487.3
  },
  "XPLUSDT": {
    "price": 0.5538,
    "priceChange": 0.0036,
    "priceChangePercent": 0.654,
    "volume": 373826118
  },
  "TREEUSDT": {
    "price": 0.2946,
    "priceChange": -0.0209,
    "priceChangePercent": -6.624,
    "volume": 157707479
  },
  "REEFUSDT": {
    "price": 0.00088,
    "priceChange": -0.000054,
    "priceChangePercent": -5.782,
    "volume": 10510517706
  },
  "BANDUSDT": {
    "price": 0.9801,
    "priceChange": -0.1226,
    "priceChangePercent": -11.118,
    "volume": 37289144.5
  },
  "IPUSDT": {
    "price": 5.7715,
    "priceChange": -0.09837,
    "priceChangePercent": -1.676,
    "volume": 9539305.5
  },
  "1000SHIBUSDT": {
    "price": 0.012463,
    "priceChange": -0.000472,
    "priceChangePercent": -3.649,
    "volume": 18297589756
  },
  "QUICKUSDT": {
    "price": 0.02408,
    "priceChange": -0.00025,
    "priceChangePercent": -1.028,
    "volume": 151011237
  },
  "SNTUSDT": {
    "price": 0.03666,
    "priceChange": -0.00099,
    "priceChangePercent": -2.629,
    "volume": 884775062
  },
  "STOUSDT": {
    "price": 0.08755,
    "priceChange": -0.00356,
    "priceChangePercent": -3.907,
    "volume": 37181646
  },
  "PERPUSDT": {
    "price": 0.2839,
    "priceChange": -0.0059,
    "priceChangePercent": -2.036,
    "volume": 8544238.8
  },
  "SKATEUSDT": {
    "price": 0.04323,
    "priceChange": 0.00017,
    "priceChangePercent": 0.395,
    "volume": 45491385
  },
  "BMTUSDT": {
    "price": 0.06987,
    "priceChange": -0.00255,
    "priceChangePercent": -3.521,
    "volume": 62807465
  },
  "TROYUSDT": {
    "price": 0.000187,
    "priceChange": -0.000131,
    "priceChangePercent": -41.195,
    "volume": 219797446170
  },
  "GRTUSDT": {
    "price": 0.09064,
    "priceChange": -0.00167,
    "priceChangePercent": -1.809,
    "volume": 340041130
  },
  "PROMUSDT": {
    "price": 9.084,
    "priceChange": 0.173,
    "priceChangePercent": 1.941,
    "volume": 558995.3
  },
  "MILKUSDT": {
    "price": 0.04098,
    "priceChange": -0.00135,
    "priceChangePercent": -3.189,
    "volume": 39366730
  },
  "CHZUSDT": {
    "price": 0.03965,
    "priceChange": -0.00083,
    "priceChangePercent": -2.05,
    "volume": 456877360
  },
  "DOODUSDT": {
    "price": 0.0030845,
    "priceChange": -0.0001213,
    "priceChangePercent": -3.784,
    "volume": 474295068
  },
  "CTKUSDT": {
    "price": 0.3499,
    "priceChange": -0.0183,
    "priceChangePercent": -4.97,
    "volume": 31359700
  },
  "ANIMEUSDT": {
    "price": 0.01629,
    "priceChange": -0.00081,
    "priceChangePercent": -4.737,
    "volume": 658377239
  },
  "CELRUSDT": {
    "price": 0.00796,
    "priceChange": -0.00027,
    "priceChangePercent": -3.281,
    "volume": 594760084
  },
  "FIOUSDT": {
    "price": 0.0193,
    "priceChange": 0.00067,
    "priceChangePercent": 3.596,
    "volume": 152291695
  },
  "TURBOUSDT": {
    "price": 0.0040907,
    "priceChange": -0.0002424,
    "priceChangePercent": -5.594,
    "volume": 8435231031
  },
  "NEIROETHUSDT": {
    "price": 0.10748,
    "priceChange": -0.01638,
    "priceChangePercent": -13.225,
    "volume": 204301976
  },
  "1000XECUSDT": {
    "price": 0.02043,
    "priceChange": -0.00031,
    "priceChangePercent": -1.495,
    "volume": 220079229
  },
  "SHELLUSDT": {
    "price": 0.1354,
    "priceChange": -0.0067,
    "priceChangePercent": -4.715,
    "volume": 171112856
  },
  "PHAUSDT": {
    "price": 0.11593,
    "priceChange": -0.00718,
    "priceChangePercent": -5.832,
    "volume": 78826599
  },
  "BRETTUSDT": {
    "price": 0.05192,
    "priceChange": -0.00372,
    "priceChangePercent": -6.686,
    "volume": 561234210
  },
  "BANANAUSDT": {
    "price": 21.668,
    "priceChange": -1.207,
    "priceChangePercent": -5.277,
    "volume": 397527
  },
  "NULSUSDT": {
    "price": 0.0313,
    "priceChange": -0.01,
    "priceChangePercent": -24.213,
    "volume": 507648838
  },
  "SPKUSDT": {
    "price": 0.06826,
    "priceChange": -0.00152,
    "priceChangePercent": -2.178,
    "volume": 1020784355
  },
  "VVVUSDT": {
    "price": 3.05,
    "priceChange": -0.162,
    "priceChangePercent": -5.044,
    "volume": 2540052.93
  },
  "BIOUSDT": {
    "price": 0.23723,
    "priceChange": -0.03612,
    "priceChangePercent": -13.214,
    "volume": 7635037418
  },
  "FIDAUSDT": {
    "price": 0.09343,
    "priceChange": -0.00578,
    "priceChangePercent": -5.826,
    "volume": 158998515
  },
  "XCNUSDT": {
    "price": 0.0122,
    "priceChange": -0.00052,
    "priceChangePercent": -4.088,
    "volume": 519536987
  },
  "GPSUSDT": {
    "price": 0.01204,
    "priceChange": -0.0004,
    "priceChangePercent": -3.215,
    "volume": 225569371
  },
  "AVAUSDT": {
    "price": 0.5641,
    "priceChange": -0.0204,
    "priceChangePercent": -3.49,
    "volume": 3933223.4
  },
  "TSTUSDT": {
    "price": 0.02693,
    "priceChange": -0.00072,
    "priceChangePercent": -2.604,
    "volume": 192450897
  },
  "WOOUSDT": {
    "price": 0.07136,
    "priceChange": -0.00333,
    "priceChangePercent": -4.458,
    "volume": 79949005
  },
  "TAIKOUSDT": {
    "price": 0.4111,
    "priceChange": -0.0152,
    "priceChangePercent": -3.566,
    "volume": 4835634
  },
  "FUSDT": {
    "price": 0.007651,
    "priceChange": 0.000117,
    "priceChangePercent": 1.553,
    "volume": 469592921
  },
  "1000XUSDT": {
    "price": 0.05318,
    "priceChange": -0.00133,
    "priceChangePercent": -2.44,
    "volume": 20767743
  },
  "STPTUSDT": {
    "price": 0.05306,
    "priceChange": -0.00109,
    "priceChangePercent": -2.013,
    "volume": 59013495
  },
  "AIOUSDT": {
    "price": 0.07974,
    "priceChange": 0.00097,
    "priceChangePercent": 1.231,
    "volume": 245156287
  },
  "QNTUSDT": {
    "price": 105,
    "priceChange": -1.44,
    "priceChangePercent": -1.353,
    "volume": 98148.5
  },
  "HMSTRUSDT": {
    "price": 0.0007223,
    "priceChange": -0.0000287,
    "priceChangePercent": -3.822,
    "volume": 7973509645
  },
  "TIAUSDT": {
    "price": 1.7321,
    "priceChange": -0.0688,
    "priceChangePercent": -3.82,
    "volume": 97239248
  },
  "XAIUSDT": {
    "price": 0.04962,
    "priceChange": -0.00191,
    "priceChangePercent": -3.707,
    "volume": 280021803
  },
  "HIGHUSDT": {
    "price": 0.5573,
    "priceChange": -0.0134,
    "priceChangePercent": -2.348,
    "volume": 5513037.4
  },
  "LSKUSDT": {
    "price": 0.3861,
    "priceChange": -0.0082,
    "priceChangePercent": -2.08,
    "volume": 9187244
  },
  "WAVESUSDT": {
    "price": 1.3355,
    "priceChange": 0.0138,
    "priceChangePercent": 1.044,
    "volume": 55497523.7
  },
  "DAMUSDT": {
    "price": 0.04871,
    "priceChange": -0.00119,
    "priceChangePercent": -2.385,
    "volume": 613695908
  },
  "RSRUSDT": {
    "price": 0.008014,
    "priceChange": -0.000313,
    "priceChangePercent": -3.759,
    "volume": 1900656099
  },
  "TONUSDT": {
    "price": 3.2194,
    "priceChange": -0.1382,
    "priceChangePercent": -4.116,
    "volume": 33513488.4
  },
  "ASRUSDT": {
    "price": 2.884,
    "priceChange": -0.271,
    "priceChangePercent": -8.59,
    "volume": 11201570.5
  },
  "IOTAUSDT": {
    "price": 0.1965,
    "priceChange": -0.0045,
    "priceChangePercent": -2.239,
    "volume": 139766418.5
  },
  "HUSDT": {
    "price": 0.02872,
    "priceChange": -0.00053,
    "priceChangePercent": -1.812,
    "volume": 710353884
  },
  "SYNUSDT": {
    "price": 0.1361,
    "priceChange": -0.0072,
    "priceChangePercent": -5.024,
    "volume": 59292772
  },
  "APTUSDT": {
    "price": 4.4478,
    "priceChange": -0.1814,
    "priceChangePercent": -3.919,
    "volume": 36323857.4
  },
  "BICOUSDT": {
    "price": 0.1067,
    "priceChange": -0.0044,
    "priceChangePercent": -3.96,
    "volume": 38121508
  },
  "BSVUSDT": {
    "price": 27.04,
    "priceChange": -0.65,
    "priceChangePercent": -2.347,
    "volume": 534100
  },
  "PYTHUSDT": {
    "price": 0.11788,
    "priceChange": -0.00516,
    "priceChangePercent": -4.194,
    "volume": 225476116
  },
  "SWARMSUSDT": {
    "price": 0.01848,
    "priceChange": -0.00096,
    "priceChangePercent": -4.938,
    "volume": 419767290
  },
  "ONGUSDT": {
    "price": 0.21577,
    "priceChange": 0.03664,
    "priceChangePercent": 20.454,
    "volume": 369609315
  },
  "FARTCOINUSDT": {
    "price": 0.9088,
    "priceChange": -0.0232,
    "priceChangePercent": -2.489,
    "volume": 574965079.4
  },
  "BALUSDT": {
    "price": 0.829,
    "priceChange": -0.035,
    "priceChangePercent": -4.051,
    "volume": 5347440.5
  },
  "ZRXUSDT": {
    "price": 0.2477,
    "priceChange": -0.0058,
    "priceChangePercent": -2.288,
    "volume": 38873128.1
  },
  "VIDTUSDT": {
    "price": 0.00293,
    "priceChange": -0.00216,
    "priceChangePercent": -42.436,
    "volume": 31815175895
  },
  "PEOPLEUSDT": {
    "price": 0.01992,
    "priceChange": -0.00108,
    "priceChangePercent": -5.143,
    "volume": 2460309285
  },
  "BAKEUSDT": {
    "price": 0.0826,
    "priceChange": -0.0024,
    "priceChangePercent": -2.824,
    "volume": 86645330
  },
  "MLNUSDT": {
    "price": 8.539,
    "priceChange": -0.043,
    "priceChangePercent": -0.501,
    "volume": 458738.13
  },
  "INITUSDT": {
    "price": 0.3624,
    "priceChange": -0.0203,
    "priceChangePercent": -5.304,
    "volume": 48826630
  },
  "NKNUSDT": {
    "price": 0.0276,
    "priceChange": -0.00137,
    "priceChangePercent": -4.729,
    "volume": 99273198
  },
  "KERNELUSDT": {
    "price": 0.1971,
    "priceChange": -0.019,
    "priceChangePercent": -8.792,
    "volume": 144694771
  },
  "HYPEUSDT": {
    "price": 45.148,
    "priceChange": 1.165,
    "priceChangePercent": 2.649,
    "volume": 9813512.4
  },
  "ORCAUSDT": {
    "price": 2.276,
    "priceChange": -0.159,
    "priceChangePercent": -6.53,
    "volume": 5442895.9
  },
  "THETAUSDT": {
    "price": 0.8056,
    "priceChange": -0.0114,
    "priceChangePercent": -1.395,
    "volume": 39462988.1
  },
  "RVNUSDT": {
    "price": 0.01338,
    "priceChange": -0.00045,
    "priceChangePercent": -3.254,
    "volume": 935787365
  },
  "MUBARAKUSDT": {
    "price": 0.03252,
    "priceChange": -0.00165,
    "priceChangePercent": -4.829,
    "volume": 444006851
  },
  "DMCUSDT": {
    "price": 0.003883,
    "priceChange": 0.000041,
    "priceChangePercent": 1.067,
    "volume": 1406143750
  },
  "GMXUSDT": {
    "price": 15.204,
    "priceChange": -0.08,
    "priceChangePercent": -0.523,
    "volume": 402052.87
  },
  "VELVETUSDT": {
    "price": 0.05728,
    "priceChange": -0.00183,
    "priceChangePercent": -3.096,
    "volume": 49203235
  },
  "ZEREBROUSDT": {
    "price": 0.02402,
    "priceChange": -0.00124,
    "priceChangePercent": -4.909,
    "volume": 213283808
  },
  "MUSDT": {
    "price": 0.436,
    "priceChange": 0.0074,
    "priceChangePercent": 1.727,
    "volume": 122462143
  },
  "SIRENUSDT": {
    "price": 0.08793,
    "priceChange": 0.00267,
    "priceChangePercent": 3.132,
    "volume": 69862740
  },
  "TNSRUSDT": {
    "price": 0.1211,
    "priceChange": -0.0062,
    "priceChangePercent": -4.87,
    "volume": 29344073.4
  },
  "MAVUSDT": {
    "price": 0.06135,
    "priceChange": 0.00253,
    "priceChangePercent": 4.301,
    "volume": 886186811
  },
  "FXSUSDT": {
    "price": 2.698,
    "priceChange": -0.0919,
    "priceChangePercent": -3.294,
    "volume": 2425036.1
  },
  "ATAUSDT": {
    "price": 0.0474,
    "priceChange": -0.0024,
    "priceChangePercent": -4.819,
    "volume": 100578417
  },
  "HOTUSDT": {
    "price": 0.000963,
    "priceChange": -0.000019,
    "priceChangePercent": -1.935,
    "volume": 9132377623
  },
  "BNBUSDT": {
    "price": 864.01,
    "priceChange": -6.07,
    "priceChangePercent": -0.698,
    "volume": 1126448.87
  },
  "BULLAUSDT": {
    "price": 0.0682,
    "priceChange": -0.00292,
    "priceChangePercent": -4.106,
    "volume": 21939848
  },
  "MOVRUSDT": {
    "price": 6.357,
    "priceChange": -0.208,
    "priceChangePercent": -3.168,
    "volume": 425141.52
  },
  "KMNOUSDT": {
    "price": 0.05731,
    "priceChange": -0.0008,
    "priceChangePercent": -1.377,
    "volume": 272851256
  },
  "BATUSDT": {
    "price": 0.1519,
    "priceChange": -0.0045,
    "priceChangePercent": -2.877,
    "volume": 45962769.7
  },
  "SNXUSDT": {
    "price": 0.664,
    "priceChange": -0.028,
    "priceChangePercent": -4.046,
    "volume": 29358313.6
  },
  "VANAUSDT": {
    "price": 4.287,
    "priceChange": -0.096,
    "priceChangePercent": -2.19,
    "volume": 1622275.24
  },
  "WALUSDT": {
    "price": 0.4061,
    "priceChange": -0.0224,
    "priceChangePercent": -5.228,
    "volume": 19001769
  },
  "DEXEUSDT": {
    "price": 6.995,
    "priceChange": -0.075,
    "priceChangePercent": -1.061,
    "volume": 619727.9
  },
  "COWUSDT": {
    "price": 0.3625,
    "priceChange": -0.0214,
    "priceChangePercent": -5.574,
    "volume": 25447211
  },
  "JUPUSDT": {
    "price": 0.4959,
    "priceChange": -0.0171,
    "priceChangePercent": -3.333,
    "volume": 158925378
  },
  "B3USDT": {
    "price": 0.002946,
    "priceChange": -0.000104,
    "priceChangePercent": -3.41,
    "volume": 681249412
  },
  "ZILUSDT": {
    "price": 0.01163,
    "priceChange": -0.00017,
    "priceChangePercent": -1.441,
    "volume": 1631012694
  },
  "AWEUSDT": {
    "price": 0.050468,
    "priceChange": -0.000759,
    "priceChangePercent": -1.482,
    "volume": 69098413
  },
  "HFTUSDT": {
    "price": 0.08187,
    "priceChange": -0.00227,
    "priceChangePercent": -2.698,
    "volume": 147160181
  },
  "UMAUSDT": {
    "price": 1.42,
    "priceChange": -0.146,
    "priceChangePercent": -9.323,
    "volume": 20779297
  },
  "1000000MOGUSDT": {
    "price": 1.0374,
    "priceChange": -0.0761,
    "priceChangePercent": -6.834,
    "volume": 15302395.3
  },
  "USDCUSDT": {
    "price": 0.999474,
    "priceChange": -0.000367,
    "priceChangePercent": -0.037,
    "volume": 27348705
  },
  "JTOUSDT": {
    "price": 1.8894,
    "priceChange": -0.0399,
    "priceChangePercent": -2.068,
    "volume": 21795199
  },
  "FLUXUSDT": {
    "price": 0.2064,
    "priceChange": -0.0089,
    "priceChangePercent": -4.134,
    "volume": 11840746
  },
  "AERGOUSDT": {
    "price": 0.10691,
    "priceChange": -0.00359,
    "priceChangePercent": -3.249,
    "volume": 25754125
  },
  "IMXUSDT": {
    "price": 0.554,
    "priceChange": -0.0259,
    "priceChangePercent": -4.466,
    "volume": 30122496
  },
  "WUSDT": {
    "price": 0.07777,
    "priceChange": -0.00326,
    "priceChangePercent": -4.023,
    "volume": 299963709.2
  },
  "1000PEPEUSDT": {
    "price": 0.0103517,
    "priceChange": -0.0006202,
    "priceChangePercent": -5.653,
    "volume": 114275803783
  },
  "HUMAUSDT": {
    "price": 0.025525,
    "priceChange": -0.001821,
    "priceChangePercent": -6.659,
    "volume": 1124390393
  },
  "TOKENUSDT": {
    "price": 0.0132,
    "priceChange": -0.00057,
    "priceChangePercent": -4.139,
    "volume": 182769026
  },
  "MOODENGUSDT": {
    "price": 0.14554,
    "priceChange": -0.008,
    "priceChangePercent": -5.21,
    "volume": 426641797
  },
  "CGPTUSDT": {
    "price": 0.09079,
    "priceChange": -0.00508,
    "priceChangePercent": -5.299,
    "volume": 33245951
  },
  "FLOWUSDT": {
    "price": 0.392,
    "priceChange": -0.006,
    "priceChangePercent": -1.508,
    "volume": 92607140.9
  },
  "ALLUSDT": {
    "price": 1.0831,
    "priceChange": -0.0329,
    "priceChangePercent": -2.948,
    "volume": 10688403
  },
  "ORDIUSDT": {
    "price": 9.064,
    "priceChange": -0.602,
    "priceChangePercent": -6.228,
    "volume": 6448371.4
  },
  "IDUSDT": {
    "price": 0.16035,
    "priceChange": -0.00024,
    "priceChangePercent": -0.149,
    "volume": 56910525
  },
  "VETUSDT": {
    "price": 0.025612,
    "priceChange": 0.000684,
    "priceChangePercent": 2.744,
    "volume": 2782600190
  },
  "CARVUSDT": {
    "price": 0.3058,
    "priceChange": -0.0116,
    "priceChangePercent": -3.655,
    "volume": 8833527
  },
  "XLMUSDT": {
    "price": 0.39314,
    "priceChange": -0.01606,
    "priceChangePercent": -3.925,
    "volume": 449878635
  },
  "TRXUSDT": {
    "price": 0.35329,
    "priceChange": -0.01244,
    "priceChangePercent": -3.401,
    "volume": 619258621
  },
  "MEUSDT": {
    "price": 0.6839,
    "priceChange": -0.0232,
    "priceChangePercent": -3.281,
    "volume": 8458233.1
  },
  "DEFIUSDT": {
    "price": 930,
    "priceChange": 19.9,
    "priceChangePercent": 2.187,
    "volume": 5519.318
  },
  "SOLUSDT": {
    "price": 200.57,
    "priceChange": -7.35,
    "priceChangePercent": -3.535,
    "volume": 51929463.46
  },
  "ARKUSDT": {
    "price": 0.4492,
    "priceChange": -0.0224,
    "priceChangePercent": -4.75,
    "volume": 12031989
  },
  "AEVOUSDT": {
    "price": 0.09646,
    "priceChange": -0.00504,
    "priceChangePercent": -4.966,
    "volume": 131354970.9
  },
  "KLAYUSDT": {
    "price": 0.1247,
    "priceChange": -0.006,
    "priceChangePercent": -4.591,
    "volume": 86182707.7
  },
  "ZORAUSDT": {
    "price": 0.11057,
    "priceChange": -0.00334,
    "priceChangePercent": -2.932,
    "volume": 1312087874
  },
  "SCRTUSDT": {
    "price": 0.1785,
    "priceChange": -0.0079,
    "priceChangePercent": -4.238,
    "volume": 7013480
  },
  "LAYERUSDT": {
    "price": 0.5464,
    "priceChange": -0.0257,
    "priceChangePercent": -4.492,
    "volume": 27207064.1
  },
  "BANKUSDT": {
    "price": 0.06542,
    "priceChange": -0.001647,
    "priceChangePercent": -2.456,
    "volume": 115201387
  },
  "VINEUSDT": {
    "price": 0.06677,
    "priceChange": -0.00253,
    "priceChangePercent": -3.651,
    "volume": 697635557
  },
  "XVGUSDT": {
    "price": 0.0060605,
    "priceChange": -0.0002579,
    "priceChangePercent": -4.082,
    "volume": 799049302
  },
  "OGNUSDT": {
    "price": 0.0782,
    "priceChange": 0.0082,
    "priceChangePercent": 11.714,
    "volume": 498575442
  },
  "CHILLGUYUSDT": {
    "price": 0.04291,
    "priceChange": -0.00377,
    "priceChangePercent": -8.076,
    "volume": 313699887
  },
  "YALAUSDT": {
    "price": 0.1563,
    "priceChange": 0.0023,
    "priceChangePercent": 1.494,
    "volume": 123220499
  },
  "OCEANUSDT": {
    "price": 0.707,
    "priceChange": 0.1126,
    "priceChangePercent": 18.943,
    "volume": 102001641
  },
  "BANUSDT": {
    "price": 0.08757,
    "priceChange": -0.00147,
    "priceChangePercent": -1.651,
    "volume": 128941017
  },
  "ONDOUSDT": {
    "price": 0.9341,
    "priceChange": -0.0486,
    "priceChangePercent": -4.946,
    "volume": 207578741
  },
  "USELESSUSDT": {
    "price": 0.2415,
    "priceChange": -0.0384,
    "priceChangePercent": -13.719,
    "volume": 188097301
  },
  "STGUSDT": {
    "price": 0.1713,
    "priceChange": -0.0092,
    "priceChangePercent": -5.097,
    "volume": 77462100
  },
  "FETUSDT": {
    "price": 0.6531,
    "priceChange": -0.0234,
    "priceChangePercent": -3.459,
    "volume": 137597666
  },
  "UXLINKUSDT": {
    "price": 0.3121,
    "priceChange": -0.0069,
    "priceChangePercent": -2.163,
    "volume": 19099088
  },
  "RUNEUSDT": {
    "price": 1.289,
    "priceChange": -0.04,
    "priceChangePercent": -3.01,
    "volume": 17597341
  },
  "VELODROMEUSDT": {
    "price": 0.05164,
    "priceChange": -0.00271,
    "priceChangePercent": -4.986,
    "volume": 43741277
  },
  "ALPACAUSDT": {
    "price": 1.19,
    "priceChange": 0.94775,
    "priceChangePercent": 391.228,
    "volume": 11619631791
  },
  "VOXELUSDT": {
    "price": 0.05585,
    "priceChange": -0.00274,
    "priceChangePercent": -4.677,
    "volume": 37142993
  },
  "KNCUSDT": {
    "price": 0.3894,
    "priceChange": -0.0148,
    "priceChangePercent": -3.662,
    "volume": 17038683
  },
  "PUMPUSDT": {
    "price": 0.002785,
    "priceChange": -0.000218,
    "priceChangePercent": -7.259,
    "volume": 87426025509
  },
  "MELANIAUSDT": {
    "price": 0.1907,
    "priceChange": -0.0121,
    "priceChangePercent": -5.966,
    "volume": 80849767.78
  },
  "SLPUSDT": {
    "price": 0.001757,
    "priceChange": -0.000068,
    "priceChangePercent": -3.726,
    "volume": 1230764964
  },
  "CROSSUSDT": {
    "price": 0.22108,
    "priceChange": -0.00224,
    "priceChangePercent": -1.003,
    "volume": 26758659
  },
  "KAVAUSDT": {
    "price": 0.376,
    "priceChange": 0.0058,
    "priceChangePercent": 1.567,
    "volume": 42859662
  },
  "API3USDT": {
    "price": 1.2857,
    "priceChange": -0.1011,
    "priceChangePercent": -7.29,
    "volume": 72673139.4
  },
  "STRKUSDT": {
    "price": 0.1331,
    "priceChange": -0.0046,
    "priceChangePercent": -3.341,
    "volume": 307840575.6
  },
  "OMGUSDT": {
    "price": 0.291,
    "priceChange": -0.0006,
    "priceChangePercent": -0.206,
    "volume": 37091998.9
  },
  "TANSSIUSDT": {
    "price": 0.04265,
    "priceChange": -0.00079,
    "priceChangePercent": -1.819,
    "volume": 68593471
  },
  "TRBUSDT": {
    "price": 34.904,
    "priceChange": -1.579,
    "priceChangePercent": -4.328,
    "volume": 1116256.4
  },
  "GRASSUSDT": {
    "price": 0.7586,
    "priceChange": -0.0314,
    "priceChangePercent": -3.975,
    "volume": 18855849.9
  },
  "DYDXUSDT": {
    "price": 0.641,
    "priceChange": -0.035,
    "priceChangePercent": -5.178,
    "volume": 59864181.3
  },
  "NEARUSDT": {
    "price": 2.531,
    "priceChange": -0.113,
    "priceChangePercent": -4.274,
    "volume": 79260572
  },
  "SUPERUSDT": {
    "price": 0.6214,
    "priceChange": -0.0278,
    "priceChangePercent": -4.282,
    "volume": 11753804
  },
  "BTCUSDT": {
    "price": 111725,
    "priceChange": -3067.5,
    "priceChangePercent": -2.672,
    "volume": 167918.95
  },
  "ICNTUSDT": {
    "price": 0.2899,
    "priceChange": -0.0084,
    "priceChangePercent": -2.816,
    "volume": 29278507
  },
  "STMXUSDT": {
    "price": 0.00388,
    "priceChange": 0.0001,
    "priceChangePercent": 2.646,
    "volume": 1126222157
  },
  "ENAUSDT": {
    "price": 0.6514,
    "priceChange": -0.0574,
    "priceChangePercent": -8.098,
    "volume": 1486469166
  },
  "DEGOUSDT": {
    "price": 1.2568,
    "priceChange": -0.0449,
    "priceChangePercent": -3.449,
    "volume": 2692571.7
  },
  "LISTAUSDT": {
    "price": 0.2822,
    "priceChange": -0.0138,
    "priceChangePercent": -4.662,
    "volume": 40384071
  },
  "SXPUSDT": {
    "price": 0.1798,
    "priceChange": -0.0026,
    "priceChangePercent": -1.425,
    "volume": 32230914.4
  },
  "HIFIUSDT": {
    "price": 0.09292,
    "priceChange": -0.00151,
    "priceChangePercent": -1.599,
    "volume": 45902423
  },
  "HEIUSDT": {
    "price": 0.4678,
    "priceChange": 0.0057,
    "priceChangePercent": 1.233,
    "volume": 11134182.1
  },
  "KDAUSDT": {
    "price": 0.3708,
    "priceChange": -0.0217,
    "priceChangePercent": -5.529,
    "volume": 16427111
  },
  "NAORISUSDT": {
    "price": 0.02437,
    "priceChange": -0.00186,
    "priceChangePercent": -7.091,
    "volume": 157001211
  },
  "NMRUSDT": {
    "price": 8.253,
    "priceChange": -0.463,
    "priceChangePercent": -5.312,
    "volume": 697942
  },
  "ARBUSDT": {
    "price": 0.5535,
    "priceChange": -0.0258,
    "priceChangePercent": -4.454,
    "volume": 898179847
  },
  "GUSDT": {
    "price": 0.01149,
    "priceChange": -0.00033,
    "priceChangePercent": -2.792,
    "volume": 238347981
  },
  "INUSDT": {
    "price": 0.07165,
    "priceChange": 0.00132,
    "priceChangePercent": 1.877,
    "volume": 179116800
  },
  "REDUSDT": {
    "price": 0.3896,
    "priceChange": -0.014,
    "priceChangePercent": -3.469,
    "volume": 14451764
  },
  "EPICUSDT": {
    "price": 2.4899,
    "priceChange": -0.1645,
    "priceChangePercent": -6.197,
    "volume": 7333087.2
  },
  "AXLUSDT": {
    "price": 0.3056,
    "priceChange": -0.0109,
    "priceChangePercent": -3.444,
    "volume": 31567146.3
  },
  "NEIROUSDT": {
    "price": 0.0003664,
    "priceChange": -0.0000225,
    "priceChangePercent": -5.786,
    "volume": 242510357655
  },
  "1000BONKUSDT": {
    "price": 0.021397,
    "priceChange": -0.001144,
    "priceChangePercent": -5.075,
    "volume": 12901512825
  },
  "PLAYUSDT": {
    "price": 0.04602,
    "priceChange": -0.00887,
    "priceChangePercent": -16.16,
    "volume": 267839261
  },
  "ZECUSDT": {
    "price": 41.91,
    "priceChange": -0.74,
    "priceChangePercent": -1.735,
    "volume": 291846.359
  },
  "CTSIUSDT": {
    "price": 0.0764,
    "priceChange": -0.0015,
    "priceChangePercent": -1.926,
    "volume": 138730603
  },
  "ATOMUSDT": {
    "price": 4.579,
    "priceChange": -0.164,
    "priceChangePercent": -3.458,
    "volume": 19994985.06
  },
  "CELOUSDT": {
    "price": 0.326,
    "priceChange": -0.009,
    "priceChangePercent": -2.687,
    "volume": 71950135.9
  },
  "LQTYUSDT": {
    "price": 0.8756,
    "priceChange": -0.0321,
    "priceChangePercent": -3.536,
    "volume": 18892774.5
  },
  "ESPORTSUSDT": {
    "price": 0.08595,
    "priceChange": -0.00325,
    "priceChangePercent": -3.643,
    "volume": 55408877
  },
  "GASUSDT": {
    "price": 3.724,
    "priceChange": 0.268,
    "priceChangePercent": 7.755,
    "volume": 15406937.5
  },
  "BIGTIMEUSDT": {
    "price": 0.05372,
    "priceChange": -0.0018,
    "priceChangePercent": -3.242,
    "volume": 133511975
  },
  "GOATUSDT": {
    "price": 0.08763,
    "priceChange": -0.00596,
    "priceChangePercent": -6.368,
    "volume": 246646797
  },
  "RENDERUSDT": {
    "price": 3.594,
    "priceChange": -0.129,
    "priceChangePercent": -3.465,
    "volume": 14150784.5
  },
  "BEAMXUSDT": {
    "price": 0.007313,
    "priceChange": -0.000325,
    "priceChangePercent": -4.255,
    "volume": 1521120942
  },
  "DODOXUSDT": {
    "price": 0.045329,
    "priceChange": -0.002137,
    "priceChangePercent": -4.502,
    "volume": 33345168
  },
  "NTRNUSDT": {
    "price": 0.1013,
    "priceChange": 0.00491,
    "priceChangePercent": 5.094,
    "volume": 326598880
  },
  "IDEXUSDT": {
    "price": 0.0561,
    "priceChange": -0.00147,
    "priceChangePercent": -2.553,
    "volume": 38796958
  },
  "RENUSDT": {
    "price": 0.048,
    "priceChange": 0.00192,
    "priceChangePercent": 4.167,
    "volume": 1125378544
  },
  "LEVERUSDT": {
    "price": 0.0001403,
    "priceChange": -0.000004,
    "priceChangePercent": -2.772,
    "volume": 26905989316
  },
  "ADAUSDT": {
    "price": 0.8745,
    "priceChange": -0.0317,
    "priceChangePercent": -3.498,
    "volume": 1835272928
  },
  "JSTUSDT": {
    "price": 0.036271,
    "priceChange": 0.001679,
    "priceChangePercent": 4.854,
    "volume": 262879530
  },
  "1000WHYUSDT": {
    "price": 0.0000306,
    "priceChange": -0.0000011,
    "priceChangePercent": -3.47,
    "volume": 50746904218
  },
  "XTZUSDT": {
    "price": 0.804,
    "priceChange": -0.028,
    "priceChangePercent": -3.365,
    "volume": 24082784.3
  },
  "DYMUSDT": {
    "price": 0.2299,
    "priceChange": -0.0134,
    "priceChangePercent": -5.508,
    "volume": 30729014.8
  },
  "JASMYUSDT": {
    "price": 0.0153,
    "priceChange": -0.000708,
    "priceChangePercent": -4.423,
    "volume": 1064731510
  },
  "TAOUSDT": {
    "price": 343.67,
    "priceChange": -12.4,
    "priceChangePercent": -3.482,
    "volume": 424537.381
  },
  "ACTUSDT": {
    "price": 0.04043,
    "priceChange": -0.00257,
    "priceChangePercent": -5.977,
    "volume": 373737987
  },
  "1MBABYDOGEUSDT": {
    "price": 0.0012445,
    "priceChange": -0.0000555,
    "priceChangePercent": -4.269,
    "volume": 8891288773
  },
  "COTIUSDT": {
    "price": 0.05324,
    "priceChange": -0.00075,
    "priceChangePercent": -1.389,
    "volume": 140916025
  },
  "USUALUSDT": {
    "price": 0.0683,
    "priceChange": -0.00532,
    "priceChangePercent": -7.226,
    "volume": 417718728
  },
  "ARKMUSDT": {
    "price": 0.5166,
    "priceChange": -0.0214,
    "priceChangePercent": -3.978,
    "volume": 68823398
  },
  "A2ZUSDT": {
    "price": 0.005242,
    "priceChange": -0.00023,
    "priceChangePercent": -4.203,
    "volume": 2184217867
  },
  "LTCUSDT": {
    "price": 112.75,
    "priceChange": -7.11,
    "priceChangePercent": -5.932,
    "volume": 4402579.814
  },
  "MYXUSDT": {
    "price": 1.1582,
    "priceChange": 0.1089,
    "priceChangePercent": 10.378,
    "volume": 128963903
  },
  "XVSUSDT": {
    "price": 6.359,
    "priceChange": -0.188,
    "priceChangePercent": -2.872,
    "volume": 373263.9
  },
  "DOTUSDT": {
    "price": 3.931,
    "priceChange": -0.176,
    "priceChangePercent": -4.285,
    "volume": 83077381.5
  },
  "SPELLUSDT": {
    "price": 0.0005279,
    "priceChange": 0.0000031,
    "priceChangePercent": 0.591,
    "volume": 115295347197
  },
  "HBARUSDT": {
    "price": 0.23973,
    "priceChange": -0.00803,
    "priceChangePercent": -3.241,
    "volume": 876931678
  },
  "BROCCOLI714USDT": {
    "price": 0.02519,
    "priceChange": -0.00123,
    "priceChangePercent": -4.656,
    "volume": 144289437
  },
  "NFPUSDT": {
    "price": 0.06536,
    "priceChange": -0.00293,
    "priceChangePercent": -4.291,
    "volume": 42275934.6
  },
  "PONKEUSDT": {
    "price": 0.10705,
    "priceChange": -0.0016,
    "priceChangePercent": -1.473,
    "volume": 44378787
  },
  "1000CATUSDT": {
    "price": 0.008065,
    "priceChange": -0.000468,
    "priceChangePercent": -5.485,
    "volume": 1940935036
  },
  "IOSTUSDT": {
    "price": 0.003974,
    "priceChange": 0.000417,
    "priceChangePercent": 11.723,
    "volume": 13155824722
  },
  "RPLUSDT": {
    "price": 7.405,
    "priceChange": -0.308,
    "priceChangePercent": -3.993,
    "volume": 697014
  },
  "ETCUSDT": {
    "price": 22.181,
    "priceChange": -1.262,
    "priceChangePercent": -5.383,
    "volume": 12331626.3
  },
  "CHRUSDT": {
    "price": 0.1011,
    "priceChange": 0.0012,
    "priceChangePercent": 1.201,
    "volume": 73197130
  },
  "AIOTUSDT": {
    "price": 1.6642,
    "priceChange": 0.07404,
    "priceChangePercent": 4.656,
    "volume": 40770764
  },
  "AUCTIONUSDT": {
    "price": 9.889,
    "priceChange": -0.585,
    "priceChangePercent": -5.585,
    "volume": 2752978.06
  },
  "PAXGUSDT": {
    "price": 3352.63,
    "priceChange": -4.28,
    "priceChangePercent": -0.127,
    "volume": 4689.589
  },
  "SSVUSDT": {
    "price": 9.121,
    "priceChange": -0.646,
    "priceChangePercent": -6.614,
    "volume": 2374698.44
  },
  "RADUSDT": {
    "price": 1.6874,
    "priceChange": -0.0367,
    "priceChangePercent": -2.129,
    "volume": 3528280
  },
  "RLCUSDT": {
    "price": 0.9892,
    "priceChange": -0.0354,
    "priceChangePercent": -3.455,
    "volume": 5256952.1
  },
  "STEEMUSDT": {
    "price": 0.13805,
    "priceChange": 0.00437,
    "priceChangePercent": 3.269,
    "volume": 35387529
  },
  "MTLUSDT": {
    "price": 0.738,
    "priceChange": -0.0088,
    "priceChangePercent": -1.178,
    "volume": 4446134
  },
  "OXTUSDT": {
    "price": 0.05463,
    "priceChange": -0.00135,
    "priceChangePercent": -2.412,
    "volume": 52733198
  },
  "MEMEUSDT": {
    "price": 0.003666,
    "priceChange": 0.00008,
    "priceChangePercent": 2.231,
    "volume": 162804221772
  },
  "HOOKUSDT": {
    "price": 0.107,
    "priceChange": -0.0065,
    "priceChangePercent": -5.727,
    "volume": 316829372.5
  },
  "GALAUSDT": {
    "price": 0.01722,
    "priceChange": -0.00056,
    "priceChangePercent": -3.15,
    "volume": 6424892625
  },
  "EGLDUSDT": {
    "price": 15.009,
    "priceChange": -0.53,
    "priceChangePercent": -3.411,
    "volume": 1058602
  },
  "HAEDALUSDT": {
    "price": 0.133362,
    "priceChange": -0.012687,
    "priceChangePercent": -8.687,
    "volume": 407234148
  },
  "PORT3USDT": {
    "price": 0.03635,
    "priceChange": -0.00081,
    "priceChangePercent": -2.18,
    "volume": 34320283
  },
  "PUMPBTCUSDT": {
    "price": 0.04044,
    "priceChange": -0.00044,
    "priceChangePercent": -1.076,
    "volume": 128147320
  },
  "FORTHUSDT": {
    "price": 2.938,
    "priceChange": -0.025,
    "priceChangePercent": -0.844,
    "volume": 3453828.5
  },
  "ZETAUSDT": {
    "price": 0.1883,
    "priceChange": -0.0059,
    "priceChangePercent": -3.038,
    "volume": 36443029
  },
  "STORJUSDT": {
    "price": 0.2637,
    "priceChange": -0.0016,
    "priceChangePercent": -0.603,
    "volume": 20955705
  },
  "SYRUPUSDT": {
    "price": 0.41885,
    "priceChange": -0.03558,
    "priceChangePercent": -7.83,
    "volume": 91820119
  },
  "TUSDT": {
    "price": 0.0167,
    "priceChange": 0.0001,
    "priceChangePercent": 0.602,
    "volume": 654220782
  },
  "BOMEUSDT": {
    "price": 0.002231,
    "priceChange": 0.000008,
    "priceChangePercent": 0.36,
    "volume": 78917099460
  },
  "MERLUSDT": {
    "price": 0.12161,
    "priceChange": -0.00617,
    "priceChangePercent": -4.829,
    "volume": 42752357
  },
  "SUIUSDT": {
    "price": 3.4937,
    "priceChange": -0.1919,
    "priceChangePercent": -5.207,
    "volume": 314352158.1
  },
  "TAGUSDT": {
    "price": 0.0008543,
    "priceChange": 0.0000057,
    "priceChangePercent": 0.672,
    "volume": 6518953673
  },
  "ALPINEUSDT": {
    "price": 1.8266,
    "priceChange": -0.0002,
    "priceChangePercent": -0.011,
    "volume": 5862752.6
  },
  "GMTUSDT": {
    "price": 0.0408,
    "priceChange": -0.00145,
    "priceChangePercent": -3.432,
    "volume": 422727548
  },
  "TAUSDT": {
    "price": 0.04775,
    "priceChange": -0.00012,
    "priceChangePercent": -0.251,
    "volume": 259572618
  },
  "MEWUSDT": {
    "price": 0.002909,
    "priceChange": -0.000182,
    "priceChangePercent": -5.888,
    "volume": 3659154026
  },
  "SAPIENUSDT": {
    "price": 0.2137,
    "priceChange": -0.04676,
    "priceChangePercent": -17.953,
    "volume": 442767166
  },
  "BROCCOLIF3BUSDT": {
    "price": 0.010491,
    "priceChange": -0.000628,
    "priceChangePercent": -5.648,
    "volume": 207883085
  },
  "SKYAIUSDT": {
    "price": 0.04152,
    "priceChange": -0.00055,
    "priceChangePercent": -1.307,
    "volume": 235031503
  },
  "EPTUSDT": {
    "price": 0.005059,
    "priceChange": 0.00063,
    "priceChangePercent": 14.224,
    "volume": 11666170030
  },
  "ZRCUSDT": {
    "price": 0.02816,
    "priceChange": -0.00182,
    "priceChangePercent": -6.071,
    "volume": 172120978
  },
  "ROSEUSDT": {
    "price": 0.02582,
    "priceChange": -0.0014,
    "priceChangePercent": -5.143,
    "volume": 547660619
  },
  "AIUSDT": {
    "price": 0.12231,
    "priceChange": -0.00281,
    "priceChangePercent": -2.246,
    "volume": 111095966
  },
  "CUSDT": {
    "price": 0.1901,
    "priceChange": -0.01512,
    "priceChangePercent": -7.368,
    "volume": 115263816
  },
  "SKLUSDT": {
    "price": 0.03063,
    "priceChange": -0.0023,
    "priceChangePercent": -6.985,
    "volume": 1455774828
  },
  "SXTUSDT": {
    "price": 0.07368,
    "priceChange": -0.00337,
    "priceChangePercent": -4.374,
    "volume": 125542330
  },
  "AI16ZUSDT": {
    "price": 0.1162,
    "priceChange": -0.0084,
    "priceChangePercent": -6.742,
    "volume": 343597741.5
  },
  "PENGUUSDT": {
    "price": 0.031934,
    "priceChange": -0.003301,
    "priceChangePercent": -9.369,
    "volume": 12858818871
  },
  "ALTUSDT": {
    "price": 0.03403,
    "priceChange": -0.00175,
    "priceChangePercent": -4.891,
    "volume": 537373091
  },
  "BERAUSDT": {
    "price": 2.308,
    "priceChange": -0.213,
    "priceChangePercent": -8.449,
    "volume": 23518077
  },
  "KAIAUSDT": {
    "price": 0.1436,
    "priceChange": -0.0046,
    "priceChangePercent": -3.104,
    "volume": 94320670
  },
  "DUSKUSDT": {
    "price": 0.06527,
    "priceChange": -0.00308,
    "priceChangePercent": -4.506,
    "volume": 57382808
  },
  "CAKEUSDT": {
    "price": 2.644,
    "priceChange": -0.0613,
    "priceChangePercent": -2.266,
    "volume": 10700455
  },
  "ONEUSDT": {
    "price": 0.01097,
    "priceChange": 0.00002,
    "priceChangePercent": 0.183,
    "volume": 1271019370
  },
  "DRIFTUSDT": {
    "price": 0.5461,
    "priceChange": -0.0239,
    "priceChangePercent": -4.193,
    "volume": 13993494
  },
  "POWRUSDT": {
    "price": 0.1647,
    "priceChange": -0.001,
    "priceChangePercent": -0.604,
    "volume": 26495886
  },
  "SOPHUSDT": {
    "price": 0.03211,
    "priceChange": -0.001205,
    "priceChangePercent": -3.617,
    "volume": 310892361
  },
  "SUSDT": {
    "price": 0.3235,
    "priceChange": -0.0122,
    "priceChangePercent": -3.634,
    "volume": 189767304
  },
  "BADGERUSDT": {
    "price": 0.8358,
    "priceChange": -0.0269,
    "priceChangePercent": -3.118,
    "volume": 6732174
  },
  "GLMUSDT": {
    "price": 0.24457,
    "priceChange": -0.00251,
    "priceChangePercent": -1.016,
    "volume": 20542553
  },
  "SPXUSDT": {
    "price": 1.2549,
    "priceChange": -0.0559,
    "priceChangePercent": -4.265,
    "volume": 57297841
  },
  "MEMEFIUSDT": {
    "price": 0.002201,
    "priceChange": -0.000965,
    "priceChangePercent": -30.48,
    "volume": 28358933689
  },
  "ZENUSDT": {
    "price": 7.9,
    "priceChange": -0.436,
    "priceChangePercent": -5.23,
    "volume": 1803194
  },
  "AVAXUSDT": {
    "price": 24.383,
    "priceChange": -1.163,
    "priceChangePercent": -4.553,
    "volume": 32054971
  },
  "IOTXUSDT": {
    "price": 0.02763,
    "priceChange": -0.00074,
    "priceChangePercent": -2.608,
    "volume": 200715599
  },
  "METISUSDT": {
    "price": 16.45,
    "priceChange": -0.96,
    "priceChangePercent": -5.514,
    "volume": 485299.88
  },
  "1000FLOKIUSDT": {
    "price": 0.0994,
    "priceChange": -0.00394,
    "priceChangePercent": -3.813,
    "volume": 834311954
  },
  "BANANAS31USDT": {
    "price": 0.00681,
    "priceChange": -0.000171,
    "priceChangePercent": -2.45,
    "volume": 1711961823
  },
  "ONTUSDT": {
    "price": 0.2106,
    "priceChange": 0.0714,
    "priceChangePercent": 51.293,
    "volume": 1903325032.9
  },
  "SANTOSUSDT": {
    "price": 2.123,
    "priceChange": -0.072,
    "priceChangePercent": -3.28,
    "volume": 4159455.7
  },
  "INJUSDT": {
    "price": 13.608,
    "priceChange": -0.701,
    "priceChangePercent": -4.899,
    "volume": 10439271.6
  },
  "RONINUSDT": {
    "price": 0.5388,
    "priceChange": -0.0181,
    "priceChangePercent": -3.25,
    "volume": 6327360.3
  },
  "AMBUSDT": {
    "price": 0.001188,
    "priceChange": -0.000619,
    "priceChangePercent": -34.256,
    "volume": 34735751444
  },
  "POLUSDT": {
    "price": 0.24304,
    "priceChange": -0.00382,
    "priceChangePercent": -1.547,
    "volume": 256478287
  },
  "1000000BOBUSDT": {
    "price": 0.06452,
    "priceChange": -0.00157,
    "priceChangePercent": -2.376,
    "volume": 36356118
  },
  "MOVEUSDT": {
    "price": 0.1238,
    "priceChange": -0.0058,
    "priceChangePercent": -4.475,
    "volume": 154771742
  },
  "GUNUSDT": {
    "price": 0.02458,
    "priceChange": -0.00183,
    "priceChangePercent": -6.929,
    "volume": 251238410
  },
  "NOTUSDT": {
    "price": 0.00185,
    "priceChange": -0.000078,
    "priceChangePercent": -4.046,
    "volume": 19147565312
  },
  "MANAUSDT": {
    "price": 0.2871,
    "priceChange": -0.0088,
    "priceChangePercent": -2.974,
    "volume": 101327606
  },
  "CVXUSDT": {
    "price": 4.061,
    "priceChange": -0.132,
    "priceChangePercent": -3.148,
    "volume": 2957488.2
  },
  "AAVEUSDT": {
    "price": 330.04,
    "priceChange": -21.51,
    "priceChangePercent": -6.119,
    "volume": 1290941.9
  },
  "1000CHEEMSUSDT": {
    "price": 0.0012067,
    "priceChange": -0.000067,
    "priceChangePercent": -5.26,
    "volume": 2834647577
  },
  "BABYUSDT": {
    "price": 0.0489,
    "priceChange": -0.00394,
    "priceChangePercent": -7.456,
    "volume": 221120865
  },
  "LOOMUSDT": {
    "price": 0.08112,
    "priceChange": 0.0043,
    "priceChangePercent": 5.598,
    "volume": 185311681
  },
  "AKTUSDT": {
    "price": 1.165,
    "priceChange": -0.03,
    "priceChangePercent": -2.51,
    "volume": 3225911.9
  },
  "OGUSDT": {
    "price": 13.186,
    "priceChange": -0.214,
    "priceChangePercent": -1.597,
    "volume": 1450092.3
  },
  "ARPAUSDT": {
    "price": 0.02195,
    "priceChange": -0.0007,
    "priceChangePercent": -3.091,
    "volume": 223515947
  },
  "KOMAUSDT": {
    "price": 0.02247,
    "priceChange": 0.00009,
    "priceChangePercent": 0.402,
    "volume": 150720110
  },
  "SQDUSDT": {
    "price": 0.10978,
    "priceChange": -0.00454,
    "priceChangePercent": -3.971,
    "volume": 20912317
  },
  "MAVIAUSDT": {
    "price": 0.1616,
    "priceChange": -0.0052,
    "priceChangePercent": -3.118,
    "volume": 10957310
  },
  "LUMIAUSDT": {
    "price": 0.2979,
    "priceChange": -0.0166,
    "priceChangePercent": -5.278,
    "volume": 15695753.1
  },
  "ALGOUSDT": {
    "price": 0.2562,
    "priceChange": -0.0018,
    "priceChangePercent": -0.698,
    "volume": 442905123.5
  },
  "LINKUSDT": {
    "price": 25.129,
    "priceChange": -0.613,
    "priceChangePercent": -2.381,
    "volume": 49113496.99
  },
  "PHBUSDT": {
    "price": 0.6008,
    "priceChange": 0.0285,
    "priceChangePercent": 4.98,
    "volume": 26777707
  },
  "KAITOUSDT": {
    "price": 1.0715,
    "priceChange": -0.0427,
    "priceChangePercent": -3.832,
    "volume": 22634725.4
  },
  "ETHWUSDT": {
    "price": 1.7169,
    "priceChange": -0.0895,
    "priceChangePercent": -4.955,
    "volume": 6196310
  },
  "LPTUSDT": {
    "price": 6.35,
    "priceChange": -0.252,
    "priceChangePercent": -3.817,
    "volume": 2808682.5
  },
  "SIGNUSDT": {
    "price": 0.07063,
    "priceChange": -0.00115,
    "priceChangePercent": -1.602,
    "volume": 65872914
  },
  "YFIUSDT": {
    "price": 5581,
    "priceChange": -220,
    "priceChangePercent": -3.792,
    "volume": 1279.481
  },
  "PUNDIXUSDT": {
    "price": 0.3004,
    "priceChange": -0.0013,
    "priceChangePercent": -0.431,
    "volume": 13074045
  },
  "SAHARAUSDT": {
    "price": 0.08605,
    "priceChange": -0.00153,
    "priceChangePercent": -1.747,
    "volume": 470499822
  },
  "EDUUSDT": {
    "price": 0.1344,
    "priceChange": -0.0058,
    "priceChangePercent": -4.137,
    "volume": 166870438
  },
  "APEUSDT": {
    "price": 0.5931,
    "priceChange": -0.0246,
    "priceChangePercent": -3.983,
    "volume": 46731664
  },
  "WLFIUSDT": {
    "price": 0.2233,
    "priceChange": -0.026,
    "priceChangePercent": -10.429,
    "volume": 3490916200
  },
  "REZUSDT": {
    "price": 0.0129,
    "priceChange": -0.00097,
    "priceChangePercent": -6.994,
    "volume": 804166157
  },
  "DFUSDT": {
    "price": 0.02883,
    "priceChange": -0.00161,
    "priceChangePercent": -5.289,
    "volume": 70726346
  },
  "SUNUSDT": {
    "price": 0.024394,
    "priceChange": -0.000414,
    "priceChangePercent": -1.669,
    "volume": 237965233
  },
  "RDNTUSDT": {
    "price": 0.02133,
    "priceChange": -0.001,
    "priceChangePercent": -4.478,
    "volume": 319103535
  },
  "ARCUSDT": {
    "price": 0.01936,
    "priceChange": -0.00111,
    "priceChangePercent": -5.423,
    "volume": 576676237
  },
  "BRUSDT": {
    "price": 0.07374,
    "priceChange": -0.00388,
    "priceChangePercent": -4.999,
    "volume": 657795990
  },
  "MAGICUSDT": {
    "price": 0.2134,
    "priceChange": -0.0158,
    "priceChangePercent": -6.894,
    "volume": 178659346.7
  },
  "ASTRUSDT": {
    "price": 0.025319,
    "priceChange": -0.001134,
    "priceChangePercent": -4.287,
    "volume": 194412984
  },
  "QTUMUSDT": {
    "price": 3.024,
    "priceChange": 0.505,
    "priceChangePercent": 20.048,
    "volume": 157107648.7
  },
  "SAFEUSDT": {
    "price": 0.4241,
    "priceChange": -0.0115,
    "priceChangePercent": -2.64,
    "volume": 5362385
  },
  "DEEPUSDT": {
    "price": 0.14182,
    "priceChange": -0.00947,
    "priceChangePercent": -6.26,
    "volume": 42876902
  },
  "COMBOUSDT": {
    "price": 0.0695,
    "priceChange": -0.0069,
    "priceChangePercent": -9.031,
    "volume": 298435414.3
  },
  "XMRUSDT": {
    "price": 274.03,
    "priceChange": 5.94,
    "priceChangePercent": 2.216,
    "volume": 128338.564
  },
  "IDOLUSDT": {
    "price": 0.01207,
    "priceChange": -0.0011,
    "priceChangePercent": -8.352,
    "volume": 402052930
  },
  "RESOLVUSDT": {
    "price": 0.14761,
    "priceChange": -0.00704,
    "priceChangePercent": -4.552,
    "volume": 104149163
  },
  "COSUSDT": {
    "price": 0.003435,
    "priceChange": -0.000086,
    "priceChangePercent": -2.442,
    "volume": 501675064
  },
  "KEYUSDT": {
    "price": 0.0025177,
    "priceChange": 0.0002102,
    "priceChangePercent": 9.109,
    "volume": 7324548969
  },
  "ENSUSDT": {
    "price": 24.895,
    "priceChange": -1.441,
    "priceChangePercent": -5.472,
    "volume": 3216123.2
  },
  "ALICEUSDT": {
    "price": 0.385,
    "priceChange": -0.014,
    "priceChangePercent": -3.509,
    "volume": 32268745.4
  },
  "TLMUSDT": {
    "price": 0.004808,
    "priceChange": -0.000145,
    "priceChangePercent": -2.928,
    "volume": 1019570660
  },
  "GTCUSDT": {
    "price": 0.335,
    "priceChange": -0.005,
    "priceChangePercent": -1.471,
    "volume": 59562235.2
  },
  "OPUSDT": {
    "price": 0.7441,
    "priceChange": -0.0398,
    "priceChangePercent": -5.077,
    "volume": 271939503.9
  },
  "LUNA2USDT": {
    "price": 0.1532,
    "priceChange": -0.0042,
    "priceChangePercent": -2.668,
    "volume": 39668275
  },
  "KASUSDT": {
    "price": 0.08665,
    "priceChange": -0.00229,
    "priceChangePercent": -2.575,
    "volume": 242255901
  },
  "1000RATSUSDT": {
    "price": 0.01794,
    "priceChange": -0.00124,
    "priceChangePercent": -6.465,
    "volume": 478186435
  },
  "HOMEUSDT": {
    "price": 0.038288,
    "priceChange": -0.000907,
    "priceChangePercent": -2.314,
    "volume": 308589472
  },
  "DASHUSDT": {
    "price": 22.5,
    "priceChange": -0.22,
    "priceChangePercent": -0.968,
    "volume": 317243.042
  },
  "THEUSDT": {
    "price": 0.3805,
    "priceChange": -0.0298,
    "priceChangePercent": -7.263,
    "volume": 25272767
  },
  "SLERFUSDT": {
    "price": 0.08088,
    "priceChange": -0.00318,
    "priceChangePercent": -3.783,
    "volume": 35654027
  },
  "VANRYUSDT": {
    "price": 0.02944,
    "priceChange": -0.00143,
    "priceChangePercent": -4.632,
    "volume": 273783861
  },
  "RIFUSDT": {
    "price": 0.05695,
    "priceChange": -0.00225,
    "priceChangePercent": -3.801,
    "volume": 31543739
  },
  "CETUSUSDT": {
    "price": 0.09635,
    "priceChange": -0.00629,
    "priceChangePercent": -6.128,
    "volume": 114686357
  },
  "PNUTUSDT": {
    "price": 0.21704,
    "priceChange": -0.01202,
    "priceChangePercent": -5.248,
    "volume": 450294281
  },
  "VIRTUALUSDT": {
    "price": 1.2176,
    "priceChange": -0.0132,
    "priceChangePercent": -1.072,
    "volume": 109891644.1
  },
  "WAXPUSDT": {
    "price": 0.02009,
    "priceChange": -0.00091,
    "priceChangePercent": -4.333,
    "volume": 176498581
  },
  "1000SATSUSDT": {
    "price": 0.0000387,
    "priceChange": -0.0000028,
    "priceChangePercent": -6.747,
    "volume": 1238090436637
  },
  "NXPCUSDT": {
    "price": 0.7438,
    "priceChange": -0.03628,
    "priceChangePercent": -4.651,
    "volume": 15909905
  },
  "REIUSDT": {
    "price": 0.01734,
    "priceChange": -0.00117,
    "priceChangePercent": -6.321,
    "volume": 179647512
  },
  "1INCHUSDT": {
    "price": 0.2529,
    "priceChange": -0.0058,
    "priceChangePercent": -2.242,
    "volume": 71368045
  },
  "ILVUSDT": {
    "price": 14.556,
    "priceChange": -0.481,
    "priceChangePercent": -3.199,
    "volume": 866348.6
  },
  "BSWUSDT": {
    "price": 0.0171,
    "priceChange": -0.00018,
    "priceChangePercent": -1.042,
    "volume": 600063740
  },
  "ALCHUSDT": {
    "price": 0.10026,
    "priceChange": -0.01157,
    "priceChangePercent": -10.346,
    "volume": 277533957
  },
  "FORMUSDT": {
    "price": 3.3697,
    "priceChange": -0.1596,
    "priceChangePercent": -4.522,
    "volume": 1712412.3
  },
  "NEWTUSDT": {
    "price": 0.2872,
    "priceChange": -0.0105,
    "priceChangePercent": -3.527,
    "volume": 49363692
  },
  "BBUSDT": {
    "price": 0.14144,
    "priceChange": -0.01005,
    "priceChangePercent": -6.634,
    "volume": 316360848
  },
  "BLZUSDT": {
    "price": 0.06836,
    "priceChange": 0.00023,
    "priceChangePercent": 0.338,
    "volume": 377681113
  },
  "IOUSDT": {
    "price": 0.6028,
    "priceChange": -0.0293,
    "priceChangePercent": -4.635,
    "volume": 26740534.2
  },
  "PARTIUSDT": {
    "price": 0.1666,
    "priceChange": -0.0077,
    "priceChangePercent": -4.418,
    "volume": 50976951
  },
  "CATIUSDT": {
    "price": 0.08991,
    "priceChange": -0.00529,
    "priceChangePercent": -5.557,
    "volume": 73563913
  },
  "ETHFIUSDT": {
    "price": 1.1796,
    "priceChange": -0.0476,
    "priceChangePercent": -3.879,
    "volume": 160785062.3
  },
  "AINUSDT": {
    "price": 0.08868,
    "priceChange": 0.00335,
    "priceChangePercent": 3.926,
    "volume": 83808745
  },
  "PIPPINUSDT": {
    "price": 0.01478,
    "priceChange": -0.00126,
    "priceChangePercent": -7.855,
    "volume": 657569613
  },
  "AEROUSDT": {
    "price": 1.3538,
    "priceChange": -0.0922,
    "priceChangePercent": -6.376,
    "volume": 31450359.2
  },
  "SUSHIUSDT": {
    "price": 0.7932,
    "priceChange": -0.0469,
    "priceChangePercent": -5.583,
    "volume": 41766262
  },
  "MASKUSDT": {
    "price": 1.2354,
    "priceChange": -0.0416,
    "priceChangePercent": -3.258,
    "volume": 14101849
  },
  "XEMUSDT": {
    "price": 0.0338,
    "priceChange": -0.0038,
    "priceChangePercent": -10.106,
    "volume": 263718931
  },
  "NEOUSDT": {
    "price": 7.814,
    "priceChange": 0.787,
    "priceChangePercent": 11.2,
    "volume": 33569169.17
  },
  "OMUSDT": {
    "price": 0.22876,
    "priceChange": -0.00981,
    "priceChangePercent": -4.112,
    "volume": 221776198.6
  },
  "ORBSUSDT": {
    "price": 0.035157,
    "priceChange": -0.00142,
    "priceChangePercent": -3.882,
    "volume": 129413521
  },
  "STXUSDT": {
    "price": 0.6506,
    "priceChange": -0.0315,
    "priceChangePercent": -4.618,
    "volume": 35500338
  },
  "PROVEUSDT": {
    "price": 1.0127,
    "priceChange": -0.069,
    "priceChangePercent": -6.379,
    "volume": 57201368
  },
  "DOGSUSDT": {
    "price": 0.0001434,
    "priceChange": -0.0000081,
    "priceChangePercent": -5.347,
    "volume": 334200166945
  },
  "LOKAUSDT": {
    "price": 0.11323,
    "priceChange": 0.01089,
    "priceChangePercent": 10.641,
    "volume": 179673239
  },
  "BCHUSDT": {
    "price": 567.3,
    "priceChange": -27.23,
    "priceChangePercent": -4.58,
    "volume": 350970.833
  },
  "CRVUSDT": {
    "price": 0.837,
    "priceChange": -0.05,
    "priceChangePercent": -5.637,
    "volume": 263241944.3
  },
  "WCTUSDT": {
    "price": 0.3202,
    "priceChange": -0.0217,
    "priceChangePercent": -6.347,
    "volume": 77108060
  },
  "CUDISUSDT": {
    "price": 0.08764,
    "priceChange": -0.00153,
    "priceChangePercent": -1.716,
    "volume": 298441186
  },
  "AIXBTUSDT": {
    "price": 0.11007,
    "priceChange": -0.00664,
    "priceChangePercent": -5.689,
    "volume": 325033208
  },
  "PLUMEUSDT": {
    "price": 0.08843,
    "priceChange": 0.0016,
    "priceChangePercent": 1.843,
    "volume": 1014549985
  },
  "MYROUSDT": {
    "price": 0.02412,
    "priceChange": -0.0004,
    "priceChangePercent": -1.631,
    "volume": 291975465
  },
  "CFXUSDT": {
    "price": 0.18216,
    "priceChange": -0.00125,
    "priceChangePercent": -0.682,
    "volume": 546310854
  },
  "FISUSDT": {
    "price": 0.11231,
    "priceChange": -0.00477,
    "priceChangePercent": -4.074,
    "volume": 52988646
  },
  "ZKJUSDT": {
    "price": 0.1791,
    "priceChange": -0.0104,
    "priceChangePercent": -5.488,
    "volume": 39326302
  },
  "LINAUSDT": {
    "price": 0.000742,
    "priceChange": 0.000089,
    "priceChangePercent": 13.629,
    "volume": 106308520520.8
  },
  "LDOUSDT": {
    "price": 1.3587,
    "priceChange": -0.1003,
    "priceChangePercent": -6.875,
    "volume": 149967130
  },
  "PORTALUSDT": {
    "price": 0.04278,
    "priceChange": -0.00161,
    "priceChangePercent": -3.627,
    "volume": 175413172.8
  },
  "POPCATUSDT": {
    "price": 0.2722,
    "priceChange": -0.0127,
    "priceChangePercent": -4.458,
    "volume": 229668250
  },
  "POLYXUSDT": {
    "price": 0.1317,
    "priceChange": -0.00226,
    "priceChangePercent": -1.687,
    "volume": 37793103
  },
  "RAREUSDT": {
    "price": 0.05472,
    "priceChange": -0.00221,
    "priceChangePercent": -3.882,
    "volume": 135236308
  },
  "XRPUSDT": {
    "price": 2.9484,
    "priceChange": -0.0879,
    "priceChangePercent": -2.895,
    "volume": 943017165.7
  },
  "ICXUSDT": {
    "price": 0.1305,
    "priceChange": -0.0022,
    "priceChangePercent": -1.658,
    "volume": 39233796
  }
};

// Función para obtener datos válidos
function getValidBinanceData(symbol) {
    return VALID_BINANCE_DATA[symbol] || null;
}

// Función para validar precio
function validatePrice(price) {
    if (isNaN(price) || price <= 0 || price === null || price === undefined) {
        return false;
    }
    return true;
}

// Función para obtener precio válido
function getValidPrice(symbol, fallbackPrice = 100) {
    const validData = getValidBinanceData(symbol);
    if (validData && validatePrice(validData.price)) {
        return validData.price;
    }
    return fallbackPrice;
}

module.exports = { 
    VALID_BINANCE_DATA, 
    getValidBinanceData, 
    validatePrice, 
    getValidPrice 
};