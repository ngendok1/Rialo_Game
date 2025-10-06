// Item koleksi (koin dan hati)
const GameItems = {
    // Assets
    assets: null,
    
    // Koin
    coins: [
        { x: 100, y: 420, width: 20, height: 20, collected: false },
        { x: 300, y: 420, width: 20, height: 20, collected: false },
        { x: 500, y: 420, width: 20, height: 20, collected: false },
        { x: 230, y: 330, width: 20, height: 20, collected: false },
        { x: 430, y: 280, width: 20, height: 20, collected: false },
        { x: 630, y: 230, width: 20, height: 20, collected: false }
    ],

    // Hati (untuk quest healing)
    hearts: [
        { x: 150, y: 420, width: 25, height: 25, collected: false },
        { x: 350, y: 420, width: 25, height: 25, collected: false },
        { x: 550, y: 420, width: 25, height: 25, collected: false },
        { x: 250, y: 330, width: 25, height: 25, collected: false },
        { x: 450, y: 280, width: 25, height: 25, collected: false }
    ],

    // Initialize dengan assets
    init: function(assets) {
        this.assets = assets;
    },

    // Update items
    update: function(player) {
        // Deteksi tabrakan dengan koin
        this.coins.forEach(coin => {
            if (!coin.collected && Utils.collision(player, coin)) {
                coin.collected = true;
                Game.score += 100;
            }
        });

        // Deteksi tabrakan dengan hati
        this.hearts.forEach(heart => {
            if (!heart.collected && Utils.collision(player, heart)) {
                heart.collected = true;
                Game.heartsCollected++;
                
                // Jika quest selesai, sembuhkan player
                if (Game.heartsCollected >= Game.heartsNeeded) {
                    Game.health = Math.min(100, Game.health + 50);
                    Game.heartsCollected = 0;
                    
                    // Reset hati
                    this.hearts.forEach(h => h.collected = false);
                }
            }
        });
    },

    // Gambar koin
    drawCoins: function(ctx) {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                if (this.assets && this.assets.coin) {
                    ctx.drawImage(this.assets.coin, coin.x, coin.y, coin.width, coin.height);
                } else {
                    // Fallback drawing
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Highlight
                    ctx.fillStyle = '#FFFFE0';
                    ctx.beginPath();
                    ctx.arc(coin.x + coin.width/2 - 3, coin.y + coin.height/2 - 3, coin.width/4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Kilau
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2.5, 0, Math.PI);
                    ctx.stroke();
                }
            }
        });
    },

    // Gambar hati
    drawHearts: function(ctx) {
        this.hearts.forEach(heart => {
            if (!heart.collected) {
                if (this.assets && this.assets.heart) {
                    ctx.drawImage(this.assets.heart, heart.x, heart.y, heart.width, heart.height);
                } else {
                    // Fallback drawing
                    ctx.fillStyle = '#FF69B4';
                    ctx.beginPath();
                    ctx.moveTo(heart.x + heart.width/2, heart.y);
                    ctx.bezierCurveTo(
                        heart.x + heart.width, heart.y - 5,
                        heart.x + heart.width, heart.y + heart.height/2,
                        heart.x + heart.width/2, heart.y + heart.height
                    );
                    ctx.bezierCurveTo(
                        heart.x, heart.y + heart.height/2,
                        heart.x, heart.y - 5,
                        heart.x + heart.width/2, heart.y
                    );
                    ctx.fill();
                    
                    // Highlight
                    ctx.fillStyle = '#FFB6C1';
                    ctx.beginPath();
                    ctx.ellipse(heart.x + heart.width/3, heart.y + heart.height/4, 3, 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
    },

    // Reset semua items
    reset: function() {
        this.coins.forEach(coin => coin.collected = false);
        this.hearts.forEach(heart => heart.collected = false);
    }
};
