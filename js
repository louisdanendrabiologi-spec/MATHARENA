// =====================
// UI MANAGER
// =====================

class UIManager {
    constructor() {
        this.elements = {};
        this.currentPage = 'home';
    }

    /**
     * Initialize UI elements cache
     */
    init() {
        // Cache all frequently used elements
        this.elements = {
            // Stats
            totalPoints: document.getElementById('totalPoints'),
            totalCorrect: document.getElementById('totalCorrect'),
            accuracy: document.getElementById('accuracy'),
            globalRank: document.getElementById('globalRank'),
            
            // Rank
            currentRankBadge: document.getElementById('currentRankBadge'),
            currentRankText: document.getElementById('currentRankText'),
            currentRankName: document.getElementById('currentRankName'),
            currentRankIcon: document.getElementById('currentRankIcon'),
            currentRankPointsText: document.getElementById('currentRankPointsText'),
            nextRankName: document.getElementById('nextRankName'),
            
            // Progress
            progressFill: document.getElementById('progressFill'),
            progressCurrent: document.getElementById('progressCurrent'),
            progressTarget: document.getElementById('progressTarget'),
            ranksList: document.getElementById('ranksList'),
            
            // Quiz Modal
            quizModal: document.getElementById('quizModal'),
            quizTimer: document.getElementById('quizTimer'),
            quizDifficulty: document.getElementById('quizDifficulty'),
            currentQuestion: document.getElementById('currentQuestion'),
            totalQuestions: document.getElementById('totalQuestions'),
            questionText: document.getElementById('questionText'),
            questionHint: document.getElementById('questionHint'),
            optionsGrid: document.getElementById('optionsGrid'),
            currentScore: document.getElementById('currentScore'),
            
            // Result Modal
            resultModal: document.getElementById('resultModal'),
            resultIcon: document.getElementById('resultIcon'),
            resultTitle: document.getElementById('resultTitle'),
            resultScore: document.getElementById('resultScore'),
            resultCorrect: document.getElementById('resultCorrect'),
            resultWrong: document.getElementById('resultWrong'),
            resultAccuracy: document.getElementById('resultAccuracy'),
            resultMessage: document.getElementById('resultMessage'),
            
            // Leaderboard
            leaderboardList: document.getElementById('leaderboardList'),
            
            // Settings
            settingsPanel: document.getElementById('settingsPanel'),
            settingsOverlay: document.getElementById('settingsOverlay'),
            playerNameInput: document.getElementById('playerNameInput'),
            questionCountSelect: document.getElementById('questionCountSelect'),
            timePerQuestionSelect: document.getElementById('timePerQuestionSelect'),
            
            // Pages
            homePage: document.getElementById('homePage'),
            leaderboardPage: document.getElementById('leaderboardPage'),
            statsPage: document.getElementById('statsPage'),
            
            // Toast
            toast: document.getElementById('toast'),
            
            // Particles
            particles: document.getElementById('particles')
        };

        this.createParticles();
    }

