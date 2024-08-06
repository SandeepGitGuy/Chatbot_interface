document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userMessage = userInput.value;
        
        // Append the user's message to the chat box
        chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;
        
        // Clear the input field
        userInput.value = '';

        try {
            const response = await fetch('https://ssqws0bitc.execute-api.ap-southeast-1.amazonaws.com/Dev/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            
            // Append the AI's response to the chat box
            chatBox.innerHTML += `<div class="ai-message"><strong>AI:</strong> ${data.response}</div>`;
        } catch (error) {
            console.error('Error:', error);
            chatBox.innerHTML += `<div class="error-message"><strong>Error:</strong> Could not get a response from the server.</div>`;
        }
    });
});
