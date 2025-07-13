
// Navigation functionality
function showSection(sectionId, clickedElement) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked tab
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
    
    // Initialize quiz if quiz section is selected
    if (sectionId === 'quiz') {
        initializeQuiz();
    }
}

// Practice exercise functionality
function checkAnswer(exerciseNumber, correctAnswer) {
    const userAnswer = document.getElementById(`answer${exerciseNumber}`).value.trim().toLowerCase();
    const feedback = document.getElementById(`feedback${exerciseNumber}`);
    const correct = correctAnswer.toLowerCase();
    
    // Simple answer checking (you could make this more sophisticated)
    const isCorrect = userAnswer === correct || 
                     userAnswer.includes(correct.replace(/[.,]/g, '')) ||
                     levenshteinDistance(userAnswer, correct) <= 3;
    
    if (isCorrect) {
        feedback.innerHTML = "✅ Correct! Well done!";
        feedback.className = "feedback correct";
    } else {
        feedback.innerHTML = `❌ Not quite right. The correct answer is: "${correctAnswer}"`;
        feedback.className = "feedback incorrect";
    }
    
    feedback.style.display = "block";
}

// Simple string similarity function
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Quiz functionality
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const quizQuestions = [
    {
        question: "When converting 'I am happy' to reported speech, which tense should 'am' become?",
        options: ["am", "was", "is", "were"],
        correct: 1
    },
    {
        question: "Which word typically introduces reported speech?",
        options: ["because", "that", "when", "if"],
        correct: 1
    },
    {
        question: "Convert: John said, 'I will go tomorrow.' What does 'will' become?",
        options: ["will", "would", "shall", "should"],
        correct: 1
    },
    {
        question: "In reported speech, 'yesterday' typically becomes:",
        options: ["yesterday", "the day before", "last day", "before day"],
        correct: 1
    },
    {
        question: "When reporting 'I have finished', the tense becomes:",
        options: ["I have finished", "he has finished", "he had finished", "he finished"],
        correct: 2
    }
];

function initializeQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    updateScoreDisplay();
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = `Question ${currentQuestion + 1}: ${question.question}`;
    }
    
    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectOption(index, optionDiv);
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    if (submitBtn) submitBtn.style.display = 'inline-block';
    if (nextBtn) nextBtn.style.display = 'none';
    selectedAnswer = null;
}

function selectOption(index, element) {
    // Remove selection from all options
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked option
    element.classList.add('selected');
    selectedAnswer = index;
}

function submitQuizAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer first!');
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.style.background = 'rgba(0, 184, 148, 0.8)';
            option.style.border = '2px solid #00b894';
        } else if (index === selectedAnswer && index !== question.correct) {
            option.style.background = 'rgba(255, 107, 107, 0.8)';
            option.style.border = '2px solid #ff6b6b';
        }
        option.style.pointerEvents = 'none';
    });
    
    if (selectedAnswer === question.correct) {
        score++;
        updateScoreDisplay();
    }
    
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    if (submitBtn) submitBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    displayQuestion();
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function showQuizResults() {
    const percentage = (score / quizQuestions.length) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = '🎉 Excellent! You have mastered reported speech!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Review the theory and try again to improve.';
    } else {
        message = '📚 Keep studying! Review the examples and theory sections.';
    }
    
    const quizQuestion = document.getElementById('quiz-question');
    if (quizQuestion) {
        quizQuestion.innerHTML = `
            <h3>Quiz Complete!</h3>
            <p style="font-size: 1.2rem; margin: 1rem 0;">${message}</p>
            <p style="font-size: 1.1rem;">Final Score: ${score}/${quizQuestions.length} (${percentage.toFixed(0)}%)</p>
            <button onclick="initializeQuiz()" style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 1rem; font-weight: 600; margin-top: 1rem;">
                Try Again
            </button>
        `;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show video section by default and set active tab
    const videoSection = document.getElementById('video');
    const videoTab = document.querySelector('.tab-btn');
    
    if (videoSection) {
        videoSection.classList.add('active');
    }
    if (videoTab) {
        videoTab.classList.add('active');
    }
});