    /**
     * Create floating particles
     */
    createParticles() {
        const container = this.elements.particles;
        if (!container) return;
        
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            container.appendChild(particle);
        }
    }

    /**
     * Update user stats display
     */
    updateStats(userData) {
        if (this.elements.totalPoints) {
            this.elements.totalPoints.textContent = userData.points.toLocaleString();
        }
        if (this.elements.totalCorrect) {
            this.elements.totalCorrect.textContent = userData.correctAnswers;
        }
        
        const accuracy = userData.totalAnswers > 0 
            ? Math.round((userData.correctAnswers / userData.totalAnswers) * 100)
            : 0;
        if (this.elements.accuracy) {
            this.elements.accuracy.textContent = accuracy + '%';
        }
    }

    /**
     * Update rank display
     */
    updateRank(userData) {
        const currentRank = this.getCurrentRank(userData.points);
        const nextRank = this.getNextRank(userData.points);

        // Update badge
        if (this.elements.currentRankBadge) {
            this.elements.currentRankBadge.className = 'rank-badge ' + currentRank.class;
        }
        if (this.elements.currentRankText) {
            this.elements.currentRankText.textContent = currentRank.name;
        }
        if (this.elements.currentRankName) {
            this.elements.currentRankName.textContent = currentRank.name;
        }
        if (this.elements.currentRankIcon) {
            this.elements.currentRankIcon.className = 'current-rank-icon ' + currentRank.class;
        }

        // Update progress
        if (nextRank) {
            const progress = ((userData.points - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100;
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = Math.min(progress, 100) + '%';
            }
            if (this.elements.progressCurrent) {
                this.elements.progressCurrent.textContent = userData.points + ' poin';
            }
            if (this.elements.progressTarget) {
                this.elements.progressTarget.textContent = nextRank.minPoints + ' poin';
            }
            if (this.elements.currentRankPointsText) {
                this.elements.currentRankPointsText.textContent = `${userData.points} / ${nextRank.minPoints} poin`;
            }
            if (this.elements.nextRankName) {
                this.elements.nextRankName.textContent = nextRank.name;
            }
        } else {
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = '100%';
            }
            if (this.elements.progressCurrent) {
                this.elements.progressCurrent.textContent = userData.points + ' poin';
            }
            if (this.elements.progressTarget) {
                this.elements.progressTarget.textContent = 'MAX';
            }
            if (this.elements.currentRankPointsText) {
                this.elements.currentRankPointsText.textContent = `${userData.points} poin (MAX)`;
            }
            if (this.elements.nextRankName) {
                this.elements.nextRankName.textContent = 'Legend (MAX)';
            }
        }

        // Update ranks list
        this.renderRanksList(userData.points);
    }

    /**
     * Get current rank based on points
     */
    getCurrentRank(points) {
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (points >= RANKS[i].minPoints) {
                return RANKS[i];
            }
        }
        return RANKS[0];
    }

    /**
     * Get next rank
     */
    getNextRank(points) {
        const current = this.getCurrentRank(points);
        const currentIndex = RANKS.indexOf(current);
        if (currentIndex < RANKS.length - 1) {
            return RANKS[currentIndex + 1];
        }
        return null;
    }

    /**
     * Render ranks list
     */
    renderRanksList(points) {
        if (!this.elements.ranksList) return;
        
        const currentRank = this.getCurrentRank(points);
        
        this.elements.ranksList.innerHTML = RANKS.map(rank => {
            let status = '';
            if (rank.name === currentRank.name) status = 'current';
            else if (points >= rank.maxPoints + 1) status = 'passed';
            
            return `
                <div class="rank-item ${status} ${rank.class}" 
                     style="background: ${status ? rank.color + '22' : 'transparent'}; border-color: ${status === 'current' ? rank.color : 'transparent'}">
                    <div class="rank-item-name" style="color: ${rank.color}">${rank.name}</div>
                    <div class="rank-item-points">${rank.minPoints}+ poin</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Show quiz modal
     */
    showQuizModal() {
        if (this.elements.quizModal) {
            this.elements.quizModal.classList.add('active');
        }
    }

    /**
     * Hide quiz modal
     */
    hideQuizModal() {
        if (this.elements.quizModal) {
            this.elements.quizModal.classList.remove('active');
        }
    }

    /**
     * Update quiz display
     */
    updateQuiz(quizState, question, options) {
        // Update difficulty badge
        if (this.elements.quizDifficulty) {
            this.elements.quizDifficulty.textContent = DIFFICULTY_CONFIG[quizState.difficulty].name;
            this.elements.quizDifficulty.className = 'quiz-difficulty ' + quizState.difficulty;
        }

        // Update progress
        if (this.elements.currentQuestion) {
            this.elements.currentQuestion.textContent = quizState.currentIndex + 1;
        }
        if (this.elements.totalQuestions) {
            this.elements.totalQuestions.textContent = quizState.questionCount;
        }

        // Update question
        if (this.elements.questionText) {
            this.elements.questionText.textContent = question.text;
        }
        if (this.elements.questionHint) {
            this.elements.questionHint.textContent = question.hint;
        }

        // Update options
        if (this.elements.optionsGrid) {
            this.elements.optionsGrid.innerHTML = options.map(opt => `
                <button class="option-btn" data-value="${opt}">
                    ${opt}
                </button>
            `).join('');
        }

        // Update score
        if (this.elements.currentScore) {
            this.elements.currentScore.textContent = quizState.score;
        }
    }

    /**
     * Update timer display
     */
    updateTimer(timeLeft) {
        if (this.elements.quizTimer) {
            this.elements.quizTimer.textContent = timeLeft;
            
            if (timeLeft <= 10) {
                this.elements.quizTimer.classList.add('warning');
            } else {
                this.elements.quizTimer.classList.remove('warning');
            }
        }
    }

    /**
     * Show answer feedback
     */
    showAnswerFeedback(selectedAnswer, correctAnswer, isCorrect) {
        if (!this.elements.optionsGrid) return;
        
        const buttons = this.elements.optionsGrid.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            const value = parseFloat(btn.dataset.value);
            btn.disabled = true;
            
            if (Math.abs(value - correctAnswer) < 0.01) {
                btn.classList.add('correct');
            } else if (Math.abs(value - selectedAnswer) < 0.01 && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
    }

    /**
     * Show result modal
     */
    showResultModal(results) {
        if (this.elements.resultModal) {
            this.elements.resultModal.classList.add('active');
        }

        // Update result display
        if (this.elements.resultScore) {
            this.elements.resultScore.textContent = results.score + ' Poin';
        }
        if (this.elements.resultCorrect) {
            this.elements.resultCorrect.textContent = results.correctCount;
        }
        if (this.elements.resultWrong) {
            this.elements.resultWrong.textContent = results.wrongCount;
        }
        if (this.elements.resultAccuracy) {
            this.elements.resultAccuracy.textContent = results.accuracy + '%';
        }

        // Set message based on accuracy
        if (this.elements.resultMessage) {
            let message = '';
            if (results.accuracy === 100) {
                message = 'Sempurna! Kamu luar biasa!';
            } else if (results.accuracy >= 80) {
                message = 'Bagus sekali! Terus pertahankan!';
            } else if (results.accuracy >= 60) {
                message = 'Lumayan! Terus berlatih!';
            } else if (results.accuracy >= 40) {
                message = 'Masih bisa ditingkatkan!';
            } else {
                message = 'Jangan menyerah, coba lagi!';
            }
            this.elements.resultMessage.textContent = message;
        }

        // Set icon based on performance
        if (this.elements.resultIcon) {
            this.elements.resultIcon.className = 'result-icon ' + 
                (results.accuracy >= 60 ? 'success' : 'fail');
        }
    }

    /**
     * Hide result modal
     */
    hideResultModal() {
        if (this.elements.resultModal) {
            this.elements.resultModal.classList.remove('active');
        }
    }

    /**
     * Render leaderboard
     */
    renderLeaderboard(allPlayers, currentUserName) {
        if (!this.elements.leaderboardList) return;

        // Sort by points
        allPlayers.sort((a, b) => b.points - a.points);

        this.elements.leaderboardList.innerHTML = allPlayers.slice(0, 20).map((player, index) => {
            const rankClass = index < 3 ? `rank-${index + 1}` : 'rank-other';
            const playerRank = RANKS.find(r => r.name === player.rank) || RANKS[0];
            const isCurrentUser = player.name === currentUserName;

            return `
                <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                    <div class="rank-number ${rankClass}">${index + 1}</div>
                    <div class="player-avatar" 
                         style="background: linear-gradient(135deg, ${playerRank.color}, ${playerRank.color}88)">
                        ${player.avatar || player.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="player-info">
                        <div class="player-name">${player.name} ${isCurrentUser ? '(Kamu)' : ''}</div>
                        <span class="player-rank ${playerRank.class}" 
                              style="background: ${playerRank.color}33; color: ${playerRank.color}">
                            ${player.rank}
                        </span>
                    </div>
                    <div class="player-score">${player.points.toLocaleString()}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Show/hide settings panel
     */
    toggleSettingsPanel(show) {
        if (show) {
            this.elements.settingsPanel?.classList.add('active');
            this.elements.settingsOverlay?.classList.add('active');
        } else {
            this.elements.settingsPanel?.classList.remove('active');
            this.elements.settingsOverlay?.classList.remove('active');
        }
    }

    /**
     * Switch page
     */
    switchPage(pageName) {
        this.currentPage = pageName;
        
        // Hide all pages
        this.elements.homePage.style.display = 'none';
        this.elements.leaderboardPage.style.display = 'none';
        this.elements.statsPage.style.display = 'none';
        
        // Show selected page
        switch (pageName) {
            case 'home':
                this.elements.homePage.style.display = 'block';
                break;
            case 'leaderboard':
                this.elements.leaderboardPage.style.display = 'block';
                break;
            case 'stats':
                this.elements.statsPage.style.display = 'block';
                break;
        }

        // Update nav buttons
        document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === pageName);
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = '') {
        if (!this.elements.toast) return;
        
        this.elements.toast.textContent = message;
        this.elements.toast.className = 'toast ' + type;
        
        setTimeout(() => this.elements.toast.classList.add('show'), 10);
        setTimeout(() => this.elements.toast.classList.remove('show'), 3000);
    }
}

// Create global instance
const uiManager = new UIManager();
