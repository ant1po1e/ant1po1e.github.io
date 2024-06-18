function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const phrases = ["Game Developer", "Desktop Developer", "Photographer", "Rhythm Gamer"];
const el = document.getElementById("typewriter");

let sleepTime = 100;

let curPhraseIndex = 0;

const writeLoop = async () => {
    while (true) {
        let curWord = phrases[curPhraseIndex];

        for (let i = 0; i < curWord.length; i++) {
            el.innerText = curWord.substring(0, i + 1);
            await sleep(sleepTime);
        }

        await sleep(sleepTime * 10);

        for (let i = curWord.length; i > 0; i--) {
            el.innerText = curWord.substring(0, i - 1);
            await sleep(sleepTime);
        }

        await sleep(sleepTime * 5);

        if (curPhraseIndex === phrases.length - 1) {
            curPhraseIndex = 0;
        } else {
            curPhraseIndex++;
        }
    }
};

writeLoop();


const home = document.querySelector("#home");
const project = document.querySelector("#project");
const contact = document.querySelector("#contact");

const projectBtn = document.querySelector("#project-btn");
const contactBtn = document.querySelector("#contact-btn")


projectBtn.addEventListener('click', function () {
    home.classList.add('hidden');
    home.classList.remove('flex');

    project.classList.add('flex');
    project.classList.remove('hidden');
});

contactBtn.addEventListener('click', function () {
    home.classList.add('hidden');
    home.classList.remove('flex');

    contact.classList.add('flex');
    contact.classList.remove('hidden');
});