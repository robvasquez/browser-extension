chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background script:', message);

    if (message.type === 'FETCH_DIALOG_URL') {
        // Implement PKCE authentication and fetch dialog URL
        const dialogUrl = 'https://example.com/dialog'; // Replace with actual dialog URL fetching logic
        console.log('Fetching dialog URL:', dialogUrl);
        sendResponse({ dialogUrl });
    } else if (message.type === 'DOWNLOAD_FILE') {
        const { url, filename } = message;
        console.log('Initiating download:', { url, filename });
        chrome.downloads.download({
            url,
            filename,
            saveAs: true
        });
    }
    return true;
});
