document.addEventListener('DOMContentLoaded', function () {
    // 获取所有按钮
    const buttons = document.querySelectorAll('.button-link');

    buttons.forEach(button => {
        let clickState = 0; // 0: 初始状态，1: 半填充状态，2: 确认状态
        let isTransitioning = false;

        const targetUrl = button.getAttribute('data-target-url') || 'original_website.html';

        button.addEventListener('click', function (event) {
            event.preventDefault();

            if (isTransitioning) {
                return;
            }

            if (clickState === 0) {
                button.classList.remove('initial-state');
                button.classList.add('half-filled');
                clickState = 1;
            } else if (clickState === 1) {
                button.classList.remove('half-filled');
                button.classList.add('fully-filled');
                clickState = 2;
                isTransitioning = true;

                setTimeout(function () {
                    button.classList.remove('fully-filled');
                    button.classList.add('initial-state');
                    clickState = 0;
                    // 监听过渡动画结束事件
                    const transitionEndHandler = function () {
                        // 移除事件监听器
                        button.removeEventListener('transitionend', transitionEndHandler);
                        isTransitioning = false
                        window.location.href = targetUrl;
                    };
                    button.addEventListener('transitionend', transitionEndHandler);
                }, 700);


            }
        });

        document.addEventListener('click', function (event) {
            if (clickState === 1 && !button.contains(event.target)) {
                // 半填充状态且点击按钮外部时重置
                button.classList.remove('half-filled');
                button.classList.add('initial-state');
                clickState = 0;
            }
        });
    });
});