// Game utama
const Game = {
    // Konstanta game
    gravity: 0.5,
    friction: 0.8,
    heartsNeeded: 5,
    
    // State game
    score: 0,
    lives: 3,
    health: 100,
    gameRunning: true,
    heartsCollected: 0,
    assetsLoaded: false,
    
    // Canvas dan context
    canvas: null,
    ctx: null,
    
    // Inisialisasi game
    init: async function() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load assets terlebih dahulu
        await this.loadAssets();
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    },
    
    // Load semua assets
    loadAssets: async function() {
        try {
            const assets = await Utils.loadAssets();
            
            // Initialize semua modul dengan assets
            GameEnvironment.init(assets);
            GameItems.init(assets);
            GameEnemies.init(assets);
            Player.init(assets);
            
            this.assetsLoaded = true;
            console.log('All assets loaded successfully');
        } catch (error) {
            console.warn('Assets loading failed, using fallbacks:', error);
            this.assetsLoaded = false;
        }
    },
    
    // Setup event listeners (HANYA KONTROL GAME)
    setupEventListeners: function() {
        // Kontrol keyboard
        document.addEventListener('keydown', (e) => Player.handleKeyDown(e));
        document.addEventListener('keyup', (e) => Player.handleKeyUp(e));
        
        // Tombol restart
        document.getElementById('restart-button').addEventListener('click', () => this.restart());
        document.getElementById('next-level-button').addEventListener('click', () => this.restart());
        
        // KUSTOMISASI DIHAPUS DARI SINI
    },
    
    // Update UI
    updateUI: function() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('health-fill').style.width = this.health + '%';
        
        // Update quest
        document.getElementById('quest').innerHTML = `
            <strong>Quest:</strong><br>
            Collect ${this.heartsCollected}/${this.heartsNeeded} hearts to heal!
        `;
    },
    
    // Update game
    update: function() {
        if (!this.gameRunning) return;
        
        // Update environment
        GameEnvironment.updateClouds();
        
        // Update player
        Player.update();
        
        // Update items
        GameItems.update(Player);
        
        // Update enemies
        GameEnemies.update(Player);
        
        // Update UI
        this.updateUI();
    },
    
    // Render game
    render: function() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Gambar environment
        GameEnvironment.drawClouds(this.ctx);
        GameEnvironment.drawPlatforms(this.ctx);
        GameEnvironment.drawFlag(this.ctx);
        
        // Gambar items
        GameItems.drawCoins(this.ctx);
        GameItems.drawHearts(this.ctx);
        
        // Gambar enemies
        GameEnemies.draw(this.ctx);
        
        // Gambar player
        Player.draw(this.ctx);
        
        // Tampilkan loading jika assets belum siap
        if (!this.assetsLoaded) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading assets...', this.canvas.width / 2, this.canvas.height / 2);
        }
    },
    
    // Game loop
    gameLoop: function() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    },
    
    // Game over
    gameOver: function() {
        this.gameRunning = false;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'flex';
    },
    
    // Level complete
    levelComplete: function() {
        this.gameRunning = false;
        document.getElementById('level-complete').style.display = 'flex';
    },
    
    // Restart game
    restart: function() {
        this.score = 0;
        this.lives = 3;
        this.health = 100;
        this.heartsCollected = 0;
        this.gameRunning = true;
        
        // Reset player
        Player.resetPosition();
        
        // Reset items
        GameItems.reset();
        
        // Reset enemies
        GameEnemies.reset();
        
        // Sembunyikan layar game over/complete
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('level-complete').style.display = 'none';
        
        this.updateUI();
    }
};

// Inisialisasi game ketika halaman dimuat
window.addEventListener('load', () => Game.init());
