// ===== PAGE MANAGEMENT =====
function showPage(pageId) {
    console.log('🔄 Switching to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('✅ Now showing page:', pageId);
    } else {
        console.error('❌ Target page not found:', pageId);
    }
    
    // Special handling for app page
    if (pageId === 'app-page') {
        // Show goal setup first
        showSection('goal-setup');
        // Initialize app
        initializeApp();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showPage('landing-page');
    }
}

// Simple function for the landing page button
function switchToLogin() {
    console.log('🎯 Start button clicked! Switching to login page...');
    showPage('login-page');
}

// ===== NAVIGATION MANAGEMENT =====
function toggleNav() {
    const nav = document.querySelector('.vertical-nav');
    const mainContent = document.querySelector('.main-content');
    
    if (nav && mainContent) {
        nav.classList.toggle('active');
        mainContent.classList.toggle('with-nav');
    }
}

function showSection(sectionId) {
    console.log('🔄 Switching to section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Now showing section:', sectionId);
    } else {
        console.error('❌ Target section not found:', sectionId);
    }
    
    // Load data for specific sections
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    console.log('📥 Loading data for section:', sectionId);
    switch(sectionId) {
        case 'dashboard':
            loadWorkouts();
            updateDashboardProfile();
            updateDashboardGoals();
            updateEnhancedDashboard();
            break;
        case 'history':
            loadWorkouts();
            break;
        case 'bmi-calculator':
            loadProfile();
            break;
        case 'body-measurements':
            loadBodyMeasurements();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'exercise-library':
            loadExercises(); // FIXED: This will now load exercises
            break;
        case 'progress-charts':
            loadProgressCharts(); // FIXED: This will now load charts
            break;
    }
}

// ===== ENHANCED INITIALIZATION =====
function initializeEventListeners() {
    console.log('🔧 Initializing event listeners...');
    
    // Start Journey Button
    const startButton = document.getElementById('start-journey-btn');
    if (startButton) {
        console.log('✅ Found start journey button');
        startButton.addEventListener('click', switchToLogin);
    } else {
        console.error('❌ Start journey button not found!');
    }
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('📝 Login form submitted');
            handleLogin();
        });
    } else {
        console.error('❌ Login form not found!');
    }
    
    // Direct login button click as backup
    const loginBtn = document.getElementById('login-submit-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('🖱️ Login button clicked directly');
            handleLogin();
        });
    }
    
    // Setup goal forms
    setupGoalForms();
    
    // Setup other forms
    setupWorkoutForm();
    setupProfileForm();
    setupMeasurementForm();
}

function handleLogin() {
    console.log('🎯 Handling login process...');
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    if (!username || !password) {
        console.error('❌ Username or password fields not found');
        alert('Login form not properly loaded. Please refresh the page.');
        return;
    }
    
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    
    console.log('📋 Login attempt:', { username: usernameValue, password: '***' });
    
    if (usernameValue && passwordValue) {
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            loginBtn.disabled = true;
        }
        
        console.log('✅ Login successful, switching to app...');
        
        // Simulate API call delay
        setTimeout(() => {
            showPage('app-page');
            
            // Reset login form
            if (loginBtn) {
                loginBtn.textContent = 'Sign In';
                loginBtn.style.background = '';
                loginBtn.disabled = false;
            }
            document.getElementById('login-form').reset();
        }, 1000);
    } else {
        alert('Please enter both username and password');
    }
}

// ===== GOAL SETUP HANDLING =====
function setupGoalForms() {
    console.log('🎯 Setting up goal forms...');
    
    // Initial goal form (after login)
    const initialGoalForm = document.getElementById('initial-goal-form');
    if (initialGoalForm) {
        initialGoalForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleInitialGoalSetup(this);
        });
    }

    // Regular goal form
    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleRegularGoalSetup(this);
        });
    }

    // Update goal unit display for initial form
    const goalTypeSelect = document.getElementById('initial-goal-type');
    if (goalTypeSelect) {
        goalTypeSelect.addEventListener('change', function() {
            updateGoalUnitDisplay('initial');
        });
    }

    // Update goal unit display for regular form
    const regularGoalType = document.getElementById('goal-type');
    if (regularGoalType) {
        regularGoalType.addEventListener('change', function() {
            updateGoalUnitDisplay('regular');
        });
    }
}

