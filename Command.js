(() => {
  "use strict";

  const CONFIGS = {
    "Delay Click": 5000,
    "Min Delay Click": 1500,
    "Enabled Delay": true,
    "Enabled Auto Click": false,
    // Legit Mode
    "Enabled Bold Font Answer": false,
    "Eanbled Show Answer Title": false,
    "Eanbled Show Answer Href": true,
  };

  const quizDatabase = new Map();
  const cleanText = (text) => {
    if (!text) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    return (tmp.textContent || tmp.innerText || "")
      .replace(/\s+/g, "")
      .trim()
      .toLowerCase();
  };

  const getStoreState = (storeName) => {
    const root =
      document.querySelector("#root") || document.querySelector("#app");
    const pinia = root?.__vue_app__?.config.globalProperties.$pinia;
    return pinia ? pinia._s.get(storeName)?.$state : null;
  };

  const fetchApi = async () => {
    try {
      const roomHash = getStoreState("gameData")?.roomHash;

      if (!roomHash)
        return console.warn(
          "Not Found roomHash from gameData store. Quiz database will not be loaded.",
        );

      const res = await fetch(
        `https://wayground.com/_api/main/game/${roomHash}`,
      );
      if (!res.ok) throw new Error("HTTP " + res.status);

      const resData = await res.json();
      const questions = resData?.data?.questions || [];

      questions.forEach((q) => {
        const IdQuestion = q._id;
        const answerRaw = q.structure?.answer;
        const options = q.structure?.options || [];
        const correctIndices = Array.isArray(answerRaw)
          ? answerRaw
          : typeof answerRaw === "number"
            ? [answerRaw]
            : [];

        const correctAnswers = correctIndices
          .map((idx) => (options[idx] ? cleanText(options[idx].text) : ""))
          .filter(Boolean);

        if (IdQuestion && correctAnswers.length > 0) {
          quizDatabase.set(IdQuestion, correctAnswers);
        }
      });
    } catch (err) {
      console.error("Fetch API Error:", err.message);
    }
  };

  const getCurrentQuestionId = () => {
    const gameQuestions = getStoreState("gameQuestions");
    if (gameQuestions) {
      const id =
        gameQuestions.currentId ||
        gameQuestions.currentQuestionId ||
        gameQuestions.cachedCurrentQuestionId;
      if (id) return id;
    }

    const gameFlow = getStoreState("gameFlow");
    if (gameFlow) {
      const id = gameFlow.currentQuestionId || gameFlow.cachedCurrentQuestionId;
      if (id) return id;
    }

    return null;
  };

  const getRandomDelay = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const solveQuestion = () => {
    if (quizDatabase.size === 0) return;

    const currentid = getCurrentQuestionId();
    if (!currentid) return;
    const Answers = quizDatabase.get(currentid);

    if (Answers) {
      const options = Array.from(
        document.querySelectorAll(
          '[role="option"], button[class*="option"], .is-selectable',
        ),
      );

      let btnIndex = 0;
      const targetBtn = options.find((opt) => {
        const slotEl = opt.querySelector("div.content-slot");
        if (!slotEl) return false;
        const currentText = slotEl.innerText.trim();
        btnIndex += 1;

        return Answers.includes(cleanText(currentText));
      });

      if (CONFIGS["Eanbled Show Answer Title"])
        document.title = "Playing a Game - Wayground " + btnIndex;

      if (CONFIGS["Eanbled Show Answer Href"]) {
        if (!window.location.href.endsWith(`A${btnIndex}`))
          history.pushState({}, "", `${window.location.href}A${btnIndex}`);
      }


      if (targetBtn && !targetBtn.dataset.botClicked) {
        if (CONFIGS["Enabled Bold Font Answer"]) {
          const FindText =
            targetBtn.querySelector("div.content-slot p") ||
            targetBtn.querySelector("div.content-slot");
          if (FindText) {
            FindText.style.setProperty("font-weight", "bold", "important");
          }
        }
        if (!CONFIGS["Enabled Auto Click"]) return;

        const clickAction = () => {
          targetBtn.click();
        };

        if (CONFIGS["Enabled Delay"]) {
          setTimeout(
            clickAction,
            getRandomDelay(CONFIGS["Min Delay Click"], CONFIGS["Delay Click"]),
          );
        } else {
          clickAction();
        }
      }
    }
  };

  fetchApi().then(() => {
    setInterval(solveQuestion, 100);
  });
})();
