// Musuh
const GameEnemies = {
    // Assets
    assets: null,
    
    // Daftar musuh
    enemies: [
        { x: 300, y: 430, width: 30, height: 40, speed: 2, direction: 1 },
        { x: 550, y: 430, width: 30, height: 40, speed: 2, direction: -1 }
    ],

    // Initialize dengan assets
    init: function(assets) {
        this.assets = assets;
    },

    // Update musuh
    update: function(player) {
        this.enemies.forEach(enemy => {
            enemy.x += enemy.speed * enemy.direction;
            
            // Balik arah jika mencapai ujung platform
            if (enemy.x <= 250 || enemy.x + enemy.width >= 400) {
                enemy.direction *= -1;
            }
            
            // Deteksi tabrakan dengan musuh
            if (Utils.collision(player, enemy)) {
                Game.health -= 10;
                player.x -= 50; // Dorong player mundur
                
                if (Game.health <= 0) {
                    Game.lives--;
                    Game.health = 100;
                    
                    if (Game.lives <= 0) {
                        Game.gameOver();
                    }
                }
            }
        });
    },

    // Gambar musuh
    draw: function(ctx) {
        this.enemies.forEach(enemy => {
            if (this.assets && this.assets.enemy) {
                ctx.drawImage(this.assets.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
            } else {
                // Fallback drawing
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Mata musuh
                ctx.fillStyle = 'white';
                ctx.fillRect(enemy.x + 5, enemy.y + 10, 8, 8);
                ctx.fillRect(enemy.x + enemy.width - 13, enemy.y + 10, 8, 8);
                
                ctx.fillStyle = 'black';
                ctx.fillRect(enemy.x + 7, enemy.y + 12, 4, 4);
                ctx.fillRect(enemy.x + enemy.width - 11, enemy.y + 12, 4, 4);
                
                // Mulut
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(enemy.x + 10, enemy.y + 25, enemy.width - 20, 5);
            }
        });
    },

    // Reset musuh
    reset: function() {
        this.enemies[0].x = 300;
        this.enemies[1].x = 550;
    }
};