function updateGoalUnitDisplay(formType) {
    const prefix = formType === 'initial' ? 'initial-' : '';
    const goalTypeSelect = document.getElementById(`${prefix}goal-type`);
    const unitElement = document.getElementById(`${prefix}target-unit`);
    
    if (goalTypeSelect && unitElement) {
        const goalType = goalTypeSelect.value;
        const units = {
            'target_weight': 'kg',
            'workout_frequency': 'workouts/week',
            'calorie_burn': 'calories',
            'exercise_target': 'reps'
        };
        unitElement.textContent = units[goalType] || '';
    }
}

async function handleInitialGoalSetup(form) {
    const formData = new FormData(form);
    const goalData = {
        goal_type: formData.get('goal_type'),
        target_value: parseFloat(formData.get('target_value')),
        target_date: formData.get('target_date') || null
    };

    try {
        // For demo purposes, we'll skip the API check and just set the goal
        const setResponse = await fetch('/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(goalData)
        });

        const result = await setResponse.json();
        
        if(setResponse.ok) {
            // Show success and move to dashboard
            const setupBtn = form.querySelector('.setup-btn');
            if (setupBtn) {
                setupBtn.textContent = 'Goal Set! Redirecting...';
                setupBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            }
            
            setTimeout(() => {
                showSection('dashboard');
            }, 1500);
        } else {
            alert('Error setting goal: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error setting goal:', error);
        // For demo, still proceed to dashboard
        const setupBtn = form.querySelector('.setup-btn');
        if (setupBtn) {
            setupBtn.textContent = 'Goal Set! Redirecting...';
            setupBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        }
        
        setTimeout(() => {
            showSection('dashboard');
        }, 1500);
    }
}

async function handleRegularGoalSetup(form) {
    const formData = new FormData(form);
    const goalData = {
        goal_type: formData.get('goal_type'),
        target_value: parseFloat(formData.get('target_value')),
        target_date: formData.get('target_date') || null
    };

    try {
        await setGoalWithValidation(goalData);
        
        const messageElement = document.getElementById('goal-message');
        if (messageElement) {
            messageElement.textContent = "Goal set successfully!";
            messageElement.style.color = '#00ff00';
        }
        
        form.reset();
        loadGoals();
    } catch (error) {
        const messageElement = document.getElementById('goal-message');
        if (messageElement) {
            messageElement.textContent = error.message;
            messageElement.style.color = '#FF0000';
        }
    }
}

async function setGoalWithValidation(goalData) {
    try {
        const setResponse = await fetch('/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(goalData)
        });

        const result = await setResponse.json();
        
        if(!setResponse.ok) {
            throw new Error(result.error || 'Failed to set goal');
        }

        return result;
    } catch (error) {
        throw error;
    }
}

// ===== FORM SETUP FUNCTIONS =====
function setupWorkoutForm() {
    const workoutForm = document.getElementById('workout-form');
    if (workoutForm) {
        workoutForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleWorkoutSubmission(this);
        });
    }
}

function setupProfileForm() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleProfileSubmission(this);
        });
    }
}

function setupMeasurementForm() {
    const measurementForm = document.getElementById('measurement-form');
    if (measurementForm) {
        measurementForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleMeasurementSubmission(this);
        });
    }
}

