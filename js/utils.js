// Utility functions
const Utils = {
    // Deteksi tabrakan
    collision: function(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },

    // Load gambar dengan fallback
    loadImage: function(src, fallbackColor = null) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                if (fallbackColor) {
                    // Create a colored rectangle as fallback
                    const canvas = document.createElement('canvas');
                    canvas.width = 50;
                    canvas.height = 50;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = fallbackColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    const fallbackImg = new Image();
                    fallbackImg.onload = () => resolve(fallbackImg);
                    fallbackImg.src = canvas.toDataURL();
                } else {
                    reject(new Error(`Failed to load image: ${src}`));
                }
            };
            img.src = src;
        });
    },

    // Load semua assets
    loadAssets: async function() {
        try {
            const assets = {
                cloud: await this.loadImage('assets/images/cloud.png', '#FFFFFF'),
                player: await this.loadImage('assets/images/player.png', '#E52521'),
                coin: await this.loadImage('assets/images/coin.png', '#FFD700'),
                heart: await this.loadImage('assets/images/heart.png', '#FF69B4'),
                enemy: await this.loadImage('assets/images/enemy.png', '#8B0000')
            };
            return assets;
        } catch (error) {
            console.warn('Some assets failed to load, using fallbacks:', error);
            // Return fallback assets
            return {
                cloud: await this.loadImage('', '#FFFFFF'),
                player: await this.loadImage('', '#E52521'),
                coin: await this.loadImage('', '#FFD700'),
                heart: await this.loadImage('', '#FF69B4'),
                enemy: await this.loadImage('', '#8B0000')
            };
        }
    },

    // Random number between min and max
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Format angka
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Create gradient
    createGradient: function(ctx, x1, y1, x2, y2, colorStops) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color);
        });
        return gradient;
    }
};
