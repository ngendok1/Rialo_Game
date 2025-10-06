// Platform dan lingkungan game
const GameEnvironment = {
    // Assets
    assets: null,
    
    // Awan
    clouds: [
        { x: 100, y: 50, width: 80, height: 40, speed: 0.5 },
        { x: 300, y: 80, width: 100, height: 50, speed: 0.3 },
        { x: 600, y: 60, width: 120, height: 45, speed: 0.4 },
        { x: 800, y: 100, width: 90, height: 35, speed: 0.6 }
    ],

    // Platform
    platforms: [
        { x: 0, y: 470, width: 200, height: 30, color: '#8B4513' },
        { x: 250, y: 470, width: 150, height: 30, color: '#8B4513' },
        { x: 450, y: 470, width: 200, height: 30, color: '#8B4513' },
        { x: 700, y: 470, width: 100, height: 30, color: '#8B4513' },
        { x: 200, y: 370, width: 100, height: 20, color: '#8B4513' },
        { x: 400, y: 320, width: 100, height: 20, color: '#8B4513' },
        { x: 600, y: 270, width: 100, height: 20, color: '#8B4513' }
    ],

    // Bendera finish
    flag: { x: 750, y: 350, width: 30, height: 120, color: '#FFD700' },

    // Initialize dengan assets
    init: function(assets) {
        this.assets = assets;
    },

    // Update awan
    updateClouds: function() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            
            // Reset posisi awan jika keluar layar
            if (cloud.x + cloud.width < 0) {
                cloud.x = Game.canvas.width;
                cloud.y = Utils.random(30, 130);
            }
        });
    },

    // Gambar awan
    drawClouds: function(ctx) {
        this.clouds.forEach(cloud => {
            if (this.assets && this.assets.cloud) {
                ctx.drawImage(this.assets.cloud, cloud.x, cloud.y, cloud.width, cloud.height);
            } else {
                // Fallback jika gambar belum dimuat
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(cloud.x + 20, cloud.y + 20, 20, 0, Math.PI * 2);
                ctx.arc(cloud.x + 40, cloud.y + 10, 25, 0, Math.PI * 2);
                ctx.arc(cloud.x + 60, cloud.y + 20, 20, 0, Math.PI * 2);
                ctx.arc(cloud.x + 40, cloud.y + 30, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    },

    // Gambar platform
    drawPlatforms: function(ctx) {
        this.platforms.forEach(platform => {
            // Gradient untuk platform
            const gradient = Utils.createGradient(ctx, 
                platform.x, platform.y, 
                platform.x, platform.y + platform.height,
                [
                    { offset: 0, color: '#A0522D' },
                    { offset: 0.7, color: platform.color },
                    { offset: 1, color: '#654321' }
                ]
            );
            
            ctx.fillStyle = gradient;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Tambahkan tekstur
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < platform.width; i += 15) {
                ctx.fillRect(platform.x + i, platform.y, 8, 3);
            }
        });
    },

    // Gambar bendera
    drawFlag: function(ctx) {
        // Tiang bendera
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.flag.x - 5, this.flag.y, 8, this.flag.height);
        
        // Bendera
        const flagGradient = Utils.createGradient(ctx,
            this.flag.x, this.flag.y,
            this.flag.x + this.flag.width, this.flag.y,
            [
                { offset: 0, color: '#FF0000' },
                { offset: 0.5, color: this.flag.color },
                { offset: 1, color: '#FFFF00' }
            ]
        );
        
        ctx.fillStyle = flagGradient;
        ctx.fillRect(this.flag.x, this.flag.y, this.flag.width, this.flag.height - 80);
        
        // Detail bendera
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.flag.x, this.flag.y, this.flag.width, this.flag.height - 80);
    }
};
