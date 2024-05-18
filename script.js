document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function createRipple() {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        const size = getRandomInt(100, 300);
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.top = `${getRandomInt(0, window.innerHeight)}px`;
        ripple.style.left = `${getRandomInt(0, window.innerWidth)}px`;
        ripple.style.backgroundColor = 'rgba(0, 100, 0, 0.3)'; // 深绿色半透明
        body.appendChild(ripple);
    }

    function createDot() {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const size = getRandomInt(10, 50);
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.top = `${getRandomInt(0, window.innerHeight)}px`;
        dot.style.left = `${getRandomInt(0, window.innerWidth)}px`;
        dot.style.backgroundColor = 'rgba(0, 100, 0, 0.3)'; // 深绿色半透明
        body.appendChild(dot);
    }

    for (let i = 0; i < 20; i++) {
        createRipple();
        createDot();
    }
});
