// Dynamic safe-area detection helper for notch/island/curved screens
function getSafeAreaInsets() {
    let top = 0, left = 0, right = 0, bottom = 0;
    try {
        const div = document.createElement('div');
        div.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        div.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
        div.style.paddingRight = 'env(safe-area-inset-right, 0px)';
        div.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
        div.style.position = 'fixed';
        div.style.left = '-9999px';
        div.style.top = '-9999px';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        const style = window.getComputedStyle(div);
        top = parseFloat(style.paddingTop) || 0;
        left = parseFloat(style.paddingLeft) || 0;
        right = parseFloat(style.paddingRight) || 0;
        bottom = parseFloat(style.paddingBottom) || 0;
        document.body.removeChild(div);
    } catch (e) {}
    return { top, left, right, bottom };
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: []
};

