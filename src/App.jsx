import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  BrainCircuit,
  Check,
  ChevronDown,
  Clock3,
  Crosshair,
  Gauge,
  Layers3,
  LayoutDashboard,
  LineChart,
  Menu,
  Radio,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap
} from "lucide-react";


// ============================================================
// SIMULATION DATA
// NANTI DIGANTI DENGAN API BACKEND KAMU
// ============================================================

const initialSignal = {
  symbol: "XAUUSD",

  direction: "BUY",

  status: "ACTIVE",

  score: 87,

  entryLow: 4982.0,
  entryHigh: 4984.0,

  sl: 4932.0,

  tp1: 5052.0,
  tp2: 5132.0,

  rr1: "1 : 1.40",
  rr2: "1 : 3.00",

  h1Bias: "BULLISH",

  liquidity: "SWEPT",

  structure: "CHoCH",

  displacement: "CONFIRMED",

  fvg: "VALID",

  orderBlock: "VALID",

  session: "LONDON",

  volatility: "NORMAL",

  created: "14:35:02 WIB",

  age: 3
};


const signalHistory = [
  {
    time: "14:35",
    type: "BUY",
    entry: "4982–4984",
    result: "ACTIVE",
    pnl: "-"
  },
  {
    time: "13:00",
    type: "SELL",
    entry: "4971–4973",
    result: "TP1",
    pnl: "+70 pips"
  },
  {
    time: "12:00",
    type: "BUY",
    entry: "4960–4962",
    result: "TP2",
    pnl: "+150 pips"
  },
  {
    time: "11:00",
    type: "SELL",
    entry: "4951–4953",
    result: "SL",
    pnl: "-50 pips"
  },
  {
    time: "10:00",
    type: "BUY",
    entry: "4942–4944",
    result: "TP1",
    pnl: "+70 pips"
  }
];


// ============================================================
// TRADINGVIEW CHART
// ============================================================

function TradingViewChart() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "tradingview-widget-container";

    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    const chart = document.createElement("div");

    chart.className =
      "tradingview-widget-container__widget";

    chart.style.width = "100%";
    chart.style.height = "100%";

    wrapper.appendChild(chart);

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";

    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,

      symbol: "OANDA:XAUUSD",

      interval: "5",

      timezone: "Asia/Jakarta",

      theme: "dark",

      style: "1",

      locale: "id",

      allow_symbol_change: true,

      calendar: false,

      hide_side_toolbar: false,

      hide_top_toolbar: false,

      hide_legend: false,

      hide_volume: false,

      withdateranges: true,

      save_image: false,

      details: true,

      hotlist: false,

      studies: [
        "Volume@tv-basicstudies"
      ]
    });

    wrapper.appendChild(script);

    container.current.appendChild(wrapper);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={container}
      className="chart-container"
    />
  );
}


// ============================================================
// TOP HEADER
// ============================================================

function Header({
  currentPrice,
  mobileMenu,
  setMobileMenu
}) {
  return (
    <header className="topbar">

      <div className="brand">

        <div className="brand-mark">
          <BrainCircuit size={21} />
        </div>

        <div>
          <div className="brand-title">
            PRO SIGNAL FX
          </div>

          <div className="brand-subtitle">
            AI • SMART MONEY CONCEPT
          </div>
        </div>

      </div>


      <div className="header-market">

        <div className="market-symbol">
          XAUUSD
        </div>

        <div className="market-price">
          {currentPrice.toFixed(2)}
        </div>

        <div className="market-live">
          <span />
          LIVE
        </div>

      </div>


      <div className="header-actions">

        <div className="header-clock">
          <Clock3 size={15} />
          <span>
            {new Date().toLocaleTimeString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
              }
            )} WIB
          </span>
        </div>

        <button className="icon-button">
          <Bell size={18} />
        </button>

        <button
          className="mobile-button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
        >
          <Menu size={20} />
        </button>

      </div>

    </header>
  );
}


// ============================================================
// MARKET BAR
// ============================================================

