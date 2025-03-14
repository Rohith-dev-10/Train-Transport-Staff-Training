/**
 * TrainEd - Transport Staff Training Platform
 * Main JavaScript file for handling application functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
  });
  
  /**
  * Initialize the application
  */
  function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize modules data
    initModulesData();
    
    // Initialize testimonial slider
    initTestimonialSlider();
  
    // Show login modal for first-time users if not logged in
    checkLoginStatus();
  }
  
  /**
  * Check if user is logged in
  */
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('trainEd_isLoggedIn');
    
    if (!isLoggedIn) {
        // Show login modal after a short delay for first-time users
        setTimeout(() => {
            showModal('auth-modal');
        }, 2000);
    } else {
        // Update UI for logged-in user
        updateUserUI(JSON.parse(localStorage.getItem('trainEd_userData')));
    }
  }
  
  /**
  * Update UI for logged-in user
  */
  function updateUserUI(userData) {
    // Update user avatar and name if available
    const userAvatarElements = document.querySelectorAll('.user-avatar img');
    const userNameElements = document.querySelectorAll('.profile-basic-info h2');
    
    userAvatarElements.forEach(avatar => {
        avatar.src = userData.avatar || '/api/placeholder/32/32';
    });
    
    userNameElements.forEach(nameElement => {
        if (nameElement) {
            nameElement.textContent = userData.name || 'User';
        }
    });
    
    // Show logged-in content, hide logged-out content
    document.querySelectorAll('.logged-in-only').forEach(el => {
        el.classList.remove('hidden');
    });
    
    document.querySelectorAll('.logged-out-only').forEach(el => {
        el.classList.add('hidden');
    });
  }
  
  /**
  * Set up event listeners for various UI elements
  */
  function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // User menu
    setupUserMenu();
    
    // Dark mode toggle
    setupDarkModeToggle();
    
    // Auth modal
    setupAuthModal();
    
    // Module filters
    setupModuleFilters();
    
    // Module navigation
    setupModuleNavigation();
    
    // Quiz functionality
    setupQuizFunctionality();
    
    // Profile tabs
    setupProfileTabs();
    
    // Admin dashboard tabs
    setupAdminTabs();
  }
  
  /**
  * Set up navigation functionality
  */
  function setupNavigation() {
    // Main navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
            
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Homepage buttons
    const getStartedBtn = document.getElementById('get-started');
    const viewAllModulesBtn = document.getElementById('view-all-modules');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            navigateToPage('modules');
        });
    }
    
    if (viewAllModulesBtn) {
        viewAllModulesBtn.addEventListener('click', function() {
            navigateToPage('modules');
        });
    }
    
    // Module start buttons
    document.querySelectorAll('.module-start').forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            startModule(moduleId);
        });
    });
  }
  
  /**
  * Navigate to a specific page
  */
  function navigateToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update active state in navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Close mobile menu if open
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.add('hidden');
            
            // Reset mobile menu toggle icon
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
  }
  
  /**
  * Start a module
  */
  function startModule(moduleId) {
    // Get module data
    const moduleData = getModuleData(moduleId);
    
    if (moduleData) {
        // Set module data in view
        document.getElementById('module-title').textContent = moduleData.title;
        document.getElementById('module-level').textContent = moduleData.level;
        document.getElementById('module-duration').textContent = moduleData.duration;
        document.getElementById('module-lessons').textContent = `${moduleData.lessons.length} lessons`;
        document.getElementById('module-quizzes').textContent = `${moduleData.quizzes.length} quiz${moduleData.quizzes.length > 1 ? 'zes' : ''}`;
        
        // Set progress
        const progressValue = moduleData.progress || 0;
        document.getElementById('module-progress-value').textContent = `${progressValue}%`;
        document.getElementById('module-progress-bar').style.width = `${progressValue}%`;
        
        // Build module sections
        const sectionsList = document.getElementById('module-sections');
        sectionsList.innerHTML = '';
        
        moduleData.lessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            li.textContent = lesson.title;
            li.setAttribute('data-section', index);
            
            if (index === 0) {
                li.classList.add('active');
            }
            
            if (lesson.completed) {
                li.classList.add('completed');
            }
            
            li.addEventListener('click', function() {
                changeLessonSection(moduleId, parseInt(this.getAttribute('data-section')));
            });
            
            sectionsList.appendChild(li);
        });
        
        // Add quiz sections
        moduleData.quizzes.forEach((quiz, index) => {
            const li = document.createElement('li');
            li.textContent = quiz.title;
            li.setAttribute('data-quiz', index);
            
            if (quiz.completed) {
                li.classList.add('completed');
            }
            
            li.addEventListener('click', function() {
                startQuiz(moduleId, parseInt(this.getAttribute('data-quiz')));
            });
            
            sectionsList.appendChild(li);
        });
        
        // Load first section content
        changeLessonSection(moduleId, 0);
        
        // Navigate to module view
        navigateToPage('module-view');
    }
  }
  
  /**
  * Change lesson section
  */
  function changeLessonSection(moduleId, sectionIndex) {
    const moduleData = getModuleData(moduleId);
    
    if (moduleData && moduleData.lessons[sectionIndex]) {
        // Update active section
        document.querySelectorAll('.module-sections li').forEach(li => {
            li.classList.remove('active');
        });
        
        document.querySelector(`.module-sections li[data-section="${sectionIndex}"]`).classList.add('active');
        
        // Update section content
        const sectionContent = document.getElementById('module-section-content');
        const lesson = moduleData.lessons[sectionIndex];
        
        sectionContent.innerHTML = `
            <h2>${lesson.title}</h2>
            <div class="lesson-content">
                ${lesson.content}
            </div>
        `;
        
        // Update navigation buttons
        const prevButton = document.getElementById('prev-section');
        const nextButton = document.getElementById('next-section');
        
        prevButton.disabled = sectionIndex === 0;
        
        if (sectionIndex === moduleData.lessons.length - 1) {
            // If this is the last lesson, next button should start the quiz
            nextButton.textContent = 'Start Quiz';
            nextButton.innerHTML = 'Take Quiz <i class="fas fa-tasks"></i>';
            nextButton.onclick = function() {
                startQuiz(moduleId, 0);
            };
        } else {
            // Otherwise, next button should go to the next lesson
            nextButton.textContent = 'Next';
            nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
            nextButton.onclick = function() {
                changeLessonSection(moduleId, sectionIndex + 1);
            };
        }
        
        // Update previous button click handler
        prevButton.onclick = function() {
            changeLessonSection(moduleId, sectionIndex - 1);
        };
        
        // Mark lesson as viewed in local storage
        if (moduleData.lessons[sectionIndex]) {
            moduleData.lessons[sectionIndex].viewed = true;
            updateModuleProgress(moduleId);
            saveModuleData(moduleId, moduleData);
        }
    }
  }
  
  /**
  * Start a quiz
  */
  function startQuiz(moduleId, quizIndex) {
    const moduleData = getModuleData(moduleId);
    
    if (moduleData && moduleData.quizzes[quizIndex]) {
        const quiz = moduleData.quizzes[quizIndex];
        
        // Update quiz header
        document.getElementById('quiz-title').textContent = quiz.title;
        document.getElementById('quiz-question-count').innerHTML = `<i class="fas fa-question-circle"></i> ${quiz.questions.length} Questions`;
        document.getElementById('quiz-time-limit').innerHTML = `<i class="far fa-clock"></i> ${quiz.timeLimit} Minutes`;
        document.getElementById('quiz-passing-score').innerHTML = `<i class="fas fa-check-circle"></i> ${quiz.passingScore}% to Pass`;
        
        document.getElementById('total-questions').textContent = quiz.questions.length;
        
        // Initialize quiz state
        window.quizState = {
            moduleId,
            quizIndex,
            currentQuestion: 0,
            answers: [],
            completed: false
        };
        
        // Load first question
        loadQuizQuestion(0);
        
        // Hide quiz results, show quiz content
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        
        // Update quiz navigation buttons
        updateQuizNavigation();
        
        // Navigate to quiz view
        navigateToPage('quiz-view');
    }
  }
  
  /**
  * Load a quiz question
  */
  function loadQuizQuestion(questionIndex) {
    const moduleData = getModuleData(window.quizState.moduleId);
    const quiz = moduleData.quizzes[window.quizState.quizIndex];
    
    if (quiz && quiz.questions[questionIndex]) {
        const question = quiz.questions[questionIndex];
        
        // Update question number
        document.getElementById('current-question').textContent = questionIndex + 1;
        
        // Update progress bar
        const progressPercentage = ((questionIndex + 1) / quiz.questions.length) * 100;
        document.getElementById('quiz-progress-bar').style.width = `${progressPercentage}%`;
        
        // Build question content
        const quizContent = document.getElementById('quiz-content');
        
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h3>${question.text}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option${window.quizState.answers[questionIndex] === index ? ' selected' : ''}" data-option="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners to options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                selectQuizOption(parseInt(this.getAttribute('data-option')));
            });
        });
    }
  }
  
  /**
  * Select a quiz option
  */
  function selectQuizOption(optionIndex) {
    // Update UI
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`.quiz-option[data-option="${optionIndex}"]`).classList.add('selected');
      
      // Save the answer
      window.quizState.answers[window.quizState.currentQuestion] = optionIndex;
      
      // Enable next button if it was disabled
      document.getElementById('next-question').disabled = false;
  }
  
  /**
   * Update quiz navigation buttons
   */
  function updateQuizNavigation() {
      const moduleData = getModuleData(window.quizState.moduleId);
      const quiz = moduleData.quizzes[window.quizState.quizIndex];
      const currentQuestion = window.quizState.currentQuestion;
      
      const prevButton = document.getElementById('prev-question');
      const nextButton = document.getElementById('next-question');
      const submitButton = document.getElementById('submit-quiz');
      
      // Previous button
      prevButton.disabled = currentQuestion === 0;
      
      // Next/Submit buttons
      if (currentQuestion === quiz.questions.length - 1) {
          // Last question, show submit button instead of next
          nextButton.style.display = 'none';
          submitButton.style.display = 'block';
      } else {
          nextButton.style.display = 'block';
          submitButton.style.display = 'none';
          
          // Disable next button if no answer selected
          nextButton.disabled = window.quizState.answers[currentQuestion] === undefined;
      }
  }
  
  /**
   * Setup quiz functionality
   */
  function setupQuizFunctionality() {
      const prevButton = document.getElementById('prev-question');
      const nextButton = document.getElementById('next-question');
      const submitButton = document.getElementById('submit-quiz');
      
      if (prevButton) {
          prevButton.addEventListener('click', function() {
              if (window.quizState && window.quizState.currentQuestion > 0) {
                  window.quizState.currentQuestion--;
                  loadQuizQuestion(window.quizState.currentQuestion);
                  updateQuizNavigation();
              }
          });
      }
      
      if (nextButton) {
          nextButton.addEventListener('click', function() {
              if (window.quizState) {
                  window.quizState.currentQuestion++;
                  loadQuizQuestion(window.quizState.currentQuestion);
                  updateQuizNavigation();
              }
          });
      }
      
      if (submitButton) {
          submitButton.addEventListener('click', function() {
              submitQuiz();
          });
      }
      
      // Quiz review buttons
      const reviewQuizButton = document.getElementById('review-quiz');
      const continueModuleButton = document.getElementById('continue-module');
      
      if (reviewQuizButton) {
          reviewQuizButton.addEventListener('click', function() {
              // Show review of quiz questions with correct/incorrect answers
              showQuizReview();
          });
      }
      
      if (continueModuleButton) {
          continueModuleButton.addEventListener('click', function() {
              // Return to module view
              navigateToPage('module-view');
          });
      }
      
      // Back to modules button
      const backToModulesButton = document.getElementById('back-to-modules');
      if (backToModulesButton) {
          backToModulesButton.addEventListener('click', function() {
              navigateToPage('modules');
          });
      }
  }
  
  /**
   * Submit quiz
   */
  function submitQuiz() {
      const moduleData = getModuleData(window.quizState.moduleId);
      const quiz = moduleData.quizzes[window.quizState.quizIndex];
      
      // Calculate score
      let correctAnswers = 0;
      
      window.quizState.answers.forEach((answer, index) => {
          if (answer === quiz.questions[index].correctAnswer) {
              correctAnswers++;
          }
      });
      
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;
      
      // Update UI
      document.getElementById('score-percentage').textContent = `${score}%`;
      document.getElementById('correct-answers').textContent = correctAnswers;
      document.getElementById('total-questions-result').textContent = quiz.questions.length;
      
      const resultStatus = document.getElementById('result-status');
      if (passed) {
          resultStatus.innerHTML = `
              <div class="status-icon passed">
                  <i class="fas fa-check-circle"></i>
              </div>
              <h3>Passed!</h3>
              <p>Congratulations! You've successfully completed this quiz.</p>
          `;
      } else {
          resultStatus.innerHTML = `
              <div class="status-icon failed">
                  <i class="fas fa-times-circle"></i>
              </div>
              <h3>Not Passed</h3>
              <p>You didn't reach the required score. Please review the material and try again.</p>
          `;
      }
      
      // Build feedback
      const resultsFeedback = document.getElementById('results-feedback');
      resultsFeedback.innerHTML = `
          <h3>Feedback</h3>
          <p>${quiz.feedbackMessages[passed ? 'pass' : 'fail']}</p>
      `;
      
      // Hide quiz content, show results
      document.getElementById('quiz-content').style.display = 'none';
      document.getElementById('quiz-results').style.display = 'block';
      
      // Save quiz result
      if (moduleData && moduleData.quizzes[window.quizState.quizIndex]) {
          moduleData.quizzes[window.quizState.quizIndex].completed = true;
          moduleData.quizzes[window.quizState.quizIndex].score = score;
          moduleData.quizzes[window.quizState.quizIndex].passed = passed;
          
          updateModuleProgress(window.quizState.moduleId);
          saveModuleData(window.quizState.moduleId, moduleData);
      }
      
      // Update progress tracking
      updateProgressTracking(window.quizState.moduleId, score, passed);
  }
  
  /**
   * Show quiz review
   */
  function showQuizReview() {
      const moduleData = getModuleData(window.quizState.moduleId);
      const quiz = moduleData.quizzes[window.quizState.quizIndex];
      
      const resultsFeedback = document.getElementById('results-feedback');
      resultsFeedback.innerHTML = `<h3>Review</h3>`;
      
      quiz.questions.forEach((question, index) => {
          const userAnswer = window.quizState.answers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          resultsFeedback.innerHTML += `
              <div class="quiz-review-item">
                  <h4>Question ${index + 1}</h4>
                  <p>${question.text}</p>
                  <div class="quiz-review-answers">
                      <div class="quiz-review-answer ${isCorrect ? 'correct' : 'incorrect'}">
                          <div class="answer-label">Your Answer:</div>
                          <div class="answer-text">${question.options[userAnswer]}</div>
                      </div>
                      ${!isCorrect ? `
                          <div class="quiz-review-answer correct">
                              <div class="answer-label">Correct Answer:</div>
                              <div class="answer-text">${question.options[question.correctAnswer]}</div>
                          </div>
                      ` : ''}
                  </div>
                  ${question.explanation ? `
                      <div class="quiz-explanation">
                          <h5>Explanation</h5>
                          <p>${question.explanation}</p>
                      </div>
                  ` : ''}
              </div>
          `;
      });
  }
  
  /**
   * Update progress tracking
   */
  function updateProgressTracking(moduleId, score, passed) {
      // Get current progress data
      let progressData = JSON.parse(localStorage.getItem('trainEd_progressData')) || {
          modulesStarted: [],
          modulesCompleted: [],
          quizzesPassed: [],
          scores: []
      };
      
      // Update scores
      progressData.scores.push({
          moduleId,
          score,
          timestamp: new Date().toISOString()
      });
      
      // Update modules started
      if (!progressData.modulesStarted.includes(moduleId)) {
          progressData.modulesStarted.push(moduleId);
      }
      
      // Update quizzes passed
      if (passed) {
          const quizPassKey = `${moduleId}_${window.quizState.quizIndex}`;
          if (!progressData.quizzesPassed.includes(quizPassKey)) {
              progressData.quizzesPassed.push(quizPassKey);
          }
          
          // Check if all quizzes for this module are passed
          const moduleData = getModuleData(moduleId);
          const allQuizzesPassed = moduleData.quizzes.every(quiz => quiz.passed);
          
          if (allQuizzesPassed && !progressData.modulesCompleted.includes(moduleId)) {
              progressData.modulesCompleted.push(moduleId);
          }
      }
      
      // Save updated progress
      localStorage.setItem('trainEd_progressData', JSON.stringify(progressData));
      
      // Update Progress UI if the page exists
      updateProgressUI();
  }
  
  /**
   * Update progress UI
   */
  function updateProgressUI() {
      const progressPage = document.getElementById('progress');
      if (!progressPage) return;
      
      // Get progress data
      const progressData = JSON.parse(localStorage.getItem('trainEd_progressData')) || {
          modulesStarted: [],
          modulesCompleted: [],
          quizzesPassed: [],
          scores: []
      };
      
      // Get all modules
      const modules = getAllModules();
      
      // Update stats
      document.querySelector('.progress-stats .stat-card:nth-child(1) .stat-value').textContent = 
          `${progressData.modulesStarted.length} / ${modules.length}`;
      
      document.querySelector('.progress-stats .stat-card:nth-child(2) .stat-value').textContent = 
          `${progressData.modulesCompleted.length} / ${modules.length}`;
      
      // Calculate total quizzes
      let totalQuizzes = 0;
      modules.forEach(module => {
          totalQuizzes += module.quizzes.length;
      });
      
      document.querySelector('.progress-stats .stat-card:nth-child(3) .stat-value').textContent = 
          `${progressData.quizzesPassed.length} / ${totalQuizzes}`;
      
      // Calculate average score
      let averageScore = 0;
      if (progressData.scores.length > 0) {
          const sum = progressData.scores.reduce((total, item) => total + item.score, 0);
          averageScore = Math.round(sum / progressData.scores.length);
      }
      
      document.querySelector('.progress-stats .stat-card:nth-child(4) .stat-value').textContent = 
          `${averageScore}%`;
      
      // Update overall progress
      const overallProgress = Math.round((progressData.modulesCompleted.length / modules.length) * 100);
      document.querySelector('.progress-circle').style.setProperty('--progress', `${overallProgress}%`);
      document.querySelector('.progress-percentage').textContent = `${overallProgress}%`;
      
      // Update module progress list
      updateModuleProgressList(modules, progressData);
      
      // Update assessment history
      updateAssessmentHistory(progressData);
  }
  
  /**
   * Update module progress list
   */
  function updateModuleProgressList(modules, progressData) {
      const moduleProgressItems = document.querySelector('.module-progress-items');
      if (!moduleProgressItems) return;
      
      moduleProgressItems.innerHTML = '';
      
      modules.forEach(module => {
          const moduleProgress = calculateModuleProgress(module.id);
          const isCompleted = progressData.modulesCompleted.includes(module.id);
          const isStarted = progressData.modulesStarted.includes(module.id);
          
          moduleProgressItems.innerHTML += `
              <div class="module-progress-item">
                  <div class="module-info">
                      <h4>${module.title}</h4>
                      <div class="module-meta">
                          <span class="module-level ${module.level.toLowerCase()}">${module.level}</span>
                      </div>
                  </div>
                  <div class="module-progress-details">
                      <div class="progress-bar-container">
                          <div class="progress-bar" style="width: ${moduleProgress}%"></div>
                      </div>
                      <div class="progress-text">${isCompleted ? 'Completed' : isStarted ? `${moduleProgress}% Completed` : 'Not Started'}</div>
                  </div>
                  <div class="module-actions">
                      ${isCompleted ? `
                          <button class="btn btn-outline btn-sm module-start" data-module="${module.id}">Review</button>
                          <a href="#" class="certificate-link"><i class="fas fa-certificate"></i> Certificate</a>
                      ` : isStarted ? `
                          <button class="btn btn-primary btn-sm module-start" data-module="${module.id}">Continue</button>
                      ` : `
                          <button class="btn btn-secondary btn-sm module-start" data-module="${module.id}">Start</button>
                      `}
                  </div>
              </div>
          `;
      });
      
      // Re-attach event listeners
      document.querySelectorAll('.module-start').forEach(button => {
          button.addEventListener('click', function() {
              const moduleId = this.getAttribute('data-module');
              startModule(moduleId);
          });
      });
  }
  
  /**
   * Update assessment history
   */
  function updateAssessmentHistory(progressData) {
      const assessmentTable = document.querySelector('.assessment-table tbody');
      if (!assessmentTable) return;
      
      assessmentTable.innerHTML = '';
      
      // Get recent quiz attempts
      const quizAttempts = progressData.scores.slice(-10).reverse();
      
      quizAttempts.forEach(attempt => {
          const moduleData = getModuleData(attempt.moduleId);
          const date = new Date(attempt.timestamp).toLocaleDateString();
          const isPassed = attempt.score >= 70; // Assuming 70% is passing
          
          assessmentTable.innerHTML += `
              <tr>
                  <td>${moduleData ? moduleData.title : 'Unknown'} Quiz</td>
                  <td>${date}</td>
                  <td>${attempt.score}%</td>
                  <td><span class="status-badge ${isPassed ? 'passed' : 'failed'}">${isPassed ? 'Passed' : 'Failed'}</span></td>
                  <td><button class="btn btn-outline btn-sm">Review</button></td>
              </tr>
          `;
      });
  }
  
  /**
   * Set up user menu
   */
  function setupUserMenu() {
      const userMenuTrigger = document.getElementById('user-menu-trigger');
      const userMenu = document.getElementById('user-menu');
      
      if (userMenuTrigger && userMenu) {
          userMenuTrigger.addEventListener('click', function() {
              userMenu.classList.toggle('hidden');
          });
          
          // Close menu when clicking outside
          document.addEventListener('click', function(e) {
              if (!userMenuTrigger.contains(e.target) && !userMenu.contains(e.target)) {
                  userMenu.classList.add('hidden');
              }
          });
          
          // Logout buttons
          const logoutButtons = document.querySelectorAll('#logout-button, #mobile-logout');
          logoutButtons.forEach(button => {
              button.addEventListener('click', function(e) {
                  e.preventDefault();
                  logout();
              });
          });
      }
  }
  
  /**
   * Logout function
   */
  function logout() {
      // Clear user data
      localStorage.removeItem('trainEd_isLoggedIn');
      localStorage.removeItem('trainEd_userData');
      
      // Redirect to home
      navigateToPage('home');
      
      // Show login modal
      showModal('auth-modal');
      
      // Update UI for logged-out state
      document.querySelectorAll('.logged-in-only').forEach(el => {
          el.classList.add('hidden');
      });
      
      document.querySelectorAll('.logged-out-only').forEach(el => {
          el.classList.remove('hidden');
      });
  }
  
  /**
   * Set up dark mode toggle
   */
  function setupDarkModeToggle() {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      
      if (darkModeToggle) {
          darkModeToggle.addEventListener('click', function() {
              toggleDarkMode();
          });
      }
  }
  
  /**
   * Initialize dark mode based on user preference or system preference
   */
  function initDarkMode() {
      const savedMode = localStorage.getItem('trainEd_darkMode');
      
      if (savedMode === 'dark') {
          enableDarkMode();
      } else if (savedMode === 'light') {
          disableDarkMode();
      } else {
          // Check system preference
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              enableDarkMode();
          }
      }
      
      // Listen for system preference changes
      if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
              if (!localStorage.getItem('trainEd_darkMode')) {
                  if (e.matches) {
                      enableDarkMode();
                  } else {
                      disableDarkMode();
                  }
              }
          });
      }
  }
  
  /**
   * Toggle dark mode
   */
  function toggleDarkMode() {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
          disableDarkMode();
      } else {
          enableDarkMode();
      }
  }
  
  /**
   * Enable dark mode
   */
  function enableDarkMode() {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('trainEd_darkMode', 'dark');
      
      // Update dark mode toggle icon
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
          const icon = darkModeToggle.querySelector('i');
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
      }
  }
  
  /**
   * Disable dark mode
   */
  function disableDarkMode() {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('trainEd_darkMode', 'light');
      
      // Update dark mode toggle icon
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
          const icon = darkModeToggle.querySelector('i');
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
      }
  }
  
  /**
   * Set up auth modal
   */
  function setupAuthModal() {
      // Tab switching
      document.querySelectorAll('.tab-header').forEach(tab => {
          tab.addEventListener('click', function() {
              const tabId = this.getAttribute('data-tab');
              
              // Update active tab header
              document.querySelectorAll('.tab-header').forEach(t => {
                  t.classList.remove('active');
              });
              this.classList.add('active');
              
              // Update active tab content
              document.querySelectorAll('.tab-pane').forEach(pane => {
                  pane.classList.remove('active');
              });
              document.getElementById(tabId).classList.add('active');
          });
      });
      
      // Close modal
      document.querySelectorAll('.close-modal').forEach(closeBtn => {
          closeBtn.addEventListener('click', function() {
              const modal = this.closest('.modal');
              hideModal(modal.id);
          });
      });
      
      // Close modal when clicking outside
      document.querySelectorAll('.modal').forEach(modal => {
          modal.addEventListener('click', function(e) {
              if (e.target === this) {
                  hideModal(this.id);
              }
          });
      });
      
      // Login form submission
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
          loginForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              const email = document.getElementById('login-email').value;
              const password = document.getElementById('login-password').value;
              
              // Simple validation
              if (email && password) {
                  // For demo purposes, always succeed
                  loginSuccess({
                      name: 'John Doe',
                      email: email,
                      avatar: '/api/placeholder/150/150',
                      role: 'learner'
                  });
              }
          });
      }
      
      // Register form submission
      const registerForm = document.getElementById('register-form');
      if (registerForm) {
          registerForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              const name = document.getElementById('register-name').value;
              const email = document.getElementById('register-email').value;
              const password = document.getElementById('register-password').value;
              const confirmPassword = document.getElementById('register-confirm-password').value;
              
              // Simple validation
              if (name && email && password && password === confirmPassword) {
                  // For demo purposes, always succeed
                  loginSuccess({
                      name: name,
                      email: email,
                      avatar: '/api/placeholder/150/150',
                      role: 'learner'
                  });
              }
          });
      }
  }
  
  /**
   * Show modal
   */
  function showModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
          modal.style.display = 'flex';
      }
  }
  
  /**
   * Hide modal
   */
  function hideModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
          modal.style.display = 'none';
      }
  }
  
  /**
   * Handle successful login
   */
  function loginSuccess(userData) {
      // Save user data
      localStorage.setItem('trainEd_isLoggedIn', 'true');
      localStorage.setItem('trainEd_userData', JSON.stringify(userData));
      
      // Update UI
      updateUserUI(userData);
      
      // Hide modal
      hideModal('auth-modal');
      
      // Show welcome message
      // This would be implemented with a toast or notification system
      alert(`Welcome, ${userData.name}!`);
  }
  
  /**
   * Set up module filters
   */
  function setupModuleFilters() {
      const moduleSearch = document.getElementById('module-search');
      const levelFilter = document.getElementById('level-filter');
      const categoryFilter = document.getElementById('category-filter');
      const durationFilter = document.getElementById('duration-filter');
      
      const filterFunctions = {
          search: function(term) {
              document.querySelectorAll('.module-item').forEach(module => {
                  const title = module.querySelector('h3').textContent.toLowerCase();
                  const description = module.querySelector('p').textContent.toLowerCase();
                  
                  if (title.includes(term.toLowerCase()) || description.includes(term.toLowerCase())) {
                      module.style.display = '';
                  } else {
                      module.style.display = 'none';
                  }
              });
          },
          
          level: function(level) {
              if (level === 'all') {
                  document.querySelectorAll('.module-item').forEach(module => {
                      module.style.display = '';
                  });
              } else {
                  document.querySelectorAll('.module-item').forEach(module => {
                      if (module.getAttribute('data-level') === level) {
                          module.style.display = '';
                      } else {
                          module.style.display = 'none';
                      }
                  });
              }
          },
          
          category: function(category) {
              if (category === 'all') {
                  document.querySelectorAll('.module-item').forEach(module => {
                      module.style.display = '';
                  });
              } else {
                  document.querySelectorAll('.module-item').forEach(module => {
                      if (module.getAttribute('data-category') === category) {
                          module.style.display = '';
                      } else {
                          module.style.display = 'none';
                      }
                  });
              }
          },
          
          duration: function(duration) {
              if (duration === 'all') {
                  document.querySelectorAll('.module-item').forEach(module => {
                      module.style.display = '';
                  });
              } else {
                  document.querySelectorAll('.module-item').forEach(module => {
                      if (module.getAttribute('data-duration') === duration) {
                          module.style.display = '';
                      } else {
                          module.style.display = 'none';
                      }
                  });
              }
          }
      };
      
      if (moduleSearch) {
          moduleSearch.addEventListener('input', function() {
              filterFunctions.search(this.value);
              checkNoResults();
          });
      }
      
      if (levelFilter) {
          levelFilter.addEventListener('change', function() {
              filterFunctions.level(this.value);
              checkNoResults();
          });
      }
      
      if (categoryFilter) {
          categoryFilter.addEventListener('change', function() {
              filterFunctions.category(this.value);
              checkNoResults();
          });
      }
      
      if (durationFilter) {
          durationFilter.addEventListener('change', function() {
              filterFunctions.duration(this.value);
              checkNoResults();
          });
      }
  }
  
  /**
   * Check if no modules are visible after filtering
   */
  function checkNoResults() {
      const visibleModules = Array.from(document.querySelectorAll('.module-item')).filter(module => {
          return module.style.display !== 'none';
      });
      
      const noResults = document.getElementById('no-results');
      
      if (visibleModules.length === 0) {
          noResults.classList.remove('hidden');
      } else {
          noResults.classList.add('hidden');
      }
  }
  
  /**
   * Set up module navigation
   */
  function setupModuleNavigation() {
      // Already implemented in setupNavigation and startModule functions
  }
  
  /**
   * Set up profile tabs
   */
  function setupProfileTabs() {
      const profileNav = document.querySelectorAll('.profile-nav li');
      
      profileNav.forEach(tab => {
          tab.addEventListener('click', function() {
              const targetSection = this.getAttribute('data-target');
              
              // Update active tab
              profileNav.forEach(t => {
                  t.classList.remove('active');
              });
              this.classList.add('active');
              
              // Update active section
              document.querySelectorAll('.profile-section').forEach(section => {
                  section.classList.remove('active');
              });
              document.getElementById(targetSection).classList.add('active');
          });
      });
  }
  
  /**
   * Set up admin tabs
   */
  function setupAdminTabs() {
      // Main admin tabs
      document.querySelectorAll('.admin-tabs .tab-header').forEach(tab => {
          tab.addEventListener('click', function() {
              const tabId = this.getAttribute('data-tab');
              
              // Update active tab header
              document.querySelectorAll('.admin-tabs .tab-header').forEach(t => {
                  t.classList.remove('active');
              });
              this.classList.add('active');
              
              // Update active tab content
              document.querySelectorAll('.admin-tabs .tab-pane').forEach(pane => {
                  pane.classList.remove('active');
              });
              document.getElementById(tabId).classList.add('active');
          });
      });
      
      // Content management tabs
      document.querySelectorAll('.content-tab-nav li').forEach(tab => {
          tab.addEventListener('click', function() {
              const tabId = this.getAttribute('data-content-tab');
              
              // Update active tab
              document.querySelectorAll('.content-tab-nav li').forEach(t => {
                  t.classList.remove('active');
              });
              this.classList.add('active');
              
              // Update active content
              document.querySelectorAll('.content-tab-pane').forEach(pane => {
                  pane.classList.remove('active');
              });
              document.getElementById(tabId).classList.add('active');
          });
      });
  }
  
  /**
   * Initialize testimonial slider
   */
  function initTestimonialSlider() {
      let currentSlide = 0;
      const slides = document.querySelectorAll('.testimonial-slide');
      const indicators = document.querySelectorAll('.testimonial-indicators span');
      const prevButton = document.querySelector('.testimonial-prev');
      const nextButton = document.querySelector('.testimonial-next');
      
      if (!slides.length) return;
      
      function showSlide(index) {
          // Update slides
          slides.forEach(slide => {
              slide.classList.remove('active');
          });
          slides[index].classList.add('active');
          
          // Update indicators
          indicators.forEach(indicator => {
              indicator.classList.remove('active');
          });
          indicators[index].classList.add('active');
          
          // Update current slide index
          currentSlide = index;
      }
      
      // Event listeners for navigation
      if (prevButton) {
          prevButton.addEventListener('click', function() {
              let newIndex = currentSlide - 1;
              if (newIndex < 0) {
                  newIndex = slides.length - 1;
              }
              showSlide(newIndex);
          });
      }
      
      if (nextButton) {
          nextButton.addEventListener('click', function() {
              let newIndex = currentSlide + 1;
              if (newIndex >= slides.length) {
                  newIndex = 0;
              }
              showSlide(newIndex);
          });
      }
      
      // Event listeners for indicators
      indicators.forEach(indicator => {
          indicator.addEventListener('click', function() {
              const slideIndex = parseInt(this.getAttribute('data-slide'));
              showSlide(slideIndex);
          });
      });
      
      // Auto advance slides
      setInterval(() => {
          let newIndex = currentSlide + 1;
          if (newIndex >= slides.length) {
              newIndex = 0;
          }
          showSlide(newIndex);
      }, 5000);
  }
  
  /**
   * Initialize modules data
   */
  function initModulesData() {
      // Check if modules data already exists in localStorage
      if (!localStorage.getItem('trainEd_modules')) {
          // Create default modules data
          const defaultModules = [
              {
                  id: 'pre-checks',
                  title: 'Pre-Checks prior to driving the vehicle',
                  level: 'Beginner',
                  duration: '30 mins',
                  progress: 0,
                  description: 'Essential vehicle inspection procedures to ensure roadworthiness and safety before operation.',
                  lessons: [
                      {
                          title: 'Introduction to Pre-Drive Inspections',
                          content: `
                              <div class="lesson-content">
                                  <pclass="lesson-text">Pre-drive inspections are critical for ensuring vehicle safety and preventing breakdowns. In this lesson, we'll cover the importance of pre-drive checks and the basic framework for conducting them.</p>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="Pre-drive inspection">
                                  </div>
                                  <h3>Why Pre-Drive Checks Matter</h3>
                                  <ul>
                                      <li>Prevents accidents and breakdowns</li>
                                      <li>Extends vehicle life and reduces maintenance costs</li>
                                      <li>Ensures regulatory compliance</li>
                                      <li>Provides confidence in vehicle performance</li>
                                  </ul>
                                  <p>All professional drivers should develop a systematic approach to vehicle inspections. This ensures nothing important is missed and creates a consistent safety routine.</p>
                                  <div class="lesson-video">
                                      <img src="/api/placeholder/600/400" alt="Video placeholder">
                                  </div>
                                  <p>In the following lessons, we'll break down the specific areas you need to check before driving any transport vehicle.</p>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      },
                      {
                          title: 'External Vehicle Inspection',
                          content: `
                              <div class="lesson-content">
                                  <p class="lesson-text">A thorough external inspection is your first line of defense in preventing accidents. This lesson covers all external components that should be checked before operation.</p>
                                  <h3>External Inspection Checklist</h3>
                                  <div class="checklist">
                                      <div class="checklist-item">
                                          <input type="checkbox" id="check1">
                                          <label for="check1">Check all lights (headlights, indicators, brake lights, reverse lights)</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="check2">
                                          <label for="check2">Inspect tire condition and pressure</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="check3">
                                          <label for="check3">Check for fluid leaks under the vehicle</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="check4">
                                          <label for="check4">Examine windshield, windows, and mirrors for cracks or obstructions</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="check5">
                                          <label for="check5">Verify all doors and compartments are secure</label>
                                      </div>
                                  </div>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="External inspection">
                                  </div>
                                  <h3>Tire Inspection Details</h3>
                                  <p>Proper tire maintenance is crucial for safety. Check:</p>
                                  <ul>
                                      <li>Tread depth (minimum 1.6mm)</li>
                                      <li>Tire pressure (refer to vehicle manual)</li>
                                      <li>Signs of damage or uneven wear</li>
                                      <li>Foreign objects embedded in tires</li>
                                  </ul>
                                  <p>Remember to document any issues found during your inspection in the vehicle log.</p>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      },
                      {
                          title: 'Under-Hood Inspection',
                          content: `
                              <div class="lesson-content">
                                  <p class="lesson-text">The under-hood inspection ensures your vehicle's critical systems are functioning properly. This lesson details what to check under the hood before each trip.</p>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="Under-hood inspection">
                                  </div>
                                  <h3>Under-Hood Inspection Points</h3>
                                  <div class="check-list-container">
                                      <div class="check-item">
                                          <h4>Fluid Levels</h4>
                                          <ul>
                                              <li>Engine oil</li>
                                              <li>Coolant/antifreeze</li>
                                              <li>Brake fluid</li>
                                              <li>Power steering fluid</li>
                                              <li>Windshield washer fluid</li>
                                          </ul>
                                      </div>
                                      <div class="check-item">
                                          <h4>Belt & Hose Inspection</h4>
                                          <ul>
                                              <li>Check for cracks or fraying in belts</li>
                                              <li>Verify proper belt tension</li>
                                              <li>Inspect hoses for leaks or bulges</li>
                                              <li>Check hose connections</li>
                                          </ul>
                                      </div>
                                  </div>
                                  <h3>Battery Check</h3>
                                  <p>A properly functioning battery is essential for reliable operation:</p>
                                  <ul>
                                      <li>Check battery terminals for corrosion</li>
                                      <li>Ensure connections are tight</li>
                                      <li>Verify battery is securely mounted</li>
                                  </ul>
                                  <div class="alert-box warning">
                                      <strong>Important:</strong> Never smoke or use open flames when checking under the hood, especially near the battery.
                                  </div>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      },
                      {
                          title: 'Interior & Controls Check',
                          content: `
                              <div class="lesson-content">
                                  <p class="lesson-text">A thorough interior check ensures all controls and safety features are working properly before departure.</p>
                                  <h3>Dashboard Instruments</h3>
                                  <p>Verify all gauges and warning lights function correctly:</p>
                                  <ul>
                                      <li>Fuel gauge</li>
                                      <li>Engine temperature</li>
                                      <li>Oil pressure</li>
                                      <li>Battery indicator</li>
                                      <li>Warning lights</li>
                                  </ul>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="Dashboard check">
                                  </div>
                                  <h3>Safety Equipment</h3>
                                  <p>Confirm all safety equipment is present and accessible:</p>
                                  <ul>
                                      <li>First aid kit</li>
                                      <li>Fire extinguisher</li>
                                      <li>Warning triangles/flares</li>
                                      <li>Spare tire and jack</li>
                                      <li>Seatbelts for all positions</li>
                                  </ul>
                                  <h3>Interior Controls</h3>
                                  <p>Test all interior controls to ensure proper function:</p>
                                  <ul>
                                      <li>Horn</li>
                                      <li>Windshield wipers and washers</li>
                                      <li>All lights controls</li>
                                      <li>Heating, ventilation, and air conditioning</li>
                                      <li>Mirrors and seat adjustments</li>
                                  </ul>
                                  <div class="alert-box info">
                                      <strong>Tip:</strong> Always adjust your seat, mirrors, and steering wheel before starting your journey, not while driving.
                                  </div>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      },
                      {
                          title: 'Documentation & Final Checklist',
                          content: `
                              <div class="lesson-content">
                                  <p class="lesson-text">Proper documentation and a final verification ensure you're legally compliant and have completed all necessary checks.</p>
                                  <h3>Required Documentation</h3>
                                  <p>Always ensure you have these documents on hand:</p>
                                  <div class="document-checklist">
                                      <div class="document-item">
                                          <i class="fas fa-file-alt"></i>
                                          <span>Vehicle registration</span>
                                      </div>
                                      <div class="document-item">
                                          <i class="fas fa-id-card"></i>
                                          <span>Driver's license</span>
                                      </div>
                                      <div class="document-item">
                                          <i class="fas fa-file-invoice"></i>
                                          <span>Insurance certificate</span>
                                      </div>
                                      <div class="document-item">
                                          <i class="fas fa-book"></i>
                                          <span>Vehicle logbook</span>
                                      </div>
                                      <div class="document-item">
                                          <i class="fas fa-clipboard-check"></i>
                                          <span>Inspection records</span>
                                      </div>
                                  </div>
                                  <h3>Final Pre-Drive Checklist</h3>
                                  <div class="final-checklist">
                                      <div class="checklist-item">
                                          <input type="checkbox" id="final1">
                                          <label for="final1">External inspection completed</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="final2">
                                          <label for="final2">Under-hood checks completed</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="final3">
                                          <label for="final3">Interior and controls verified</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="final4">
                                          <label for="final4">All documentation present</label>
                                      </div>
                                      <div class="checklist-item">
                                          <input type="checkbox" id="final5">
                                          <label for="final5">Vehicle logbook updated</label>
                                      </div>
                                  </div>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="Documentation check">
                                  </div>
                                  <div class="alert-box success">
                                      <strong>Remember:</strong> A few minutes spent on thorough pre-checks can save hours of delays and prevent accidents.
                                  </div>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      }
                  ],
                  quizzes: [
                      {
                          title: "Pre-Checks Assessment",
                          timeLimit: 15,
                          passingScore: 70,
                          completed: false,
                          score: 0,
                          passed: false,
                          questions: [
                              {
                                  text: "Which of the following is NOT a part of the external vehicle inspection?",
                                  options: [
                                      "Checking tire pressure",
                                      "Inspecting lights and indicators",
                                      "Checking engine oil level",
                                      "Looking for fluid leaks under the vehicle"
                                  ],
                                  correctAnswer: 2,
                                  explanation: "Checking engine oil level is part of the under-hood inspection, not the external inspection."
                              },
                              {
                                  text: "What is the minimum legal tread depth for tires?",
                                  options: [
                                      "1.0mm",
                                      "1.6mm",
                                      "2.0mm",
                                      "2.5mm"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "The minimum legal tread depth for tires is 1.6mm across the central three-quarters of the tread width."
                              },
                              {
                                  text: "Which of these fluids should be checked during the under-hood inspection?",
                                  options: [
                                      "Gasoline",
                                      "Air conditioning refrigerant",
                                      "Brake fluid",
                                      "Seat lubricant"
                                  ],
                                  correctAnswer: 2,
                                  explanation: "Brake fluid is one of the essential fluids checked during under-hood inspection, along with engine oil, coolant, power steering fluid, and windshield washer fluid."
                              },
                              {
                                  text: "Why is it important to check all warning lights on the dashboard before driving?",
                                  options: [
                                      "It's a legal requirement only for commercial vehicles",
                                      "To ensure the electrical system is functioning correctly",
                                      "It's not important as long as the vehicle starts",
                                      "Only the fuel gauge needs to be checked"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "Checking all warning lights ensures the electrical system and the vehicle's monitoring systems are functioning correctly, which is crucial for safety."
                              },
                              {
                                  text: "Which document is NOT typically required to be kept in the vehicle?",
                                  options: [
                                      "Vehicle registration",
                                      "Driver's employment contract",
                                      "Insurance certificate",
                                      "Vehicle inspection records"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "While vehicle registration, insurance certificate, and inspection records are typically required in the vehicle, a driver's employment contract is not."
                              },
                              {
                                  text: "What should you do if you find a serious defect during pre-checks?",
                                  options: [
                                      "Fix it yourself if possible",
                                      "Document it and drive carefully",
                                      "Report it and do not drive the vehicle",
                                      "Complete your route and report it afterward"
                                  ],
                                  correctAnswer: 2,
                                  explanation: "If you find a serious defect, you should report it immediately and not drive the vehicle until it has been inspected and repaired by a qualified mechanic."
                              },
                              {
                                  text: "How often should a full pre-drive inspection be conducted?",
                                  options: [
                                      "Once a week",
                                      "Before each journey",
                                      "Once a month",
                                      "Only after maintenance"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "A full pre-drive inspection should be conducted before each journey to ensure the vehicle is safe and roadworthy."
                              },
                              {
                                  text: "Which of the following is a proper way to check tire pressure?",
                                  options: [
                                      "Visually inspect the tire",
                                      "Push on the tire with your foot",
                                      "Use a calibrated pressure gauge",
                                      "Drive the vehicle to feel if it's balanced"
                                  ],
                                  correctAnswer: 2,
                                  explanation: "The only accurate way to check tire pressure is by using a calibrated pressure gauge on cool tires."
                              },
                              {
                                  text: "What is the purpose of updating the vehicle logbook during pre-checks?",
                                  options: [
                                      "It's not necessary during pre-checks",
                                      "To record mileage and any issues found",
                                      "Only to record fuel levels",
                                      "Only required for commercial vehicles"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "The vehicle logbook should be updated during pre-checks to record mileage, condition of the vehicle, and any issues found, providing a documented history."
                              },
                              {
                                  text: "Which safety equipment is NOT typically required in a transport vehicle?",
                                  options: [
                                      "First aid kit",
                                      "Fire extinguisher",
                                      "Warning triangles",
                                      "Parachute"
                                  ],
                                  correctAnswer: 3,
                                  explanation: "While first aid kits, fire extinguishers, and warning triangles are standard safety equipment in transport vehicles, parachutes are not required."
                              }
                          ],
                          feedbackMessages: {
                              pass: "Congratulations! You've demonstrated a strong understanding of pre-drive vehicle checks. Remember to apply these principles every time you prepare to drive.",
                              fail: "You haven't quite mastered the pre-drive check procedures yet. Please review the module materials and try again. Focus particularly on the inspection sequence and safety requirements."
                          }
                      }
                  ]
              },
              {
                  id: 'fueling-safety',
                  title: 'Safety precautions during fueling',
                  level: 'Intermediate',
                  duration: '45 mins',
                  progress: 0,
                  description: 'Comprehensive guidelines for safe fueling practices to prevent accidents and hazards.',
                  lessons: [
                      {
                          title: 'Introduction to Fueling Safety',
                          content: `
                              <div class="lesson-content">
                                  <p class="lesson-text">Fueling operations present significant safety hazards that require proper procedures and awareness. This module covers the essential safety precautions required during vehicle fueling.</p>
                                  <div class="lesson-image">
                                      <img src="/api/placeholder/600/400" alt="Fueling safety">
                                  </div>
                                  <h3>Fuel-Related Hazards</h3>
                                  <p>Understanding the potential hazards is the first step in safe fueling:</p>
                                  <ul>
                                      <li>Fire and explosion risks from fuel vapors</li>
                                      <li>Health hazards from inhalation or skin contact</li>
                                      <li>Environmental damage from spills</li>
                                      <li>Static electricity ignition</li>
                                  </ul>
                                  <div class="alert-box warning">
                                      <strong>Important:</strong> Fuel vapors can ignite at a significant distance from the liquid fuel source.
                                  </div>
                                  <p>In the following lessons, we'll cover proper fueling procedures, emergency responses, and specific precautions for different fuel types.</p>
                              </div>
                          `,
                          viewed: false,
                          completed: false
                      }
                  ],
                  quizzes: [
                      {
                          title: "Fueling Safety Quiz",
                          timeLimit: 15,
                          passingScore: 70,
                          completed: false,
                          score: 0,
                          passed: false,
                          questions: [
                              {
                                  text: "Which of these should you do before beginning to fuel a vehicle?",
                                  options: [
                                      "Turn on your mobile phone",
                                      "Turn off the engine",
                                      "Smoke a cigarette",
                                      "Leave the vehicle running"
                                  ],
                                  correctAnswer: 1,
                                  explanation: "Always turn off the engine before fueling to eliminate ignition sources."
                              }
                          ],
                          feedbackMessages: {
                              pass: "Well done! You understand the essential safety precautions for fueling operations.",
                              fail: "Please review the fueling safety procedures again. These precautions are critical for preventing potentially serious accidents."
                          }
                      }
                  ]
              }
          ];
          
          // Save to localStorage
          localStorage.setItem('trainEd_modules', JSON.stringify(defaultModules));
      }
  }
  
  /**
   * Get module data by ID
   */
  function getModuleData(moduleId) {
      const modules = JSON.parse(localStorage.getItem('trainEd_modules')) || [];
      return modules.find(module => module.id === moduleId);
  }
  
  /**
   * Get all modules
   */
  function getAllModules() {
      return JSON.parse(localStorage.getItem('trainEd_modules')) || [];
  }
  
  /**
   * Save module data
   */
  function saveModuleData(moduleId, moduleData) {
      const modules = JSON.parse(localStorage.getItem('trainEd_modules')) || [];
      const index = modules.findIndex(module => module.id === moduleId);
      
      if (index !== -1) {
          modules[index] = moduleData;
          localStorage.setItem('trainEd_modules', JSON.stringify(modules));
      }
  }
  
  /**
   * Calculate module progress
   */
  function calculateModuleProgress(moduleId) {
      const moduleData = getModuleData(moduleId);
      
      if (!moduleData) return 0;
      
      let totalItems = moduleData.lessons.length + moduleData.quizzes.length;
      let completedItems = 0;
      
      // Count completed lessons
      moduleData.lessons.forEach(lesson => {
          if (lesson.viewed) {
              completedItems++;
          }
      });
      
      // Count completed quizzes
      moduleData.quizzes.forEach(quiz => {
          if (quiz.completed && quiz.passed) {
              completedItems++;
          }
      });
      
      return Math.round((completedItems / totalItems) * 100);
  }
  
  /**
   * Update module progress
   */
  function updateModuleProgress(moduleId) {
      const moduleData = getModuleData(moduleId);
      
      if (moduleData) {
          moduleData.progress = calculateModuleProgress(moduleId);
          saveModuleData(moduleId, moduleData);
      }
  }