// ===== INITIALIZATION =====
function initializeApp() {
    console.log("🚀 Initializing WebFit Tracker...");
    // Load any initial app data
    loadWorkouts();
    updateDashboardProfile();
    updateEnhancedDashboard();
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏋️‍♂️ WebFit Tracker Loaded!");
    
    // Initialize all event listeners
    initializeEventListeners();
    
    // Start with landing page
    showPage('landing-page');
    
    // Debug info
    console.log('📄 All pages:', document.querySelectorAll('.page').length);
    console.log('🔘 Start button:', document.getElementById('start-journey-btn'));
    console.log('🔘 Login form:', document.getElementById('login-form'));
});

// ===== EXISTING FITNESS TRACKER FUNCTIONS =====

// Basic workout functions
async function loadWorkouts() {
    try {
        const response = await fetch('/api/workouts');
        const data = await response.json();

        // Update dashboard list
        const workoutList = document.getElementById('workout-list');
        if (workoutList) {
            workoutList.innerHTML = '';
            
            if (data.workouts && data.workouts.length > 0) {
                data.workouts.slice(0, 5).forEach(workout => {
                    const li = document.createElement('li');
                    li.textContent = `${workout.exercise_name} - ${workout.duration_minutes} min (${workout.calories_burned} cal) - ${new Date(workout.date).toLocaleDateString()}`;
                    workoutList.appendChild(li);
                });
            } else {
                workoutList.innerHTML = '<li>No workouts logged yet. Start by logging your first workout!</li>';
            }
        }

        // Update dashboard stats
        const totalCalories = data.workouts ? data.workouts.reduce((sum, workout) => sum + workout.calories_burned, 0) : 0;
        const totalCaloriesElement = document.getElementById('total-calories');
        const weeklyCountElement = document.getElementById('total-workouts-count');
        
        if (totalCaloriesElement) totalCaloriesElement.textContent = totalCalories;
        if (weeklyCountElement) weeklyCountElement.textContent = data.workouts ? data.workouts.length : 0;
        
    } catch (error) {
        console.error('Error loading workouts:', error);
    }
}

async function handleWorkoutSubmission(form) {
    const formData = new FormData(form);
    const workoutData = {
        exercise_name: formData.get('exercise_name'),
        duration_minutes: parseInt(formData.get('duration_minutes')),
        calories_burned: parseInt(formData.get('calories_burned'))
    };

    try {
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workoutData)
        });

        const result = await response.json();
        const messageElement = document.getElementById('form-message');
        
        if(response.ok) {
            messageElement.textContent = result.message;
            messageElement.style.color = 'green';
            form.reset();
            loadWorkouts();
            showSection('dashboard');
        } else {
            messageElement.textContent = result.error || 'Failed to log workout.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error logging workout:', error);
        const messageElement = document.getElementById('form-message');
        if (messageElement) {
            messageElement.textContent = 'Failed to log workout. Check your connection.';
            messageElement.style.color = 'red';
        }
    }
}

// Profile functions
async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.profile) {
            const nameInput = document.getElementById('name');
            const ageInput = document.getElementById('age');
            const heightInput = document.getElementById('height');
            const weightInput = document.getElementById('weight');
            
            if (nameInput) nameInput.value = data.profile.name || '';
            if (ageInput) ageInput.value = data.profile.age || '';
            if (heightInput) heightInput.value = data.profile.height_cm || '';
            if (weightInput) weightInput.value = data.profile.initial_weight_kg || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function handleProfileSubmission(form) {
    const formData = new FormData(form);
    const profileData = {
        name: formData.get('name'),
        age: parseInt(formData.get('age')),
        height_cm: parseFloat(formData.get('height_cm')),
        weight_kg: parseFloat(formData.get('weight_kg'))
    };
    
    // Calculate BMI immediately
    const bmi = calculateBMI(profileData.weight_kg, profileData.height_cm);
    const category = getBMICategory(bmi);
    
    // Display BMI result
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiResult = document.getElementById('bmi-result');
    
    if (bmiValue) bmiValue.textContent = bmi;
    if (bmiCategory) bmiCategory.textContent = category;
    if (bmiResult) bmiResult.style.display = 'block';
    
    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });
        
        const result = await response.json();
        const messageElement = document.getElementById('bmi-message');
        
        if(response.ok) {
            messageElement.textContent = "Profile saved successfully! BMI calculated.";
            messageElement.style.color = 'green';
            
            // Update dashboard profile
            updateDashboardProfile();
        } else {
            messageElement.textContent = result.error || 'Failed to save profile.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        const messageElement = document.getElementById('bmi-message');
        if (messageElement) {
            messageElement.textContent = 'Error saving profile. Check your connection.';
            messageElement.style.color = 'red';
        }
    }
}

