document.addEventListener('DOMContentLoaded', function () {
    const navigationButtons = document.querySelectorAll('.minimalism-button[data-target-url]');

    navigationButtons.forEach(button => {
        const targetUrl = button.getAttribute('data-target-url');


        if (!targetUrl) {
            return;
        }

        addOnButtonClickListener(button, function () {
            window.location.href = targetUrl;
        })
    });
});