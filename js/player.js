// Player
const Player = {
    x: 50,
    y: 400,
    width: 40,
    height: 60,
    speed: 5,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    facing: 'right', // 'left' or 'right'
    assets: null,

    // Initialize dengan assets
    init: function(assets) {
        this.assets = assets;
    },

    // Update player
    update: function() {
        // Reset grounded status
        this.grounded = false;
        
        // Terapkan gravitasi
        this.velY += Game.gravity;
        
        // Terapkan gesekan
        this.velX *= Game.friction;
        
        // Update posisi player
        this.x += this.velX;
        this.y += this.velY;
        
        // Update arah hadap
        if (this.velX > 0) this.facing = 'right';
        if (this.velX < 0) this.facing = 'left';
        
        // Batasi player di dalam canvas (kiri/kanan)
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > Game.canvas.width) this.x = Game.canvas.width - this.width;
        
        // Cek jika player jatuh (FIXED: hanya mengurangi nyawa jika benar-benar jatuh)
        if (this.y > Game.canvas.height) {
            Game.lives--;
            Game.health = 100;
            
            if (Game.lives <= 0) {
                Game.gameOver();
            } else {
                // Reset posisi player
                this.resetPosition();
            }
        }
        
        // Deteksi tabrakan dengan platform
        GameEnvironment.platforms.forEach(platform => {
            const dir = Utils.collision(this, platform);
            
            if (dir) {
                // Tabrakan dari atas (FIXED: lebih akurat mendeteksi dari atas)
                if (this.y + this.height <= platform.y + 15 && this.velY > 0) {
                    this.y = platform.y - this.height;
                    this.velY = 0;
                    this.jumping = false;
                    this.grounded = true;
                }
                // Tabrakan dari bawah
                else if (this.y >= platform.y + platform.height - 10 && this.velY < 0) {
                    this.y = platform.y + platform.height;
                    this.velY = 0;
                }
                // Tabrakan dari samping
                else if (this.x + this.width <= platform.x + 10 && this.velX > 0) {
                    this.x = platform.x - this.width;
                }
                else if (this.x >= platform.x + platform.width - 10 && this.velX < 0) {
                    this.x = platform.x + platform.width;
                }
            }
        });
        
        // Deteksi finish
        if (Utils.collision(this, GameEnvironment.flag)) {
            Game.levelComplete();
        }
    },

    // Gambar player
    draw: function(ctx) {
        if (this.assets && this.assets.player) {
            // Gambar dengan sprite
            ctx.save();
            if (this.facing === 'left') {
                ctx.scale(-1, 1);
                ctx.drawImage(this.assets.player, -this.x - this.width, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this.assets.player, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            // Fallback drawing
            ctx.fillStyle = '#E52521';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Detail player (wajah)
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x + 10, this.y + 15, 8, 8);
            ctx.fillRect(this.x + this.width - 18, this.y + 15, 8, 8);
            
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + 12, this.y + 17, 4, 4);
            ctx.fillRect(this.x + this.width - 16, this.y + 17, 4, 4);
            
            // Mulut player
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 35);
            ctx.lineTo(this.x + this.width - 10, this.y + 35);
            ctx.stroke();
            
            // Topi player
            ctx.fillStyle = '#E52521';
            ctx.fillRect(this.x - 5, this.y, this.width + 10, 10);
            ctx.fillRect(this.x + 5, this.y - 10, this.width - 10, 10);
        }
    },

    // Reset posisi player
    resetPosition: function() {
        this.x = 50;
        this.y = 400;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.facing = 'right';
    },

    // Kontrol keyboard
    handleKeyDown: function(e) {
        if (!Game.gameRunning) return;
        
        switch(e.keyCode) {
            case 37: // Panah kiri
                this.velX = -this.speed;
                break;
            case 39: // Panah kanan
                this.velX = this.speed;
                break;
            case 38: // Panah atas
                if (this.grounded) {
                    this.velY = -12;
                    this.jumping = true;
                    this.grounded = false;
                }
                break;
        }
    },

    handleKeyUp: function(e) {
        if (!Game.gameRunning) return;
        
        switch(e.keyCode) {
            case 37: // Panah kiri
            case 39: // Panah kanan
                this.velX = 0;
                break;
        }
    }
};
