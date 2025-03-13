document.addEventListener('DOMContentLoaded', function () {
    const colorButtons = document.querySelectorAll('.color-button');
    const redButton = document.querySelector('.color-button-red');
    redButton.classList.add('active');

    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const color = this.getAttribute('data-color');
            document.body.style.backgroundColor = color;
            localStorage.setItem('preferredTheme', color);
        });
    });

    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        document.body.style.backgroundColor = savedTheme;
        // 找到对应按钮并激活
        colorButtons.forEach(btn => {
            if (btn.getAttribute('data-color') === savedTheme) {
                colorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    }
});