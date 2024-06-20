document.addEventListener('DOMContentLoaded', () => {
    console.log('Content script loaded and DOM fully loaded');

    const inputElements = document.querySelectorAll('input[type="file"]');
    console.log('Found input elements:', inputElements);

    inputElements.forEach(input => {
        input.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('File input clicked, opening custom dialog');
            openCustomDialog(input);
        });
    });

    function openCustomDialog(input) {
        chrome.runtime.sendMessage({ type: 'FETCH_DIALOG_URL' }, (response) => {
            console.log('Received dialog URL from background script:', response.dialogUrl);
            const dialogUrl = response.dialogUrl;
            const dialogWindow = window.open(dialogUrl, 'Custom Dialog', 'width=600,height=400');

            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) return;

                console.log('Received message from custom dialog:', event.data);
                const files = event.data.files; // Assuming the dialog sends files in this format
                if (files) {
                    const dataTransfer = new DataTransfer();
                    files.forEach(file => dataTransfer.items.add(file));
                    input.files = dataTransfer.files;
                    console.log('Files assigned to input element:', input.files);
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, false);
        });
    }
});