// BMI Calculator functions
function calculateBMI(weight_kg, height_cm) {
    if (!weight_kg || !height_cm) return null;
    const height_m = height_cm / 100;
    return (weight_kg / (height_m * height_m)).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

// Dashboard functions
async function updateDashboardProfile() {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.profile) {
            const profile = data.profile;
            const profileName = document.getElementById('profile-name');
            const profileAge = document.getElementById('profile-age');
            const profileHeight = document.getElementById('profile-height');
            const profileWeight = document.getElementById('profile-weight');
            const profileBmi = document.getElementById('profile-bmi');
            const profileBmiCategory = document.getElementById('profile-bmi-category');
            
            if (profileName) profileName.textContent = profile.name || 'Not set';
            if (profileAge) profileAge.textContent = profile.age || '-';
            if (profileHeight) profileHeight.textContent = profile.height_cm || '-';
            if (profileWeight) profileWeight.textContent = profile.initial_weight_kg || '-';
            
            // Calculate and display BMI
            if (profile.initial_weight_kg && profile.height_cm) {
                const bmi = calculateBMI(profile.initial_weight_kg, profile.height_cm);
                const category = getBMICategory(bmi);
                if (profileBmi) profileBmi.textContent = bmi;
                if (profileBmiCategory) profileBmiCategory.textContent = category;
            }
        }
    } catch (error) {
        console.error('Error updating dashboard profile:', error);
    }
}

async function updateDashboardGoals() {
    try {
        const response = await fetch('/api/goals');
        const data = await response.json();
        
        const activeGoals = data.goals ? data.goals.filter(goal => !goal.is_completed).length : 0;
        const activeGoalsCount = document.getElementById('active-goals-count');
        if (activeGoalsCount) activeGoalsCount.textContent = activeGoals;
    } catch (error) {
        console.error('Error updating dashboard goals:', error);
    }
}

// Enhanced Dashboard
async function updateEnhancedDashboard() {
    try {
        // For demo purposes, set some default values
        document.getElementById('current-streak').textContent = '3';
        document.getElementById('monthly-workouts').textContent = '12';
        document.getElementById('monthly-calories').textContent = '3500';
        document.getElementById('active-days').textContent = '8';
        
    } catch (error) {
        console.error('Error updating enhanced dashboard:', error);
    }
}

// Health Metrics Calculator
async function calculateHealthMetrics() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (!weight || !height || !age || !gender) {
        alert('Please fill all fields for health metrics');
        return;
    }

    try {
        const response = await fetch('/api/health-metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                weight_kg: parseFloat(weight),
                height_cm: parseFloat(height),
                age: parseInt(age),
                gender: gender
            })
        });

        const data = await response.json();
        displayHealthResults(data);
    } catch (error) {
        console.error('Error calculating health metrics:', error);
        // For demo, show mock results
        displayHealthResults({
            bmi: 24.2,
            category: "Normal weight",
            healthRisk: "Lowest risk of health problems",
            bmr: 1680,
            idealWeightRange: {
                min: 58.5,
                max: 78.9
            },
            dailyCalorieNeeds: {
                sedentary: 2016,
                lightExercise: 2310,
                moderateExercise: 2604,
                heavyExercise: 2898
            }
        });
    }
}