function MarketBar({
  currentPrice
}) {
  const change = 12.38;

  return (
    <div className="market-bar">

      <div className="market-stat">

        <span className="stat-label">
          MARKET
        </span>

        <strong>
          GOLD / XAUUSD
        </strong>

      </div>


      <div className="market-stat">

        <span className="stat-label">
          PRICE
        </span>

        <strong>
          {currentPrice.toFixed(2)}
        </strong>

      </div>


      <div className="market-stat">

        <span className="stat-label">
          CHANGE
        </span>

        <strong className="positive">
          +{change.toFixed(2)}
        </strong>

      </div>


      <div className="market-stat">

        <span className="stat-label">
          SESSION
        </span>

        <strong>
          LONDON
        </strong>

      </div>


      <div className="market-stat">

        <span className="stat-label">
          VOLATILITY
        </span>

        <strong className="normal">
          NORMAL
        </strong>

      </div>


      <div className="market-live-large">

        <Radio size={15} />

        MARKET LIVE

      </div>

    </div>
  );
}


// ============================================================
// AI SCORE
// ============================================================

function ScoreCard({
  score
}) {
  return (
    <div className="score-card">

      <div className="score-header">

        <div>
          <span className="panel-kicker">
            AI CONFIDENCE
          </span>

          <h2>
            Market Score
          </h2>
        </div>

        <Gauge size={21} />

      </div>


      <div className="score-body">

        <div
          className="score-circle"
          style={{
            "--score": `${score * 3.6}deg`
          }}
        >
          <div className="score-inner">

            <strong>
              {score}
            </strong>

            <span>
              / 100
            </span>

          </div>
        </div>


        <div className="score-description">

          <div className="score-status">
            HIGH PROBABILITY
          </div>

          <p>
            Struktur market mendukung
            setup BUY dengan konfirmasi
            liquidity dan displacement.
          </p>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// SIGNAL CARD
// ============================================================

function SignalCard({
  signal,
  currentPrice
}) {
  const isBuy =
    signal.direction === "BUY";

  const distance =
    currentPrice -
    signal.entryHigh;

  const insideEntry =
    currentPrice >= signal.entryLow &&
    currentPrice <= signal.entryHigh;

  return (
    <div className="signal-card">

      <div className="signal-card-header">

        <div>

          <span className="panel-kicker">
            ACTIVE SIGNAL
          </span>

          <div className="signal-direction">

            <div
              className={
                isBuy
                  ? "direction-icon buy"
                  : "direction-icon sell"
              }
            >
              {isBuy ? (
                <ArrowUp size={25} />
              ) : (
                <ArrowDown size={25} />
              )}
            </div>

            <div>

              <h2>
                {signal.direction}
              </h2>

              <span>
                {signal.symbol}
              </span>

            </div>

          </div>

        </div>


        <div className="active-pill">
          <span />
          ACTIVE
        </div>

      </div>


      <div className="signal-price">

        <span>
          CURRENT PRICE
        </span>

        <strong>
          {currentPrice.toFixed(2)}
        </strong>

      </div>


      <div className="entry-box">

        <div className="entry-label">
          ENTRY ZONE
        </div>

        <div className="entry-value">
          {signal.entryLow.toFixed(2)}
          <span> — </span>
          {signal.entryHigh.toFixed(2)}
        </div>

        <div
          className={
            insideEntry
              ? "entry-status valid"
              : distance > 0
                ? "entry-status caution"
                : "entry-status wait"
          }
        >
          {insideEntry
            ? "PRICE INSIDE ENTRY ZONE"
            : distance > 0
              ? "PRICE ABOVE ENTRY ZONE"
              : "WAITING FOR ENTRY"}
        </div>

      </div>


      <div className="trade-levels">

        <div className="trade-level">

          <span>
            STOP LOSS
          </span>

          <strong className="sl">
            {signal.sl.toFixed(2)}
          </strong>

        </div>


        <div className="trade-level">

          <span>
            TAKE PROFIT 1
          </span>

          <strong className="tp">
            {signal.tp1.toFixed(2)}
          </strong>

        </div>


        <div className="trade-level">

          <span>
            TAKE PROFIT 2
          </span>

          <strong className="tp">
            {signal.tp2.toFixed(2)}
          </strong>

        </div>

      </div>


      <div className="rr-row">

        <div>
          RR TP1
          <strong>
            {signal.rr1}
          </strong>
        </div>

        <div>
          RR TP2
          <strong>
            {signal.rr2}
          </strong>
        </div>

        <div>
          AGE
          <strong>
            {signal.age}s
          </strong>
        </div>

      </div>


      <div className="signal-footer">

        <div>
          <Clock3 size={14} />
          Created {signal.created}
        </div>

        <div className="signal-verified">
          <ShieldCheck size={14} />
          AI VERIFIED
        </div>

      </div>

    </div>
  );
}


// ============================================================
// MARKET ANALYSIS
// ============================================================

function AnalysisPanel({
  signal
}) {
  const items = [
    {
      name: "H1 BIAS",
      value: signal.h1Bias,
      icon: TrendingUp,
      positive: true
    },
    {
      name: "LIQUIDITY",
      value: signal.liquidity,
      icon: Zap,
      positive: true
    },
    {
      name: "STRUCTURE",
      value: signal.structure,
      icon: Activity,
      positive: true
    },
    {
      name: "DISPLACEMENT",
      value: signal.displacement,
      icon: BarChart3,
      positive: true
    },
    {
      name: "FAIR VALUE GAP",
      value: signal.fvg,
      icon: Layers3,
      positive: true
    },
    {
      name: "ORDER BLOCK",
      value: signal.orderBlock,
      icon: Target,
      positive: true
    }
  ];

  return (
    <div className="analysis-panel">

      <div className="panel-heading">

        <div>

          <span className="panel-kicker">
            AI MARKET ANALYSIS
          </span>

          <h2>
            Smart Money Structure
          </h2>

        </div>

        <BrainCircuit size={21} />

      </div>


      <div className="analysis-grid">

        {items.map((item) => {

          const Icon = item.icon;

          return (
            <div
              className="analysis-item"
              key={item.name}
            >

              <div className="analysis-icon">
                <Icon size={16} />
              </div>

              <div className="analysis-text">

                <span>
                  {item.name}
                </span>

                <strong>
                  {item.value}
                </strong>

              </div>

              <Check
                size={16}
                className="analysis-check"
              />

            </div>
          );

        })}

      </div>


      <div className="ai-explanation">

        <div className="explanation-title">
          <Zap size={15} />
          AI DECISION
        </div>

        <p>
          Harga melakukan liquidity sweep
          pada area low sebelumnya kemudian
          membentuk displacement bullish.
          Struktur M5 menunjukkan CHoCH dan
          terdapat FVG yang masih valid untuk
          retracement.
        </p>

      </div>

    </div>
  );
}


// ============================================================
// HISTORY
// ============================================================

function SignalHistory() {
  return (
    <div className="history-panel">

      <div className="panel-heading">

        <div>

          <span className="panel-kicker">
            RECENT SIGNALS
          </span>

          <h2>
            Signal History
          </h2>

        </div>

        <button className="small-button">
          View All
          <ChevronDown size={14} />
        </button>

      </div>


      <div className="history-table">

        <div className="history-header">

          <span>
            TIME
          </span>

          <span>
            SIGNAL
          </span>

          <span>
            ENTRY
          </span>

          <span>
            RESULT
          </span>

          <span>
            P/L
          </span>

        </div>


        {signalHistory.map(
          (item, index) => {

            const buy =
              item.type === "BUY";

            return (
              <div
                className="history-row"
                key={index}
              >

                <span className="history-time">
                  {item.time}
                </span>


                <span
                  className={
                    buy
                      ? "history-signal buy-text"
                      : "history-signal sell-text"
                  }
                >

                  {buy ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}

                  {item.type}

                </span>


                <span>
                  {item.entry}
                </span>


                <span>

                  <span
                    className={
                      item.result === "SL"
                        ? "result-badge loss"
                        : item.result === "ACTIVE"
                          ? "result-badge active"
                          : "result-badge win"
                    }
                  >
                    {item.result}
                  </span>

                </span>


                <span
                  className={
                    item.pnl.startsWith("-")
                      ? "pnl loss-text"
                      : item.pnl === "-"
                        ? ""
                        : "pnl win-text"
                  }
                >
                  {item.pnl}
                </span>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


// ============================================================
// MARKET STATUS
// ============================================================

function MarketStatus({
  currentPrice
}) {
  return (
    <div className="status-panel">

      <div className="status-item">

        <div className="status-icon">
          <LineChart size={16} />
        </div>

        <div>
          <span>
            XAUUSD PRICE
          </span>

          <strong>
            {currentPrice.toFixed(2)}
          </strong>
        </div>

        <div className="status-online">
          ONLINE
        </div>

      </div>


      <div className="status-item">

        <div className="status-icon">
          <RefreshCw size={16} />
        </div>

        <div>
          <span>
            DATA ENGINE
          </span>

          <strong>
            CONNECTED
          </strong>
        </div>

        <div className="status-online">
          OK
        </div>

      </div>


      <div className="status-item">

        <div className="status-icon">
          <BrainCircuit size={16} />
        </div>

        <div>
          <span>
            AI ENGINE
          </span>

          <strong>
            READY
          </strong>
        </div>

        <div className="status-online">
          ACTIVE
        </div>

      </div>

    </div>
  );
}


// ============================================================
// MAIN APP
// ============================================================

export default function App() {

  const [currentPrice, setCurrentPrice] =
    useState(4985.42);

  const [signal, setSignal] =
    useState(initialSignal);

  const [mobileMenu, setMobileMenu] =
    useState(false);


  // ----------------------------------------------------------
  // SIMULATED PRICE
  // NANTI DIHAPUS SAAT SUDAH CONNECT BACKEND
  // ----------------------------------------------------------

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentPrice((previous) => {

        const movement =
          (Math.random() - 0.5) * 1.2;

        return Number(
          (previous + movement).toFixed(2)
        );

      });

    }, 1500);


    return () => clearInterval(timer);

  }, []);


  // ----------------------------------------------------------
  // SIGNAL AGE
  // ----------------------------------------------------------

  useEffect(() => {

    const timer = setInterval(() => {

      setSignal((previous) => ({
        ...previous,
        age: previous.age + 1
      }));

    }, 1000);


    return () => clearInterval(timer);

  }, []);


  return (
    <div className="app">

      <Header
        currentPrice={currentPrice}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />


      <aside
        className={
          mobileMenu
            ? "sidebar mobile-open"
            : "sidebar"
        }
      >

        <div className="sidebar-section">

          <div className="sidebar-label">
            TERMINAL
          </div>

          <button className="nav-item active">
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button className="nav-item">
            <LineChart size={17} />
            Live Chart
          </button>

          <button className="nav-item">
            <Crosshair size={17} />
            Signals
          </button>

          <button className="nav-item">
            <BarChart3 size={17} />
            Performance
          </button>

        </div>


        <div className="sidebar-section">

          <div className="sidebar-label">
            AI SYSTEM
          </div>

          <button className="nav-item">
            <BrainCircuit size={17} />
            AI Analysis
          </button>

          <button className="nav-item">
            <Activity size={17} />
            Market Structure
          </button>

          <button className="nav-item">
            <ShieldCheck size={17} />
            Risk Monitor
          </button>

        </div>


        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot" />

            <div>
              <strong>
                SYSTEM ONLINE
              </strong>

              <small>
                AI engine operational
              </small>
            </div>

          </div>

        </div>

      </aside>


      <main className="main">

        <MarketBar
          currentPrice={currentPrice}
        />


        <section className="dashboard-grid">

          <div className="left-column">

            <div className="chart-panel">

              <div className="chart-header">

                <div className="chart-title">

                  <div className="chart-symbol">
                    XAUUSD
                  </div>

                  <div className="chart-info">
                    GOLD SPOT
                  </div>

                </div>


                <div className="timeframes">

                  <button>
                    1m
                  </button>

                  <button className="selected">
                    5m
                  </button>

                  <button>
                    15m
                  </button>

                  <button>
                    30m
                  </button>

                  <button>
                    1H
                  </button>

                </div>

              </div>


              <div className="chart-wrapper">
                <TradingViewChart />
              </div>

            </div>


            <AnalysisPanel
              signal={signal}
            />


            <SignalHistory />

          </div>


          <div className="right-column">

            <ScoreCard
              score={signal.score}
            />


            <SignalCard
              signal={signal}
              currentPrice={currentPrice}
            />


            <MarketStatus
              currentPrice={currentPrice}
            />

          </div>

        </section>

      </main>


      <div className="floating-status">

        <span className="floating-dot" />

        AI MARKET MONITOR

        <span className="separator">
          |
        </span>

        XAUUSD

        <span className="separator">
          |
        </span>

        {currentPrice.toFixed(2)}

      </div>

    </div>
  );
}
