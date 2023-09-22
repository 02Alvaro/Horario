document.addEventListener("DOMContentLoaded", () => {
    const buttonElements = document.querySelectorAll('.Btn'); 
    
    const sendMessage = (action) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action});
        });
    };

    buttonElements.forEach((buttonElement) => {
        const action = buttonElement.id; 
        buttonElement.addEventListener("click", () => sendMessage(action));
    });
});
