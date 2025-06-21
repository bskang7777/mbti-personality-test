const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionEl = document.getElementById('question');
const answerBtns = document.querySelectorAll('.answer-btn');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
const totalQuestions = data.questions.length;

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    for (const key in scores) {
        scores[key] = 0;
    }
    showQuestion();
}

function showQuestion() {
    updateProgressBar();
    const question = data.questions[currentQuestionIndex];
    questionEl.textContent = question.q;
    answerBtns[0].textContent = question.a[0].text;
    answerBtns[0].dataset.type = question.a[0].type;
    answerBtns[1].textContent = question.a[1].text;
    answerBtns[1].dataset.type = question.a[1].type;
}

function selectAnswer(type) {
    scores[type]++;
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        showQuestion();
    } else {
        showResult();
    }
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const mbtiType = 
        (scores.E > scores.I ? 'E' : 'I') +
        (scores.S > scores.N ? 'S' : 'N') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P');

    const result = data.results[mbtiType];
    
    document.getElementById('mbti-type').textContent = mbtiType;
    document.getElementById('description').textContent = result.description;
    document.getElementById('strengths').textContent = result.strengths;
    document.getElementById('weaknesses').textContent = result.weaknesses;
    document.getElementById('improvements').textContent = result.improvements;

    drawChart();
}

function drawChart() {
    const ctx = document.getElementById('result-chart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['외향(E)', '내향(I)', '감각(S)', '직관(N)', '사고(T)', '감정(F)', '판단(J)', '인식(P)'],
            datasets: [{
                label: '나의 성향',
                data: [scores.E, scores.I, scores.S, scores.N, scores.T, scores.F, scores.J, scores.P],
                backgroundColor: 'rgba(90, 62, 141, 0.2)',
                borderColor: 'rgba(90, 62, 141, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}


function restartQuiz() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    const chart = Chart.getChart("result-chart");
    if (chart) {
        chart.destroy();
    }
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
answerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => selectAnswer(e.target.dataset.type));
}); 