import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import * as signalR from "@microsoft/signalr";

import {
  createChart,
} from "lightweight-charts";


// ============================================================
// BIQUOTE
// ============================================================

const BIQUOTE_BASE_URL = "https://biquote.io";

const BIQUOTE_WS_URL =
  "https://biquote.io/hubs/tick";

const SYMBOL = "XAUUSD";


// ============================================================
// TIMEFRAMES
// ============================================================

const TIMEFRAMES = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
};

const DEFAULT_TIMEFRAME = "1m";


// ============================================================
// HELPERS
// ============================================================

function getTimeframeSeconds(timeframe) {
  return TIMEFRAMES[timeframe] || 60;
}


function getCandleTime(timestamp, timeframe) {
  const seconds =
    getTimeframeSeconds(timeframe);

  return (
    Math.floor(timestamp / seconds) *
    seconds
  );
}


function formatPrice(price) {
  if (
    price === null ||
    price === undefined ||
    !Number.isFinite(Number(price))
  ) {
    return "---";
  }

  return Number(price).toFixed(2);
}


function formatTime(timestamp) {
  if (!timestamp) {
    return "--:--:--";
  }

  const date = new Date(timestamp);

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
}


// ============================================================
// APP
// ============================================================

export default function App() {

  const chartContainerRef =
    useRef(null);

  const chartRef =
    useRef(null);

  const candleSeriesRef =
    useRef(null);

  const connectionRef =
    useRef(null);

  const currentCandleRef =
    useRef(null);

  const timeframeRef =
    useRef(DEFAULT_TIMEFRAME);

  const mountedRef =
    useRef(false);


  const [timeframe, setTimeframe] =
    useState(DEFAULT_TIMEFRAME);

  const [price, setPrice] =
    useState(null);

  const [bid, setBid] =
    useState(null);

  const [ask, setAsk] =
    useState(null);

  const [spread, setSpread] =
    useState(null);

  const [lastTickTime, setLastTickTime] =
    useState(null);

  const [connectionStatus, setConnectionStatus] =
    useState("CONNECTING");

  const [error, setError] =
    useState("");

  const [tickCount, setTickCount] =
    useState(0);


  // ==========================================================
  // TIMEFRAME REF
  // ==========================================================

  useEffect(() => {
    timeframeRef.current =
      timeframe;
  }, [timeframe]);


  // ==========================================================
  // CREATE CHART
  // ==========================================================

  useEffect(() => {

    if (!chartContainerRef.current) {
      return;
    }


    const container =
      chartContainerRef.current;


    const chart =
      createChart(container, {

        width:
          container.clientWidth,

        height:
          container.clientHeight,


        layout: {
          background: {
            color: "#050505",
          },

          textColor: "#888888",
        },


        grid: {
          vertLines: {
            color: "#111111",
          },

          horzLines: {
            color: "#111111",
          },
        },


        crosshair: {
          mode: 1,

          vertLine: {
            color: "#444444",

            width: 1,

            style: 2,
          },

          horzLine: {
            color: "#444444",

            width: 1,

            style: 2,
          },
        },


        rightPriceScale: {
          borderColor: "#222222",

          scaleMargins: {
            top: 0.08,

            bottom: 0.08,
          },
        },


        timeScale: {
          borderColor: "#222222",

          timeVisible: true,

          secondsVisible: false,

          rightOffset: 8,

          barSpacing: 8,

          minBarSpacing: 2,
        },


        handleScroll: {
          mouseWheel: true,

          pressedMouseMove: true,

          horzTouchDrag: true,

          vertTouchDrag: true,
        },


        handleScale: {
          axisPressedMouseMove: true,

          mouseWheel: true,

          pinch: true,
        },
      });


    // ========================================================
    // IMPORTANT:
    // lightweight-charts 4.x
    // ========================================================

    const series =
      chart.addCandlestickSeries({

        upColor: "#00c853",

        downColor: "#ff3b30",

        borderUpColor: "#00c853",

        borderDownColor: "#ff3b30",

        wickUpColor: "#00c853",

        wickDownColor: "#ff3b30",

        priceLineVisible: true,

        lastValueVisible: true,
      });


    chartRef.current =
      chart;

    candleSeriesRef.current =
      series;


    // ========================================================
    // RESPONSIVE
    // ========================================================

    const resizeObserver =
      new ResizeObserver(() => {

        if (
          !chartContainerRef.current
        ) {
          return;
        }


        chart.applyOptions({
          width:
            chartContainerRef.current
              .clientWidth,

          height:
            chartContainerRef.current
              .clientHeight,
        });

      });


    resizeObserver.observe(
      container
    );


    return () => {

      resizeObserver.disconnect();

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current = null;
    };

  }, []);


  // ==========================================================
  // LOAD HISTORICAL CANDLES
  // ==========================================================

  const loadHistoricalCandles =
    useCallback(
      async (selectedTimeframe) => {

        if (
          !candleSeriesRef.current
        ) {
          return;
        }


        try {

          setError("");


          const intervalMap = {
            "1m": "1m",
            "5m": "5m",
            "15m": "15m",
            "30m": "30m",
            "1H": "1h",
            "4H": "4h",
            "1D": "1d",
          };


          const interval =
            intervalMap[
              selectedTimeframe
            ] || "1m";


          const url =
            `${BIQUOTE_BASE_URL}` +
            `/api/${SYMBOL}/ohlc` +
            `?interval=${interval}` +
            `&limit=300`;


          const response =
            await fetch(url);


          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }


          const data =
            await response.json();


          if (
            !data ||
            !Array.isArray(
              data.bars
            )
          ) {
            throw new Error(
              "Format candle biquote tidak valid."
            );
          }


          const bars =
            data.bars
              .slice()
              .reverse()
              .map((bar) => {

                const timestamp =
                  Math.floor(
                    new Date(
                      bar.openTime
                    ).getTime() /
                      1000
                  );


                return {
                  time: timestamp,

                  open: Number(
                    bar.open
                  ),

                  high: Number(
                    bar.high
                  ),

                  low: Number(
                    bar.low
                  ),

                  close: Number(
                    bar.close
                  ),
                };

              })
              .filter(
                (bar) =>
                  Number.isFinite(
                    bar.time
                  ) &&
                  Number.isFinite(
                    bar.open
                  ) &&
                  Number.isFinite(
                    bar.high
                  ) &&
                  Number.isFinite(
                    bar.low
                  ) &&
                  Number.isFinite(
                    bar.close
                  )
              );


          candleSeriesRef.current
            .setData(bars);


          // ==================================================
          // CURRENT CANDLE
          // ==================================================

          const lastBar =
            bars[bars.length - 1];


          if (lastBar) {

            currentCandleRef.current = {
              time:
                lastBar.time,

              open:
                lastBar.open,

              high:
                lastBar.high,

              low:
                lastBar.low,

              close:
                lastBar.close,
            };

          } else {

            currentCandleRef.current =
              null;

          }


          chartRef.current
            ?.timeScale()
            .fitContent();


        } catch (err) {

          console.error(
            "Historical candle error:",
            err
          );


          setError(
            "Gagal mengambil historical XAUUSD."
          );

        }

      },
      []
    );


  // ==========================================================
  // PROCESS TICK
  // ==========================================================

  const processTick =
    useCallback(
      (tick) => {

        if (!tick) {
          return;
        }


        if (
          String(
            tick.symbol
          ).toUpperCase() !==
          SYMBOL
        ) {
          return;
        }


        const mid =
          Number(tick.mid);


        if (
          !Number.isFinite(mid)
        ) {
          return;
        }


        const parsedTime =
          new Date(
            tick.timestamp
          ).getTime();


        if (
          !Number.isFinite(
            parsedTime
          )
        ) {
          return;
        }


        const currentTime =
          Math.floor(
            parsedTime / 1000
          );


        const selectedTimeframe =
          timeframeRef.current;


        const candleTime =
          getCandleTime(
            currentTime,
            selectedTimeframe
          );


        // ====================================================
        // LIVE PRICE
        // ====================================================

        if (
          mountedRef.current
        ) {

          setPrice(mid);


          if (
            tick.bid !==
            undefined
          ) {
            setBid(
              Number(
                tick.bid
              )
            );
          }


          if (
            tick.ask !==
            undefined
          ) {
            setAsk(
              Number(
                tick.ask
              )
            );
          }


          if (
            tick.spread !==
            undefined
          ) {
            setSpread(
              Number(
                tick.spread
              )
            );
          }


          setLastTickTime(
            tick.timestamp
          );


          setTickCount(
            (value) =>
              value + 1
          );

        }


        const existing =
          currentCandleRef.current;


        // ====================================================
        // FIRST CANDLE
        // ====================================================

        if (!existing) {

          const newCandle = {

            time:
              candleTime,

            open:
              mid,

            high:
              mid,

            low:
              mid,

            close:
              mid,

          };


          currentCandleRef.current =
            newCandle;


          candleSeriesRef.current
            ?.update(
              newCandle
            );


          return;
        }


        // ====================================================
        // NEW CANDLE
        // ====================================================

        if (
          candleTime >
          existing.time
        ) {

          const newCandle = {

            time:
              candleTime,

            open:
              mid,

            high:
              mid,

            low:
              mid,

            close:
              mid,

          };


          currentCandleRef.current =
            newCandle;


          candleSeriesRef.current
            ?.update(
              newCandle
            );


          return;
        }


        // ====================================================
        // OLD TICK
        // ====================================================

        if (
          candleTime <
          existing.time
        ) {
          return;
        }


        // ====================================================
        // UPDATE CURRENT CANDLE
        // ====================================================

        const updatedCandle = {

          time:
            existing.time,

          open:
            existing.open,

          high:
            Math.max(
              existing.high,
              mid
            ),

          low:
            Math.min(
              existing.low,
              mid
            ),

          close:
            mid,

        };


        currentCandleRef.current =
          updatedCandle;


        candleSeriesRef.current
          ?.update(
            updatedCandle
          );

      },
      []
    );


  // ==========================================================
  // CONNECT WEBSOCKET
  // ==========================================================

  const connectWebSocket =
    useCallback(
      async () => {

        try {

          setConnectionStatus(
            "CONNECTING"
          );

          setError("");


          // ==================================================
          // STOP OLD CONNECTION
          // ==================================================

          if (
            connectionRef.current
          ) {

            try {

              await connectionRef.current
                .stop();

            } catch {
              // ignore
            }

          }


          // ==================================================
          // SIGNALR
          // ==================================================

          const connection =
            new signalR.HubConnectionBuilder()
              .withUrl(
                BIQUOTE_WS_URL
              )
              .withAutomaticReconnect([
                0,
                2000,
                5000,
                10000,
                30000,
              ])
              .configureLogging(
                signalR.LogLevel.Warning
              )
              .build();


          connectionRef.current =
            connection;


          // ==================================================
          // RECEIVE TICK
          // ==================================================

          connection.on(
            "ReceiveTick",
            (tick) => {

              processTick(
                tick
              );

            }
          );


          // ==================================================
          // RECONNECTING
          // ==================================================

          connection.onreconnecting(
            () => {

              if (
                mountedRef.current
              ) {

                setConnectionStatus(
                  "RECONNECTING"
                );

              }

            }
          );


          // ==================================================
          // RECONNECTED
          // ==================================================

          connection.onreconnected(
            async () => {

              if (
                !mountedRef.current
              ) {
                return;
              }


              try {

                await connection.invoke(
                  "Subscribe",
                  [SYMBOL]
                );


                setConnectionStatus(
                  "LIVE"
                );

              } catch (
                reconnectError
              ) {

                console.error(
                  "Resubscribe error:",
                  reconnectError
                );

              }

            }
          );


          // ==================================================
          // CLOSED
          // ==================================================

          connection.onclose(
            () => {

              if (
                mountedRef.current
              ) {

                setConnectionStatus(
                  "DISCONNECTED"
                );

              }

            }
          );


          // ==================================================
          // START
          // ==================================================

          await connection.start();


          // ==================================================
          // SUBSCRIBE XAUUSD
          // ==================================================

          await connection.invoke(
            "Subscribe",
            [SYMBOL]
          );


          if (
            mountedRef.current
          ) {

            setConnectionStatus(
              "LIVE"
            );

          }

        } catch (err) {

          console.error(
            "biquote WebSocket error:",
            err
          );


          if (
            mountedRef.current
          ) {

            setConnectionStatus(
              "ERROR"
            );


            setError(
              "Gagal terhubung ke biquote WebSocket."
            );

          }

        }

      },
      [processTick]
    );


  // ==========================================================
  // INITIALIZE
  // ==========================================================

  useEffect(() => {

    mountedRef.current =
      true;


    loadHistoricalCandles(
      DEFAULT_TIMEFRAME
    );


    connectWebSocket();


    return () => {

      mountedRef.current =
        false;


      if (
        connectionRef.current
      ) {

        connectionRef.current
          .stop()
          .catch(() => {});

      }


      connectionRef.current =
        null;

    };

  }, [
    connectWebSocket,
    loadHistoricalCandles,
  ]);


  // ==========================================================
  // CHANGE TIMEFRAME
  // ==========================================================

  useEffect(() => {

    if (
      !mountedRef.current
    ) {
      return;
    }


    currentCandleRef.current =
      null;


    loadHistoricalCandles(
      timeframe
    );

  }, [
    timeframe,
    loadHistoricalCandles,
  ]);


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="app">

      <header className="topbar">

        <div className="symbol">

          <strong>
            XAUUSD
          </strong>

          <span>
            GOLD / US DOLLAR
          </span>

        </div>


        <div className="price-block">

          <strong>
            {formatPrice(price)}
          </strong>

          <span>
            MID
          </span>

        </div>


        <div className="quotes">

          <div>
            <span>BID</span>

            <strong>
              {formatPrice(bid)}
            </strong>
          </div>


          <div>
            <span>ASK</span>

            <strong>
              {formatPrice(ask)}
            </strong>
          </div>


          <div>
            <span>SPREAD</span>

            <strong>
              {spread !== null
                ? spread.toFixed(2)
                : "---"}
            </strong>
          </div>

        </div>


        <div className="connection">

          <span
            className={
              connectionStatus ===
              "LIVE"
                ? "dot live"
                : "dot"
            }
          />

          {connectionStatus}

        </div>

      </header>


      <div className="toolbar">

        <div className="timeframes">

          {Object.keys(
            TIMEFRAMES
          ).map(
            (item) => (

              <button
                key={item}
                className={
                  timeframe ===
                  item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTimeframe(
                    item
                  )
                }
              >
                {item}
              </button>

            )
          )}

        </div>


        <div className="tick-info">

          <span>
            {tickCount.toLocaleString(
              "en-US"
            )} ticks
          </span>

          <span>
            {lastTickTime
              ? formatTime(
                  lastTickTime
                )
              : "--:--:--"}{" "}
            WIB
          </span>

        </div>

      </div>


      <main className="chart-container">

        <div
          ref={
            chartContainerRef
          }
          className="chart"
        />


        {error && (
          <div className="error">
            {error}
          </div>
        )}

      </main>

    </div>
  );
}
