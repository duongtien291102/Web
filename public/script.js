// Global variables
let isTyping = false;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const addModal = document.getElementById('addModal');
const addDataForm = document.getElementById('addDataForm');
const dataList = document.getElementById('dataList');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Chat functionality
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Modal functionality
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === addModal) {
            closeModal();
        }
    });

    // Form submission
    addDataForm.addEventListener('submit', handleAddData);

    // Load initial data
    loadData();
});

// Chat Functions
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message })
        });

        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();

        if (data.success) {
            addMessage(data.response, 'ai');
        } else {
            addMessage('Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.', 'ai');
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Xin lỗi, không thể kết nối đến AI service.', 'ai');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const icon = document.createElement('i');
    icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    messageContent.appendChild(icon);
    messageContent.appendChild(paragraph);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot';
    
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<span class="loading"></span> AI đang suy nghĩ...';
    
    messageContent.appendChild(icon);
    messageContent.appendChild(paragraph);
    typingDiv.appendChild(messageContent);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Data Management Functions
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (data.success) {
            displayData(data.data);
        } else {
            showNotification('Không thể tải dữ liệu', 'error');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

function displayData(data) {
    dataList.innerHTML = '';
    
    if (data.length === 0) {
        dataList.innerHTML = '<div class="data-item"><p>Chưa có dữ liệu nào</p></div>';
        return;
    }
    
    data.forEach(item => {
        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';
        dataItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <small>ID: ${item.id}</small>
        `;
        dataList.appendChild(dataItem);
    });
}

function showAddForm() {
    addModal.style.display = 'block';
    document.getElementById('name').focus();
}

function closeModal() {
    addModal.style.display = 'none';
    addDataForm.reset();
}

async function handleAddData(e) {
    e.preventDefault();
    
    const formData = new FormData(addDataForm);
    const data = {
        name: formData.get('name'),
        description: formData.get('description')
    };
    
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Dữ liệu đã được lưu thành công!', 'success');
            closeModal();
            loadData(); // Reload data
        } else {
            showNotification('Lỗi khi lưu dữ liệu', 'error');
        }
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state to buttons
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Đang xử lý...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// Health check on page load
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Server health:', data);
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Run health check when page loads
checkHealth(); 