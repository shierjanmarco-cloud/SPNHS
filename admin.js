// Admin Login & Management System
// Using GitHub OAuth for authentication

const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // You'll need to set this up
const ALLOWED_GITHUB_USERNAME = 'shierjanmarco-cloud'; // Your GitHub username

// Initialize admin system
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
    loadSavedContent();
    loadSavedMessages();
});

function initializeAdmin() {
    const adminLink = document.getElementById('admin-link');
    const adminModal = document.getElementById('admin-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminModal();
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // GitHub Login Button
    const githubLoginBtn = document.getElementById('github-login-btn');
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', handleGitHubLogin);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Check if already logged in
    checkAuthStatus();
}

function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.classList.add('show');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.remove('show');
}

// Simple Auth Storage (for demo - in production use proper OAuth)
function handleGitHubLogin() {
    // For demo purposes, we'll use localStorage
    // In production, implement proper GitHub OAuth flow
    
    const username = prompt('Enter your GitHub username for verification:');
    
    if (username === ALLOWED_GITHUB_USERNAME) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_email', 'shierjan.marco@deped.gov.ph');
        localStorage.setItem('admin_avatar', 'https://avatars.githubusercontent.com/u/291324086?v=4');
        
        showAdminPanel();
    } else {
        alert('Access denied. Only ' + ALLOWED_GITHUB_USERNAME + ' can access admin panel.');
    }
}

function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_avatar');
    
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    
    alert('Logged out successfully');
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    }
}

function showAdminPanel() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    
    const username = localStorage.getItem('admin_username') || 'Admin';
    const email = localStorage.getItem('admin_email') || 'admin@spnhs.edu.ph';
    const avatar = localStorage.getItem('admin_avatar') || 'https://via.placeholder.com/50';
    
    document.getElementById('admin-username').textContent = username;
    document.getElementById('admin-email').textContent = email;
    document.getElementById('admin-avatar').src = avatar;
}

// Content Editing Functions
function editContent(contentType) {
    const modal = document.getElementById('edit-modal');
    const textarea = document.getElementById('edit-textarea');
    const title = document.getElementById('edit-title');
    
    const contentMap = {
        'mission': { title: 'Edit Mission Statement', elementId: 'mission-content' },
        'vision': { title: 'Edit Vision Statement', elementId: 'vision-content' },
        'values': { title: 'Edit Core Values', elementId: 'values-content' },
        'phone': { title: 'Edit Phone Number', elementId: 'phone-display' },
        'email': { title: 'Edit Email Address', elementId: 'email-display' }
    };
    
    const config = contentMap[contentType];
    title.textContent = config.title;
    
    const element = document.getElementById(config.elementId);
    textarea.value = element.textContent;
    textarea.dataset.contentType = contentType;
    textarea.dataset.elementId = config.elementId;
    
    modal.classList.add('show');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
}

document.getElementById('save-edit-btn')?.addEventListener('click', () => {
    const textarea = document.getElementById('edit-textarea');
    const contentType = textarea.dataset.contentType;
    const elementId = textarea.dataset.elementId;
    const newContent = textarea.value;
    
    // Update the DOM
    document.getElementById(elementId).textContent = newContent;
    
    // Save to localStorage
    localStorage.setItem(`content_${contentType}`, newContent);
    
    // Also update in relevant sections
    if (contentType === 'phone') {
        document.getElementById('phone-display').textContent = newContent;
    } else if (contentType === 'email') {
        document.getElementById('email-display').textContent = newContent;
    }
    
    alert('Content updated successfully!');
    closeEditModal();
});

// Load saved content
function loadSavedContent() {
    const contentMap = {
        'mission': 'mission-content',
        'vision': 'vision-content',
        'values': 'values-content',
        'phone': 'phone-display',
        'email': 'email-display'
    };
    
    Object.entries(contentMap).forEach(([key, elementId]) => {
        const saved = localStorage.getItem(`content_${key}`);
        if (saved) {
            document.getElementById(elementId).textContent = saved;
        }
    });
}

// View Contact Messages
function viewMessages() {
    const modal = document.getElementById('messages-modal');
    const messagesList = document.getElementById('messages-list');
    
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p class="no-messages">No messages yet</p>';
    } else {
        messagesList.innerHTML = messages.map((msg, index) => `
            <div class="message-item">
                <h4>${msg.name}</h4>
                <p class="message-email">📧 ${msg.email}</p>
                <p>${msg.message}</p>
                <p class="message-date">📅 ${new Date(msg.timestamp).toLocaleString()}</p>
                <button onclick="deleteMessage(${index})" class="delete-msg-btn">Delete</button>
            </div>
        `).join('');
    }
    
    modal.classList.add('show');
}

function deleteMessage(index) {
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    viewMessages();
}

function loadSavedMessages() {
    // Messages are saved from the contact form
}

// Add to existing script.js
// Make sure this is added to the existing contact form handler

const existingContactFormHandler = () => {
    document.getElementById('contact-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        if (name && email && message) {
            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            messages.push({
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        }
    });
};

document.addEventListener('DOMContentLoaded', existingContactFormHandler);