function displayHealthResults(metrics) {
    const resultsDiv = document.getElementById('health-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `
        <div class="health-metrics-card">
            <h3>Your Health Metrics</h3>
            
            <div class="metric-row">
                <div class="metric">
                    <h4>BMI</h4>
                    <div class="metric-value ${getBMIColorClass(metrics.bmi)}">${metrics.bmi}</div>
                    <div class="metric-category">${metrics.category}</div>
                </div>
                
                <div class="metric">
                    <h4>BMR</h4>
                    <div class="metric-value">${metrics.bmr} cal/day</div>
                    <div class="metric-category">Basal Metabolic Rate</div>
                </div>
            </div>

            <div class="metric-section">
                <h4>Ideal Weight Range</h4>
                <p>${metrics.idealWeightRange.min} - ${metrics.idealWeightRange.max} kg</p>
            </div>

            <div class="metric-section">
                <h4>Daily Calorie Needs</h4>
                <ul>
                    <li>Sedentary: ${metrics.dailyCalorieNeeds.sedentary} calories</li>
                    <li>Light Exercise: ${metrics.dailyCalorieNeeds.lightExercise} calories</li>
                    <li>Moderate Exercise: ${metrics.dailyCalorieNeeds.moderateExercise} calories</li>
                    <li>Heavy Exercise: ${metrics.dailyCalorieNeeds.heavyExercise} calories</li>
                </ul>
            </div>

            <div class="metric-section">
                <h4>Health Assessment</h4>
                <p>${metrics.healthRisk}</p>
            </div>
        </div>
    `;
    resultsDiv.style.display = 'block';
}

function getBMIColorClass(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
}

// ===== FIXED PROGRESS CHARTS FUNCTIONS =====
let weeklyActivityChart, calorieTrendChart, exerciseDistributionChart, weightProgressChart;

async function loadProgressCharts() {
    try {
        console.log('📊 Loading progress charts...');
        
        // For demo purposes, we'll use mock data
        loadDemoChartData();
        
    } catch (error) {
        console.error('❌ Error loading progress charts:', error);
        loadDemoChartData();
    }
}

// Update the chart creation functions to include responsive options
function createWeeklyActivityChart(data) {
    const ctx = document.getElementById('weekly-activity-chart');
    if (!ctx) {
        console.error('❌ Weekly activity chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (weeklyActivityChart) {
        weeklyActivityChart.destroy();
    }

    weeklyActivityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Workouts',
                data: data.values,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Workouts This Week',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#ffffff', 
                        stepSize: 1,
                        padding: 5
                    },
                    grid: { 
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: { 
                        color: '#ffffff',
                        padding: 5
                    },
                    grid: { 
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// Add similar layout padding to other chart creation functions...

function createCalorieTrendChart(data) {
    const ctx = document.getElementById('calorie-trend-chart');
    if (!ctx) {
        console.error('❌ Calorie trend chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (calorieTrendChart) {
        calorieTrendChart.destroy();
    }

    calorieTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Calories Burned',
                data: data.values,
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: '#2ecc71',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '30-Day Calorie Burn Trend',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

function createExerciseDistributionChart(data) {
    const ctx = document.getElementById('exercise-distribution-chart');
    if (!ctx) {
        console.error('❌ Exercise distribution chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (exerciseDistributionChart) {
        exerciseDistributionChart.destroy();
    }

    exerciseDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12',
                    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
                ],
                borderWidth: 2,
                borderColor: '#1a1a1a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Exercise Distribution',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff', padding: 20 }
                }
            }
        }
    });
}

function createWeightProgressChart(data) {
    const ctx = document.getElementById('weight-progress-chart');
    if (!ctx) {
        console.error('❌ Weight progress chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (weightProgressChart) {
        weightProgressChart.destroy();
    }

    weightProgressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Weight (kg)',
                data: data.values,
                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                borderColor: '#9b59b6',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Weight Progress',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// Demo data for charts when API is not available
function loadDemoChartData() {
    console.log('📊 Loading demo chart data...');
    
    // Demo weekly activity
    const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = [2, 1, 3, 2, 1, 4, 2];
    
    // Demo calorie trend (last 7 days)
    const calorieLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const calorieData = [300, 150, 450, 300, 150, 600, 300];
    
    // Demo exercise distribution
    const exerciseLabels = ['Running', 'Push-ups', 'Squats', 'Cycling', 'Yoga'];
    const exerciseData = [8, 6, 5, 4, 3];
    
    // Demo weight progress
    const weightLabels = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29'];
    const weightData = [75, 74.5, 74, 73.5, 73];

    createWeeklyActivityChart({
        labels: weeklyLabels,
        values: weeklyData
    });

    createCalorieTrendChart({
        labels: calorieLabels,
        values: calorieData
    });

    createExerciseDistributionChart({
        labels: exerciseLabels,
        values: exerciseData
    });

    createWeightProgressChart({
        labels: weightLabels,
        values: weightData
    });
}

// ===== FIXED EXERCISE LIBRARY FUNCTIONS =====
async function loadExercises(category = 'all', difficulty = 'all') {
    try {
        console.log('📚 Loading exercises...');
        
        let exercises = [];
        
        // Try to fetch from API first
        try {
            const response = await fetch('/api/exercises');
            if (response.ok) {
                const data = await response.json();
                exercises = data.exercises || [];
            } else {
                throw new Error('API not available');
            }
        } catch (apiError) {
            console.log('API not available, using demo data');
            exercises = getDemoExercises();
        }
        
        // Apply filters
        if (category !== 'all') {
            exercises = exercises.filter(exercise => exercise.category === category);
        }
        
        if (difficulty !== 'all') {
            exercises = exercises.filter(exercise => exercise.difficulty === difficulty);
        }
        
        console.log(`✅ Loaded ${exercises.length} exercises`);
        displayExercises(exercises);
    } catch (error) {
        console.error('❌ Error loading exercises:', error);
        // Use demo data as fallback
        const exercises = getDemoExercises();
        displayExercises(exercises);
    }
}

function getDemoExercises() {
    return [
        {
            name: 'Running',
            description: 'Running at a moderate pace. Great for cardiovascular health and endurance building.',
            category: 'Cardio',
            difficulty: 'Intermediate',
            calories_burned_per_minute: 10.0,
            muscle_groups: 'Legs, Core, Cardiovascular',
            instructions: 'Maintain steady pace, proper breathing technique. Start with 5-10 minute warm-up.'
        },
        {
            name: 'Push-ups',
            description: 'Classic bodyweight exercise for upper body strength.',
            category: 'Strength',
            difficulty: 'Beginner',
            calories_burned_per_minute: 4.0,
            muscle_groups: 'Chest, Shoulders, Triceps, Core',
            instructions: 'Keep body straight, lower chest to floor. Modify with knee push-ups if needed.'
        },
        {
            name: 'Squats',
            description: 'Fundamental lower body exercise for leg strength.',
            category: 'Strength',
            difficulty: 'Beginner',
            calories_burned_per_minute: 5.0,
            muscle_groups: 'Legs, Glutes, Core',
            instructions: 'Keep knees behind toes, back straight. Go as low as comfortable.'
        },
        {
            name: 'Yoga',
            description: 'Mind-body practice combining physical postures and breathing.',
            category: 'Flexibility',
            difficulty: 'Beginner',
            calories_burned_per_minute: 3.0,
            muscle_groups: 'Full Body, Core',
            instructions: 'Focus on breathing and proper alignment. Move slowly between poses.'
        },
        {
            name: 'Cycling',
            description: 'Low-impact cardiovascular exercise.',
            category: 'Cardio',
            difficulty: 'Beginner',
            calories_burned_per_minute: 8.0,
            muscle_groups: 'Legs, Glutes, Cardiovascular',
            instructions: 'Keep back straight, pedal consistently. Adjust resistance as needed.'
        },
        {
            name: 'Swimming',
            description: 'Full-body, low-impact exercise.',
            category: 'Cardio',
            difficulty: 'Intermediate',
            calories_burned_per_minute: 9.0,
            muscle_groups: 'Full Body, Cardiovascular',
            instructions: 'Focus on breathing and stroke technique. Start with shorter distances.'
        },
        {
            name: 'Deadlift',
            description: 'Compound exercise for posterior chain development.',
            category: 'Strength',
            difficulty: 'Advanced',
            calories_burned_per_minute: 6.0,
            muscle_groups: 'Back, Legs, Glutes, Core',
            instructions: 'Keep back straight, lift with legs. Start with light weights to master form.'
        },
        {
            name: 'Plank',
            description: 'Core stability and endurance exercise.',
            category: 'Strength',
            difficulty: 'Beginner',
            calories_burned_per_minute: 3.0,
            muscle_groups: 'Core, Shoulders, Back',
            instructions: 'Keep body straight, engage core. Hold for 20-60 seconds.'
        }
    ];
}

function displayExercises(exercises) {
    const container = document.getElementById('exercises-container');
    if (!container) {
        console.error('❌ Exercises container not found');
        return;
    }

    container.innerHTML = '';

    if (!exercises || exercises.length === 0) {
        container.innerHTML = `
            <div class="no-exercises" style="text-align: center; padding: 3rem; color: #666;">
                <h3>No exercises found</h3>
                <p>Try changing your filters or check back later.</p>
            </div>
        `;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'exercise-grid';

    exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        
        card.innerHTML = `
            <h3>${exercise.name}</h3>
            <div class="exercise-meta">
                <span class="exercise-category">${exercise.category}</span>
                <span class="exercise-difficulty ${exercise.difficulty}">${exercise.difficulty}</span>
                <span class="exercise-calories">${exercise.calories_burned_per_minute} cal/min</span>
            </div>
            <p class="exercise-description">${exercise.description}</p>
            <div class="exercise-details">
                <p><strong>Muscle Groups:</strong> <span class="exercise-muscles">${exercise.muscle_groups}</span></p>
                <p><strong>Instructions:</strong> ${exercise.instructions}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function filterExercises() {
    const category = document.getElementById('category-filter').value;
    const difficulty = document.getElementById('difficulty-filter').value;
    loadExercises(category, difficulty);
}

// Placeholder functions for other features
async function loadBodyMeasurements() {
    console.log('Loading body measurements...');
}

async function handleMeasurementSubmission(form) {
    console.log('Handling measurement submission...');
    alert('Measurement feature coming soon!');
}

async function loadGoals() {
    console.log('Loading goals...');
}

function filterWorkouts() {
    console.log('Filtering workouts...');
}

function switchView(viewName) {
    console.log('Switching view to:', viewName);
}

function changeCalendarMonth(direction) {
    console.log('Changing calendar month:', direction);
}

function exportToCSV() {
    console.log('Exporting to CSV...');
}

function clearFilters() {
    console.log('Clearing filters...');
}

function getGoalTypeText(goalType) {
    const types = {
        'target_weight': 'Target Weight',
        'workout_frequency': 'Weekly Workouts',
        'calorie_burn': 'Monthly Calories Burned',
        'exercise_target': 'Exercise Target'
    };
    return types[goalType] || goalType;
}

console.log("✅ script.js loaded successfully!");
// Mobile navigation toggle
function toggleMobileNav() {
    const nav = document.querySelector('.vertical-nav');
    const mainContent = document.querySelector('.main-content');
    
    if (nav && mainContent) {
        nav.classList.toggle('active');
    }
}

// Close mobile nav when clicking on a link
function showSection(sectionId) {
    console.log('🔄 Switching to section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Now showing section:', sectionId);
    }
    
    // Close mobile nav on mobile devices
    if (window.innerWidth <= 1024) {
        const nav = document.querySelector('.vertical-nav');
        if (nav) {
            nav.classList.remove('active');
        }
    }
    
    // Load data for specific sections
    loadSectionData(sectionId);
}