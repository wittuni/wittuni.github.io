let cooldownEnabled = true;

document.getElementById('cooldown-toggle').addEventListener('change', function () {
    cooldownEnabled = !this.checked; // 选中表示关闭冷却
});

document.querySelector('.action-button').addEventListener('click', function () {
    if (cooldownEnabled) {
        if (this.disabled) return;
        this.disabled = true;
        this.classList.add('disabled');
    }

    const duration = 2000;
    const end = Date.now() + duration;
    const button = this;

    function frame() {
        // 左侧发射点 - 移到屏幕外
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: {x: -0.1}, // 修改为负值，使起点在屏幕左侧外
            y: 0,
            gravity: 2.5,
            scalar: 0.7,
            drift: 0,
            ticks: 150,
            colors: ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#5851DB'],
        });

        // 右侧发射点 - 移到屏幕外
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: {x: 1.1}, // 修改为大于1的值，使起点在屏幕右侧外
            y: 0,
            gravity: 2.5,
            scalar: 0.7,
            drift: 0,
            ticks: 150,
            colors: ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#5851DB'],
        });

        // 添加从屏幕顶部往下的彩纸效果
        confetti({
            particleCount: 10,
            angle: 90, // 垂直向下
            spread: 60,
            origin: { x: 0.5, y: -0.1 }, // y设为负值，表示在屏幕顶部以上
            gravity: 1.5, // 适当减小重力使彩纸下落更自然
            scalar: 0.7,
            drift: 0,
            ticks: 150,
            colors: ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#5851DB'],
        });

        // 如果时间未到，继续执行
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        } else {
            if (cooldownEnabled) {
                setTimeout(function () {
                    button.disabled = false;
                    button.classList.remove('disabled');
                }, 500); // 500ms冷却时间
            }
        }
    }

    frame();
});