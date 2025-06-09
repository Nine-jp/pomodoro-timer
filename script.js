class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentInterval = null;
        this.currentMode = 'work';
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.handleStart());
        this.resetBtn.addEventListener('click', () => this.handleReset());
        this.workTimeInput.addEventListener('change', () => this.updateTimer());
        this.breakTimeInput.addEventListener('change', () => this.updateTimer());
    }

    handleStart() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.textContent = '停止';
        
        this.currentInterval = setInterval(() => {
            if (this.seconds > 0) {
                this.seconds--;
                this.updateDisplay();
            } else {
                this.handleModeChange();
            }
        }, 1000);
    }

    handleReset() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.textContent = '開始';
        clearInterval(this.currentInterval);
        this.updateTimer();
    }

    handleModeChange() {
        this.isRunning = false;
        this.startBtn.textContent = '開始';
        clearInterval(this.currentInterval);
        
        if (this.currentMode === 'work') {
            this.currentMode = 'break';
            this.seconds = this.breakTimeInput.value * 60;
            this.timerElement.style.color = '#e74c3c';
        } else {
            this.currentMode = 'work';
            this.seconds = this.workTimeInput.value * 60;
            this.timerElement.style.color = '#2c3e50';
        }
        
        this.updateDisplay();
    }

    updateTimer() {
        this.seconds = this.workTimeInput.value * 60;
        this.currentMode = 'work';
        this.timerElement.style.color = '#2c3e50';
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// インスタンスの作成
const pomodoroTimer = new PomodoroTimer();
