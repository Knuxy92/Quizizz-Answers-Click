
(function() {
    const CONFIGS = {"Delay Click": 0, "Enabled Delay": false}

    const findGameId = () => {
        const allButtons = document.querySelectorAll('[data-testid="button-text"]');
        for (let el of allButtons) {
            const cleanText = el.innerText.replace(/\s/g, '');
            if (/^\d{6,}$/.test(cleanText)) {
                return cleanText;
            }
        }
        return null;
    };

    window.open(`https://api.cheatnetwork.eu/quizizz/${findGameId()}/answers`)

    const rawData = prompt(`https://api.cheatnetwork.eu/quizizz/${findGameId()}/answers\nCopy json Place Here : `);
    let quizData;
    try {
        quizData = JSON.parse(rawData);
        console.log("Loading Json Done");
    } catch (e) {
        return alert("Vaild Json");
    }

    function solveCurrentQuestion() {
        const questionEl = document.querySelector('#questionText .content-slot');
        if (!questionEl) return;

        const currentText = questionEl.innerText.trim();
        
        const matched = quizData.answers.find(q => {
            const cleanApiQ = q.question.replace(/<[^>]*>?/gm, '').trim();
            return cleanApiQ === currentText;
        });

        if (matched) {
            const correctIndex = matched.answer[0];
            const answerText = matched.options[correctIndex].text;
            
            const options = [...document.querySelectorAll('#optionText .content-slot')];
            const targetBtn = options.find(opt => opt.innerText.trim() === answerText.trim());

            if (targetBtn) {
                if (CONFIGS["Enabled Delay"]){
                    setTimeout(() => {
                        targetBtn.click();
                    }, CONFIGS["Delay Click"]);
                }else{
                    targetBtn.click();
                }
            }
        }
    }

    setInterval(() => {
        solveCurrentQuestion();
    }, 1000);
})();
