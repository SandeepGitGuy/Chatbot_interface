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
            // Send request to the API
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

            // Extract AI response
            let aiResponse;
            if (typeof data.body === 'string') {
                try {
                    const parsedBody = JSON.parse(data.body);
                    aiResponse = parsedBody.response;
                } catch {
                    aiResponse = data.body;
                }
            } else if (data.body && data.body.response) {
                aiResponse = data.body.response;
            } else if (data.response) {
                aiResponse = data.response;
            } else {
                throw new Error('Unexpected response format');
            }

            // Append AI's response to the chat box and apply typing effect
            if (aiResponse) {
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.classList.add('ai-message', 'typing-effect');
                aiMessageDiv.innerHTML = `<strong>Trip Sage:</strong> `;
                chatBox.appendChild(aiMessageDiv);
                chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

                // Function to simulate typing effect
                function typeWriter(element, text, speed) {
                    let i = 0;
                    let lines = text.split('\n'); // Split text by lines
                    let lineIndex = 0;
                    let charIndex = 0;

                    function typeLine() {
                        if (lineIndex < lines.length) {
                            if (charIndex < lines[lineIndex].length) {
                                element.innerHTML += lines[lineIndex].charAt(charIndex);
                                charIndex++;
                                setTimeout(typeLine, speed);
                            } else {
                                element.innerHTML += '<br>'; // Add a line break after each line
                                lineIndex++;
                                charIndex = 0;
                                setTimeout(typeLine, speed); // Wait a bit before starting the next line
                            }
                        }
                    }

                    typeLine();
                }

                typeWriter(aiMessageDiv, aiResponse, 50); // Adjust speed as needed
            } else {
                throw new Error('No AI response found in the data');
            }

        } catch (error) {
            // Handle errors
            chatBox.innerHTML += `<div class="error-message"><strong>Error:</strong> ${error.message}</div>`;
        }
    });
});
