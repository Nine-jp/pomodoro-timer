class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentInterval = null;
        this.currentMode = 'work';
        this.soundPlaying = false;
        this.audio = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.seconds = this.workTimeInput.value * 60;
        
        // 初期表示の更新
        this.updateDisplay();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stopSoundBtn = document.getElementById('stopSoundBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.alarmSound = document.getElementById('alarmSound');
        this.presetButtons = document.querySelectorAll('.preset-btn');
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.handleStart());
        this.resetBtn.addEventListener('click', () => this.handleReset());
        this.stopSoundBtn.addEventListener('click', () => this.stopSound());
        this.workTimeInput.addEventListener('change', () => this.updateTimer());
        this.breakTimeInput.addEventListener('change', () => this.updateTimer());
        
        // プリセットボタンのイベントリスナー
        this.presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const workTime = parseInt(button.dataset.work);
                const breakTime = parseInt(button.dataset.break);
                this.workTimeInput.value = workTime;
                this.breakTimeInput.value = breakTime;
                this.updateTimer();
            });
        });

        // 音声ファイルの初期化
        this.audio = document.getElementById('alarmSound');
        const audioStatus = document.getElementById('audioStatus');
        
        if (this.audio) {
            this.audio.loop = true; // 音声をループ再生
            
            // 音声ファイルの読み込み状態を監視
            this.audio.addEventListener('loadeddata', () => {
                audioStatus.textContent = '音声ファイルの読み込み完了';
                console.log('音声ファイルの読み込み完了');
            });
            
            this.audio.addEventListener('error', (error) => {
                audioStatus.textContent = '音声ファイルの読み込みエラー: ' + error.target.error.code;
                console.error('音声ファイルの読み込みエラー:', error.target.error.code);
            });
        }
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
        this.stopSound();
        this.updateTimer();
    }

    handleModeChange() {
        this.isRunning = false;
        this.startBtn.textContent = '開始';
        clearInterval(this.currentInterval);
        
        // タイマーカウントダウン終了時に音を鳴らす
        if (!this.soundPlaying && this.audio) {
            try {
                this.audio.play().catch(error => {
                    console.error('音の再生に失敗しました:', error);
                });
                this.soundPlaying = true;
                this.stopSoundBtn.style.display = 'block';
            } catch (error) {
                console.error('音の再生に失敗しました:', error);
            }
        }
        
        if (this.currentMode === 'work') {
            this.currentMode = 'break';
            this.seconds = this.breakTimeInput.value * 60;
            this.timerElement.style.color = '#e74c3c';
            this.timerElement.textContent = 'Break';
        } else {
            this.currentMode = 'work';
            this.seconds = this.workTimeInput.value * 60;
            this.timerElement.style.color = '#2c3e50';
            this.timerElement.textContent = 'Focus';
        }
        
        this.updateDisplay();
    }

    stopSound() {
        if (this.soundPlaying && this.audio) {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.soundPlaying = false;
                this.stopSoundBtn.style.display = 'none';
            } catch (error) {
                console.error('音の停止に失敗しました:', error);
            }
        }
    }

    stopSound() {
        if (this.soundPlaying) {
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
            this.soundPlaying = false;
            this.stopSoundBtn.style.display = 'none';
        }
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
