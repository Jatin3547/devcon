// Check if user is logged in and update navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser && authButtons) {
        authButtons.innerHTML = `
            <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
            <a href="#" class="btn btn-primary" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Initialize page-specific functionality
    initPage();
});

function initPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    switch(page) {
        case 'signup.html':
            initSignup();
            break;
        case 'login.html':
            initLogin();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
        case 'ask.html':
            initAsk();
            break;
        case 'mentors.html':
            initMentors();
            break;
    }
}

// Signup functionality
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const branch = document.getElementById('branch').value;
            const year = document.getElementById('year').value;
            
            // Get existing users from localStorage
            const existingUsers = JSON.parse(localStorage.getItem('campusConnectUsers')) || [];
            
            // Check if email already exists
            const userExists = existingUsers.find(user => user.email === email);
            if (userExists) {
                showAlert('An account with this email already exists.', 'danger');
                return;
            }
            
            // Create new user object
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                branch,
                year,
                joined: new Date().toISOString()
            };
            
            // Add to users array
            existingUsers.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('campusConnectUsers', JSON.stringify(existingUsers));
            
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            showAlert('Account created successfully! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
}

// Login functionality
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get existing users from localStorage
            const existingUsers = JSON.parse(localStorage.getItem('campusConnectUsers')) || [];
            
            // Find user with matching credentials
            const user = existingUsers.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Set current user
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showAlert('Login successful! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert('Invalid email or password. Please try again.', 'danger');
            }
        });
    }
}

// Dashboard functionality
function initDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.name}!`;
    }
}

// Ask functionality
function initAsk() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const askForm = document.getElementById('askForm');
    if (askForm) {
        askForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const questionText = document.getElementById('question').value;
            
            // Get existing questions from localStorage
            const existingQuestions = JSON.parse(localStorage.getItem('campusConnectQuestions')) || [];
            
            // Create new question object
            const newQuestion = {
                id: Date.now(),
                userId: currentUser.id,
                userName: currentUser.name,
                userBranch: currentUser.branch,
                userYear: currentUser.year,
                question: questionText,
                timestamp: new Date().toISOString(),
                answers: []
            };
            
            // Add to questions array
            existingQuestions.unshift(newQuestion);
            
            // Save to localStorage
            localStorage.setItem('campusConnectQuestions', JSON.stringify(existingQuestions));
            
            // Clear form
            document.getElementById('question').value = '';
            
            // Reload questions
            loadQuestions();
            
            showAlert('Your question has been posted successfully!', 'success');
        });
    }
    
    // Load existing questions
    loadQuestions();
}

function loadQuestions() {
    const questionsList = document.getElementById('questionsList');
    if (!questionsList) return;
    
    const existingQuestions = JSON.parse(localStorage.getItem('campusConnectQuestions')) || [];
    
    if (existingQuestions.length === 0) {
        questionsList.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No questions yet. Be the first to ask!</p>';
        return;
    }
    
    questionsList.innerHTML = existingQuestions.map(question => `
        <div class="question-card">
            <div class="question-text">${question.question}</div>
            <div class="question-meta">
                <span>By ${question.userName} (${question.userBranch}, ${question.userYear})</span>
                <span>${formatDate(question.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

// Mentors functionality
function initMentors() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    loadMentors();
}

function loadMentors() {
    const mentorsGrid = document.querySelector('.mentors-grid');
    if (!mentorsGrid) return;
    
    // Static demo data for mentors
    const mentors = [
        {
            id: 1,
            name: "Rajesh Kumar",
            branch: "Computer Science",
            year: "4th Year",
            skills: ["Web Development", "Data Structures", "Python", "Machine Learning"],
            avatar: "R"
        },
        {
            id: 2,
            name: "Priya Sharma",
            branch: "Electrical Engineering",
            year: "3rd Year",
            skills: ["Circuit Design", "Embedded Systems", "MATLAB", "IoT"],
            avatar: "P"
        },
        {
            id: 3,
            name: "Amit Patel",
            branch: "Mechanical Engineering",
            year: "4th Year",
            skills: ["CAD Design", "Thermodynamics", "Robotics", "3D Modeling"],
            avatar: "A"
        },
        {
            id: 4,
            name: "Sneha Reddy",
            branch: "Business Administration",
            year: "3rd Year",
            skills: ["Marketing", "Finance", "Business Strategy", "Leadership"],
            avatar: "S"
        },
        {
            id: 5,
            name: "Vikram Singh",
            branch: "Civil Engineering",
            year: "4th Year",
            skills: ["Structural Design", "Construction Management", "AutoCAD", "Project Planning"],
            avatar: "V"
        },
        {
            id: 6,
            name: "Neha Gupta",
            branch: "Computer Science",
            year: "3rd Year",
            skills: ["Android Development", "UI/UX Design", "Java", "Firebase"],
            avatar: "N"
        }
    ];
    
    mentorsGrid.innerHTML = mentors.map(mentor => `
        <div class="mentor-card">
            <div class="mentor-header">
                <div class="mentor-avatar">${mentor.avatar}</div>
                <div class="mentor-info">
                    <h3>${mentor.name}</h3>
                    <p>${mentor.branch}, ${mentor.year}</p>
                </div>
            </div>
            <div class="mentor-skills">
                ${mentor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="mentor-actions">
                <button class="btn btn-outline">View Profile</button>
                <button class="btn btn-primary">Message</button>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
