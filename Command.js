(() => {
  "use strict";

  const CONFIGS = {
    "Manual Input Answer": false,

    "Delay Click": 5000,
    "Min Delay Click": 1500,
    "Enabled Delay": false,
    "Enabled Auto Click": false,

    "Enabled Block Report Anti Cheat": true,
    "Enabled Bold Font Answer": true,
    "Eanbled Show Answer Title": false,
    "Eanbled Show Answer Href": true,
  };

  const oldSendBeacon = navigator.sendBeacon.bind(navigator);
  const nativeOpen_XML = XMLHttpRequest.prototype.open;
  const nativeSend_XML = XMLHttpRequest.prototype.send;
  const quizDatabase = new Map();
  const tmpDiv = document.createElement("div");

  const cleanText = (text) => {
    if (!text) return "";
    tmpDiv.innerHTML = text;
    return (tmpDiv.textContent || tmpDiv.innerText || "")
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  let piniaCache = null;
  const getStoreState = (storeName) => {
    piniaCache ??=
      document.querySelector("#root, #app")?.__vue_app__?.config
        .globalProperties.$pinia;
    return piniaCache?._s.get(storeName)?.$state || null;
  };

  const processQuestions = (questions, mapFn) => {
    (questions || []).forEach((q) => {
      const { id, ansRaw, opts } = mapFn(q);
      const indices = Array.isArray(ansRaw)
        ? ansRaw
        : typeof ansRaw === "number"
          ? [ansRaw]
          : [];
      const answers = indices
        .map((idx) => (opts[idx] ? cleanText(opts[idx].text) : ""))
        .filter(Boolean);
      if (id && answers.length) quizDatabase.set(id, answers);
    });
  };

  const fetchApi = async () => {
    try {
      const gameData = getStoreState("gameData");
      if (!gameData?.roomHash) return;

      if (CONFIGS["Manual Input Answer"]) {
        window.open(
          `https://api.cheatnetwork.eu/quizizz/${gameData.roomCode}/answers`,
          "_blank",
        );

        let resData = null;
        function askForInput(message) {
          if (document.visibilityState === "visible") {
            const val = prompt(message);

            if (val === null || val.trim() === "") {
              alert("Please enter JSON before continuing!");
              setTimeout(() => askForInput(message), 100);
            } else {
              try {
                resData = JSON.parse(val);
              } catch (e) {
                alert("Syntax Error" +e);
                setTimeout(() => askForInput(message), 100);
              }
            }
          } else {
            setTimeout(() => askForInput(message), 1000);
          }
        }

        setTimeout(() => {
          askForInput("Please copy this message and paste it into the input:");
        }, 1000);

        processQuestions(resData?.answers, (q) => ({
          id: q?.id,
          ansRaw: q?.answer,
          opts: q?.options || [],
        }));
      } else {
        const res = await fetch(
          `https://wayground.com/_api/main/game/${gameData.roomHash}`,
        );
        if (!res.ok) throw new Error();
        const resData = await res.json();

        processQuestions(resData?.data?.questions, (q) => ({
          id: q?._id,
          ansRaw: q?.structure?.answer,
          opts: q?.structure?.options || [],
        }));
      }
    } catch (err) {}
  };

  const getCurrentQuestionId = () => {
    const qState = getStoreState("gameQuestions");
    const fState = getStoreState("gameFlow");
    return (
      qState?.currentId ||
      qState?.currentQuestionId ||
      qState?.cachedCurrentQuestionId ||
      fState?.currentQuestionId ||
      fState?.cachedCurrentQuestionId ||
      null
    );
  };

  const solveQuestion = () => {
    if (!quizDatabase.size) return;
    const currentId = getCurrentQuestionId();
    if (!currentId) return;

    const answers = quizDatabase.get(currentId);
    if (!answers) return;

    const options = [
      ...document.querySelectorAll(
        '[role="option"], button[class*="option"], .is-selectable',
      ),
    ];
    let btnIndex = 0;

    const targetBtn = options.find((opt) => {
      const slotEl = opt.querySelector("div.content-slot");
      if (!slotEl) return false;
      btnIndex++;
      return answers.includes(cleanText(slotEl.innerText));
    });

    if (CONFIGS["Eanbled Show Answer Title"]) {
      document.title = `Playing a Game - Wayground ${btnIndex}`;
    }

    if (CONFIGS["Eanbled Show Answer Href"]) {
      const suffix = `A${btnIndex}`;
      if (!location.href.endsWith(suffix)) {
        history.pushState({}, "", location.href.replace(/(A\d+)?$/, suffix));
      }
    }

    if (targetBtn && !targetBtn.dataset.botProcessed) {
      targetBtn.dataset.botProcessed = "true";

      if (CONFIGS["Enabled Bold Font Answer"]) {
        const textEl =
          targetBtn.querySelector("div.content-slot p") ||
          targetBtn.querySelector("div.content-slot");
        if (textEl)
          textEl.style.setProperty("font-weight", "bold", "important");
      }

      if (CONFIGS["Enabled Auto Click"]) {
        const clickAction = () => targetBtn.click();
        if (CONFIGS["Enabled Delay"]) {
          const delay =
            Math.floor(
              Math.random() *
                (CONFIGS["Delay Click"] - CONFIGS["Min Delay Click"] + 1),
            ) + CONFIGS["Min Delay Click"];
          setTimeout(clickAction, delay);
        } else {
          clickAction();
        }
      }
    }
  };

  if (CONFIGS["Enabled Block Report Anti Cheat"]) {
    navigator.sendBeacon = (url, data) =>
      String(url).includes("frontend") || oldSendBeacon(url, data);

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      this._url = url;
      return nativeOpen_XML.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function (body) {
      if (
        typeof this._url === "string" &&
        this._url.includes("player-infraction")
      ) {
        Object.defineProperties(this, {
          readyState: { writable: true, value: 4 },
          status: { writable: true, value: 200 },
          statusText: { writable: true, value: "OK" },
          responseText: {
            writable: true,
            value: JSON.stringify({ success: true, message: "" }),
          },
          response: {
            writable: true,
            value: JSON.stringify({
              success: true,
              data: {},
              time: new Date().toISOString(),
              meta: {
                service: "gameapi",
                version: "255a44aeaaa20b22f2b41234e954c3032a11918e67z",
              },
            }),
          },
        });

        if (typeof this.onreadystatechange === "function")
          this.onreadystatechange();
        this.dispatchEvent(new Event("readystatechange"));
        this.dispatchEvent(new Event("load"));
        return;
      }
      return nativeSend_XML.apply(this, [body]);
    };
  }

  fetchApi().then(() => setInterval(solveQuestion, 100));
})();
