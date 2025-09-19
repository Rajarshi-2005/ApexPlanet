document.addEventListener('DOMContentLoaded', () => {

    // --- VIEW SWITCHING LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.dataset.target;
            views.forEach(view => {
                if (view.id === targetId) view.classList.add('active');
                else view.classList.remove('active');
            });
        });
    });

    // --- NEW DYNAMIC QUIZ SCRIPT ---
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // This function fetches new questions from the API
    async function fetchQuestions() {
        try {
            questionElement.innerHTML = "Loading new questions...";
            const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple'); // Fetches 5 multiple-choice questions
            const data = await response.json();
            
            // Reformat the API data to match our quiz structure
            questions = data.results.map(apiQuestion => {
                const formattedQuestion = {
                    question: apiQuestion.question,
                    answers: []
                };

                const answers = [...apiQuestion.incorrect_answers];
                // Insert the correct answer at a random position
                formattedQuestion.correctAnswer = apiQuestion.correct_answer;
                answers.splice(
                    Math.floor(Math.random() * (answers.length + 1)),
                    0,
                    apiQuestion.correct_answer
                );

                formattedQuestion.answers = answers.map(answerText => {
                    return { text: answerText, correct: answerText === formattedQuestion.correctAnswer }
                });

                return formattedQuestion;
            });

            startQuiz();
        } catch (error) {
            questionElement.innerHTML = "Sorry, couldn't load questions. Please try again later.";
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
        showQuestion();
    }

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        // The API text can have weird characters, so we need to decode it
        questionElement.innerHTML = decodeHTMLEntities((currentQuestionIndex + 1) + ". " + currentQuestion.question);
        
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = decodeHTMLEntities(answer.text);
            button.classList.add("btn");
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        nextButton.style.display = "none";
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        nextButton.style.display = "inline-flex";
    }
    
    function showScore() {
        resetState();
        questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "inline-flex";
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    nextButton.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            // "Play Again" will now fetch a brand new set of questions
            fetchQuestions();
        }
    });

    // Utility function to handle weird text characters from the API
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // --- JOKE GENERATOR SCRIPT ---
    const jokeBtn = document.getElementById('jokeBtn');
    const jokeSetupEl = document.getElementById('joke-setup');
    const jokePunchlineEl = document.getElementById('joke-punchline');
    const apiUrl = 'https://official-joke-api.appspot.com/random_joke';

    async function getJoke() {
        try {
            jokeSetupEl.textContent = 'Fetching a new joke...';
            jokePunchlineEl.textContent = '';
            const response = await fetch(apiUrl);
            const data = await response.json();
            jokeSetupEl.textContent = data.setup;
            jokePunchlineEl.textContent = data.punchline;
        } catch (error) {
            jokeSetupEl.textContent = 'Oops! Could not fetch a joke. Please try again.';
        }
    }
    jokeBtn.addEventListener('click', getJoke);

    // Initial load
    fetchQuestions(); // Start by fetching quiz questions
    getJoke(); // And fetch a joke
});