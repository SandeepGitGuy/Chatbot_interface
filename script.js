document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userMessage = userInput.value;
        
        chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;
        
        userInput.value = '';

        try {
            console.log('Sending request with message:', userMessage);
            const response = await fetch('https://ssqws0bitc.execute-api.ap-southeast-1.amazonaws.com/Dev/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw response data:', data);

            let aiResponse;
            if (typeof data.body === 'string') {
                try {
                    const parsedBody = JSON.parse(data.body);
                    console.log('Parsed body:', parsedBody);
                    aiResponse = parsedBody.response;
                } catch (parseError) {
                    console.error('Error parsing body:', parseError);
                    aiResponse = data.body;
                }
            } else if (data.body && data.body.response) {
                aiResponse = data.body.response;
            } else if (data.response) {
                aiResponse = data.response;
            } else {
                throw new Error('Unexpected response format');
            }

            console.log('AI Response:', aiResponse);

            if (aiResponse) {
                chatBox.innerHTML += `<div class="ai-message"><strong>AI:</strong> ${aiResponse}</div>`;
            } else {
                throw new Error('No AI response found in the data');
            }

        } catch (error) {
            console.error('Error:', error);
            chatBox.innerHTML += `<div class="error-message"><strong>Error:</strong> ${error.message}</div>`;
        }
    });
});
