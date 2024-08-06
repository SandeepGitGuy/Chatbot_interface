async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    // Append user's message to chatbox
    appendMessage('You', userInput);
    document.getElementById('userInput').value = '';

    try {
        const response = await fetch('https://ssqws0bitc.execute-api.ap-southeast-1.amazonaws.com/Dev/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        appendMessage('Bot', data.response);
    } catch (error) {
        console.error('Error:', error);
        appendMessage('Bot', 'There was an error processing your request.');
    }
}

function appendMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}
