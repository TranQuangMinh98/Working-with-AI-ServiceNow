// Reusable Quiz Component for ServiceNow AI Agent Lessons

class Quiz {
  constructor(quizId, questions) {
    this.quizId = quizId;
    this.questions = questions;
    this.currentQuestion = 0;
    this.score = 0;
    this.answered = false;
  }

  render() {
    const container = document.getElementById(this.quizId);
    if (!container) return;

    container.innerHTML = this.getQuestionHTML();
    this.attachEventListeners();
  }

  getQuestionHTML() {
    const q = this.questions[this.currentQuestion];
    let html = `
      <div class="quiz-question">
        Question ${this.currentQuestion + 1} of ${this.questions.length}: ${q.question}
      </div>
    `;

    q.options.forEach((option, index) => {
      html += `
        <div class="quiz-option" data-index="${index}">
          ${option}
        </div>
      `;
    });

    html += `
      <div class="feedback" id="feedback-${this.quizId}"></div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button id="submit-${this.quizId}" style="
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          display: none;
        ">Submit Answer</button>

        <button id="next-${this.quizId}" style="
          background: var(--success-color);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          display: none;
        ">Next Question</button>
      </div>
    `;

    return html;
  }

  attachEventListeners() {
    const options = document.querySelectorAll(`#${this.quizId} .quiz-option`);
    const submitBtn = document.getElementById(`submit-${this.quizId}`);
    const nextBtn = document.getElementById(`next-${this.quizId}`);
    const feedback = document.getElementById(`feedback-${this.quizId}`);

    let selectedIndex = null;

    options.forEach(option => {
      option.addEventListener('click', () => {
        if (this.answered) return;

        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedIndex = parseInt(option.dataset.index);
        submitBtn.style.display = 'inline-block';
      });
    });

    submitBtn.addEventListener('click', () => {
      if (selectedIndex === null || this.answered) return;

      this.answered = true;
      const q = this.questions[this.currentQuestion];
      const isCorrect = selectedIndex === q.correct;

      if (isCorrect) {
        this.score++;
        options[selectedIndex].classList.add('correct');
        feedback.className = 'feedback correct show';
        feedback.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
      } else {
        options[selectedIndex].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedback.className = 'feedback incorrect show';
        feedback.innerHTML = `<strong>✗ Not quite.</strong> ${q.explanation}`;
      }

      submitBtn.style.display = 'none';

      if (this.currentQuestion < this.questions.length - 1) {
        nextBtn.style.display = 'inline-block';
      } else {
        this.showFinalScore();
      }
    });

    nextBtn.addEventListener('click', () => {
      this.currentQuestion++;
      this.answered = false;
      this.render();
    });
  }

  showFinalScore() {
    const container = document.getElementById(this.quizId);
    const percentage = Math.round((this.score / this.questions.length) * 100);

    let message = '';
    let bgClass = '';

    if (percentage >= 80) {
      message = 'Excellent work! You have a solid understanding of this concept.';
      bgClass = 'success';
    } else if (percentage >= 60) {
      message = 'Good effort! Review the material and try again to strengthen your understanding.';
      bgClass = 'note';
    } else {
      message = 'Keep practicing! Review the lesson content and try the quiz again.';
      bgClass = 'warning';
    }

    container.innerHTML = `
      <div class="${bgClass}" style="text-align: center; padding: 2rem;">
        <h3 style="margin-top: 0;">Quiz Complete!</h3>
        <p style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">
          ${this.score} / ${this.questions.length} (${percentage}%)
        </p>
        <p>${message}</p>
        <button onclick="location.reload()" style="
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        ">Retry Quiz</button>
      </div>
    `;
  }
}

// Helper function to initialize quiz
function initQuiz(quizId, questions) {
  const quiz = new Quiz(quizId, questions);
  quiz.render();
}
