document.addEventListener('DOMContentLoaded', function () {
    // 获取所有需要确认的按钮
    const confirmationButtons = document.querySelectorAll('.minimalism-button[require-confirmation="true"]');

    confirmationButtons.forEach(button => {
        let clickState = 0; // 0: 初始状态，1: 半填充状态，2: 确认状态
        let isTransitioning = false;

        button.addEventListener('click', function (event) {
            event.preventDefault();

            if (isTransitioning) {
                return;
            }

            if (clickState === 0) {
                // 第一次点击：半填充状态
                button.classList.remove('initial-state');
                button.classList.add('half-filled');
                clickState = 1;
            } else if (clickState === 1) {
                // 第二次点击：确认状态
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
                        isTransitioning = false;

                        // 确认完成后，触发一个自定义事件，表示确认完成
                        const confirmedEvent = new CustomEvent('confirmation-complete', {
                            bubbles: true,
                            detail: { button: button }
                        });
                        button.dispatchEvent(confirmedEvent);
                    };
                    button.addEventListener('transitionend', transitionEndHandler);
                }, 700);
            }
        });

        // 点击外部取消确认
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

function addOnButtonClickListener(button, listener) {
    const requireConfirmation = button.getAttribute('require-confirmation') === 'true';
    if (requireConfirmation) {
        button.addEventListener('confirmation-complete', listener);
    } else {
        button.addEventListener('click', listener);
    }
}