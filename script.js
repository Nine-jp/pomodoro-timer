class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentInterval = null;
        this.currentMode = 'work';
        this.soundPlaying = false;
        this.audioContext = null;
        this.audioBuffer = null;
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
        this.startBtn.addEventListener('click', async () => {
            await this.initializeAudio();
            this.handleStart();
        });
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
    }

    async initializeAudio() {
        try {
            // AudioContextの初期化
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 音声ファイルをフェッチ
            const response = await fetch('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
            const arrayBuffer = await response.arrayBuffer();
            
            // 音声データをデコード
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('音声の初期化に失敗しました:', error);
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
        if (!this.soundPlaying && this.audioBuffer) {
            try {
                // オーディオノードを作成
                const source = this.audioContext.createBufferSource();
                source.buffer = this.audioBuffer;
                source.loop = true;
                
                // オーディオノードを接続
                source.connect(this.audioContext.destination);
                
                // 音声を再生
                source.start(0);
                
                // 再生状態を記録
                this.currentSource = source;
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
        } else {
            this.currentMode = 'work';
            this.seconds = this.workTimeInput.value * 60;
            this.timerElement.style.color = '#2c3e50';
        }
        
        this.updateDisplay();
    }

    stopSound() {
        if (this.soundPlaying && this.currentSource) {
            try {
                this.currentSource.stop(0);
                this.currentSource.disconnect();
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
