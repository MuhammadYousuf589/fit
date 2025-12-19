const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./fitness.db', (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Connected to database');
        createTables();
    }
});

// Create all tables with IF NOT EXISTS
function createTables() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            height_cm REAL,
            initial_weight_kg REAL,
            gender TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            exercise_name TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            calories_burned INTEGER,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS body_measurements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            weight_kg REAL NOT NULL,
            body_fat_percentage REAL,
            chest_cm REAL,
            waist_cm REAL,
            hips_cm REAL,
            measurement_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            goal_type TEXT NOT NULL,
            target_value REAL NOT NULL,
            current_value REAL DEFAULT 0,
            target_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_completed BOOLEAN DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            difficulty TEXT,
            calories_burned_per_minute REAL,
            muscle_groups TEXT,
            instructions TEXT
        )`
    ];

    // Execute each table creation
    let tablesCreated = 0;
    tables.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`❌ Table ${index + 1} error:`, err.message);
            } else {
                console.log(`✅ Table ${index + 1} created/verified`);
                tablesCreated++;
                
                // When all tables are created, populate exercises
                if (tablesCreated === tables.length) {
                    populateExercises();
                }
            }
        });
    });
}

// Enhanced function to pre-populate 50+ exercises
function populateExercises() {
    // Check if exercises already exist to avoid duplicates
    db.get(`SELECT COUNT(*) as count FROM exercises`, (err, row) => {
        if (err) {
            console.error('Error checking exercises count:', err);
            return;
        }
        if (row.count === 0) {
            console.log('Populating exercises table with 50+ exercises...');
            const exercises = [
                // CARDIO EXERCISES (15 exercises)
                { name: 'Running', description: 'Running at a moderate pace', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 10.0, muscle_groups: 'Legs, Core', instructions: 'Maintain steady pace, proper breathing' },
                { name: 'Cycling', description: 'Cycling on a flat surface', category: 'Cardio', difficulty: 'Beginner', calories_burned_per_minute: 8.0, muscle_groups: 'Legs, Glutes', instructions: 'Keep back straight, pedal consistently' },
                { name: 'Swimming', description: 'Freestyle swimming', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 9.0, muscle_groups: 'Full Body', instructions: 'Focus on breathing and stroke technique' },
                { name: 'Jumping Rope', description: 'Continuous rope jumping', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 12.0, muscle_groups: 'Legs, Shoulders', instructions: 'Keep jumps low, use wrists not arms' },
                { name: 'Rowing', description: 'Using a rowing machine', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 8.5, muscle_groups: 'Back, Legs, Arms', instructions: 'Push with legs, pull with arms' },
                { name: 'Elliptical Trainer', description: 'Low-impact cardio machine', category: 'Cardio', difficulty: 'Beginner', calories_burned_per_minute: 7.5, muscle_groups: 'Legs, Arms', instructions: 'Maintain upright posture, use handles' },
                { name: 'Stair Climbing', description: 'Climbing stairs or using stair machine', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 9.5, muscle_groups: 'Legs, Glutes', instructions: 'Step fully, avoid leaning on rails' },
                { name: 'High-Intensity Interval Training', description: 'Alternating intense bursts with recovery', category: 'Cardio', difficulty: 'Advanced', calories_burned_per_minute: 13.0, muscle_groups: 'Full Body', instructions: '20s max effort, 40s recovery' },
                { name: 'Walking', description: 'Brisk walking', category: 'Cardio', difficulty: 'Beginner', calories_burned_per_minute: 5.0, muscle_groups: 'Legs', instructions: 'Maintain good posture, swing arms' },
                { name: 'Dancing', description: 'Continuous dance movements', category: 'Cardio', difficulty: 'Beginner', calories_burned_per_minute: 6.5, muscle_groups: 'Full Body', instructions: 'Move to rhythm, have fun' },
                { name: 'Kickboxing', description: 'Martial arts inspired cardio', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 10.5, muscle_groups: 'Legs, Arms, Core', instructions: 'Proper stance, controlled movements' },
                { name: 'Mountain Climbers', description: 'High-intensity floor exercise', category: 'Cardio', difficulty: 'Intermediate', calories_burned_per_minute: 8.0, muscle_groups: 'Core, Shoulders, Legs', instructions: 'Keep back straight, drive knees to chest' },
                { name: 'Burpees', description: 'Full-body explosive movement', category: 'Cardio', difficulty: 'Advanced', calories_burned_per_minute: 12.5, muscle_groups: 'Full Body', instructions: 'Squat, plank, push-up, jump' },
                { name: 'Box Jumps', description: 'Explosive jumping onto platform', category: 'Cardio', difficulty: 'Advanced', calories_burned_per_minute: 9.0, muscle_groups: 'Legs, Glutes', instructions: 'Land softly, step down carefully' },
                { name: 'Stationary Bike', description: 'Indoor cycling', category: 'Cardio', difficulty: 'Beginner', calories_burned_per_minute: 7.0, muscle_groups: 'Legs, Glutes', instructions: 'Adjust resistance, maintain cadence' },

                // STRENGTH EXERCISES (20 exercises)
                { name: 'Push-ups', description: 'Classic push-up exercise', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 4.0, muscle_groups: 'Chest, Shoulders, Triceps', instructions: 'Keep body straight, lower chest to floor' },
                { name: 'Squats', description: 'Bodyweight squats', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 5.0, muscle_groups: 'Legs, Glutes', instructions: 'Keep knees behind toes, back straight' },
                { name: 'Deadlift', description: 'Barbell deadlift', category: 'Strength', difficulty: 'Advanced', calories_burned_per_minute: 6.0, muscle_groups: 'Back, Legs, Glutes', instructions: 'Keep back straight, lift with legs' },
                { name: 'Bench Press', description: 'Barbell bench press', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 5.5, muscle_groups: 'Chest, Shoulders, Triceps', instructions: 'Lower bar to chest, push up explosively' },
                { name: 'Bicep Curls', description: 'Dumbbell bicep curls', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 3.0, muscle_groups: 'Biceps', instructions: 'Keep elbows fixed, curl with control' },
                { name: 'Shoulder Press', description: 'Overhead dumbbell press', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 4.5, muscle_groups: 'Shoulders, Triceps', instructions: 'Keep core tight, press overhead' },
                { name: 'Lunges', description: 'Forward or reverse lunges', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 5.0, muscle_groups: 'Legs, Glutes', instructions: 'Step forward, lower until knees at 90°' },
                { name: 'Pull-ups', description: 'Bodyweight pulling exercise', category: 'Strength', difficulty: 'Advanced', calories_burned_per_minute: 6.0, muscle_groups: 'Back, Biceps', instructions: 'Hang from bar, pull chin over bar' },
                { name: 'Plank', description: 'Core stability hold', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 3.0, muscle_groups: 'Core, Shoulders', instructions: 'Keep body straight, engage core' },
                { name: 'Russian Twists', description: 'Rotational core exercise', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 4.0, muscle_groups: 'Obliques, Core', instructions: 'Lean back, twist torso side to side' },
                { name: 'Leg Press', description: 'Machine leg exercise', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 5.5, muscle_groups: 'Legs, Glutes', instructions: 'Push platform away, control return' },
                { name: 'Lat Pulldowns', description: 'Back strengthening machine', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 4.5, muscle_groups: 'Back, Biceps', instructions: 'Pull bar to chest, squeeze back' },
                { name: 'Tricep Dips', description: 'Bodyweight tricep exercise', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 4.0, muscle_groups: 'Triceps, Chest', instructions: 'Lower body, keep elbows back' },
                { name: 'Crunches', description: 'Abdominal exercise', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 3.0, muscle_groups: 'Abs', instructions: 'Lift shoulders, don\'t pull neck' },
                { name: 'Leg Curls', description: 'Hamstring machine exercise', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 4.0, muscle_groups: 'Hamstrings', instructions: 'Curl heels toward glutes' },
                { name: 'Calf Raises', description: 'Calf strengthening', category: 'Strength', difficulty: 'Beginner', calories_burned_per_minute: 3.0, muscle_groups: 'Calves', instructions: 'Raise onto toes, lower slowly' },
                { name: 'Bent Over Rows', description: 'Back exercise with weights', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 5.0, muscle_groups: 'Back, Biceps', instructions: 'Bend at hips, pull weights to torso' },
                { name: 'Overhead Squat', description: 'Advanced squat variation', category: 'Strength', difficulty: 'Advanced', calories_burned_per_minute: 6.5, muscle_groups: 'Legs, Shoulders, Core', instructions: 'Arms overhead, squat deep' },
                { name: 'Kettlebell Swings', description: 'Explosive hip hinge movement', category: 'Strength', difficulty: 'Intermediate', calories_burned_per_minute: 8.0, muscle_groups: 'Hips, Glutes, Shoulders', instructions: 'Hinge at hips, swing to chest height' },

                // FLEXIBILITY EXERCISES (10 exercises)
                { name: 'Yoga', description: 'Basic yoga poses', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 3.0, muscle_groups: 'Full Body', instructions: 'Focus on breathing and proper alignment' },
                { name: 'Stretching', description: 'Full body stretching', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.5, muscle_groups: 'Full Body', instructions: 'Hold each stretch for 20-30 seconds' },
                { name: 'Pilates', description: 'Pilates core exercises', category: 'Flexibility', difficulty: 'Intermediate', calories_burned_per_minute: 4.0, muscle_groups: 'Core, Back', instructions: 'Focus on controlled movements and breathing' },
                { name: 'Hamstring Stretch', description: 'Seated forward bend', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Hamstrings, Back', instructions: 'Sit, extend legs, reach forward' },
                { name: 'Quad Stretch', description: 'Standing quadriceps stretch', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Quadriceps', instructions: 'Stand, pull heel to glute' },
                { name: 'Chest Stretch', description: 'Doorway chest opening', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Chest, Shoulders', instructions: 'Place forearms on doorway, step through' },
                { name: 'Hip Flexor Stretch', description: 'Kneeling lunge stretch', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Hip Flexors', instructions: 'Kneel, lunge forward, feel stretch' },
                { name: 'Shoulder Stretch', description: 'Cross-body arm stretch', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Shoulders', instructions: 'Pull elbow across chest gently' },
                { name: 'Cat-Cow Stretch', description: 'Spinal flexion and extension', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.5, muscle_groups: 'Spine, Core', instructions: 'Alternate between arched and rounded back' },
                { name: 'Child\'s Pose', description: 'Resting yoga pose', category: 'Flexibility', difficulty: 'Beginner', calories_burned_per_minute: 2.0, muscle_groups: 'Back, Hips', instructions: 'Kneel, sit back, arms forward' },

                // SPORTS ACTIVITIES (10 exercises)
                { name: 'Basketball', description: 'Playing basketball', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 8.0, muscle_groups: 'Legs, Arms', instructions: 'Focus on dribbling and shooting technique' },
                { name: 'Football', description: 'Playing football', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 9.0, muscle_groups: 'Legs, Core', instructions: 'Practice passing and ball control' },
                { name: 'Tennis', description: 'Playing tennis', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 7.0, muscle_groups: 'Arms, Legs, Shoulders', instructions: 'Focus on footwork and racket technique' },
                { name: 'Soccer', description: 'Playing soccer/football', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 8.5, muscle_groups: 'Legs, Core', instructions: 'Running, kicking, ball control' },
                { name: 'Volleyball', description: 'Playing volleyball', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 6.0, muscle_groups: 'Legs, Arms, Shoulders', instructions: 'Jumping, spiking, blocking' },
                { name: 'Badminton', description: 'Playing badminton', category: 'Sports', difficulty: 'Beginner', calories_burned_per_minute: 5.5, muscle_groups: 'Legs, Arms, Shoulders', instructions: 'Quick movements, racket control' },
                { name: 'Table Tennis', description: 'Playing ping pong', category: 'Sports', difficulty: 'Beginner', calories_burned_per_minute: 4.0, muscle_groups: 'Arms, Core', instructions: 'Fast reflexes, paddle control' },
                { name: 'Golf', description: 'Playing golf (walking)', category: 'Sports', difficulty: 'Beginner', calories_burned_per_minute: 5.0, muscle_groups: 'Core, Arms, Legs', instructions: 'Swing technique, walking course' },
                { name: 'Rock Climbing', description: 'Indoor or outdoor climbing', category: 'Sports', difficulty: 'Advanced', calories_burned_per_minute: 10.0, muscle_groups: 'Full Body', instructions: 'Use legs, plan route, secure grip' },
                { name: 'Martial Arts', description: 'Various martial arts training', category: 'Sports', difficulty: 'Intermediate', calories_burned_per_minute: 9.5, muscle_groups: 'Full Body', instructions: 'Proper form, controlled movements' }
            ];

            const insert = db.prepare(`INSERT INTO exercises (name, description, category, difficulty, calories_burned_per_minute, muscle_groups, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            exercises.forEach(exercise => {
                insert.run([exercise.name, exercise.description, exercise.category, exercise.difficulty, exercise.calories_burned_per_minute, exercise.muscle_groups, exercise.instructions]);
            });
            insert.finalize();
            console.log(`✅ Inserted ${exercises.length} exercises`);
        } else {
            console.log('✅ Exercises table already populated');
        }
    });
}

// ===== API ROUTES =====
// Add these routes to your app.js (before the server start)

// Route to get workout data for charts
app.get('/api/charts/workout-data', (req, res) => {
    const sql = `
        SELECT 
            strftime('%Y-%m-%d', date) as date,
            COUNT(*) as workout_count,
            SUM(calories_burned) as daily_calories,
            SUM(duration_minutes) as total_duration
        FROM workouts 
        WHERE date >= date('now', '-30 days')
        GROUP BY strftime('%Y-%m-%d', date)
        ORDER BY date
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "workoutData": rows });
    });
});

// Route to get exercise statistics
app.get('/api/charts/exercise-stats', (req, res) => {
    const sql = `
        SELECT 
            exercise_name,
            COUNT(*) as count,
            AVG(duration_minutes) as avg_duration,
            AVG(calories_burned) as avg_calories
        FROM workouts 
        GROUP BY exercise_name
        ORDER BY count DESC
        LIMIT 10
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "exerciseStats": rows });
    });
});

// Route to get body measurement progress
app.get('/api/charts/measurement-progress', (req, res) => {
    const sql = `
        SELECT 
            date(measurement_date) as date,
            weight_kg,
            body_fat_percentage
        FROM body_measurements 
        ORDER BY measurement_date
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "measurementProgress": rows });
    });
});

// Route to get workouts with filters
app.get('/api/workouts/filtered', (req, res) => {
    const { startDate, endDate, exercise } = req.query;
    
    let sql = `SELECT * FROM workouts WHERE 1=1`;
    const params = [];
    
    if (startDate) {
        sql += ` AND date >= ?`;
        params.push(startDate);
    }
    
    if (endDate) {
        sql += ` AND date <= ?`;
        params.push(endDate + ' 23:59:59');
    }
    
    if (exercise && exercise !== 'all') {
        sql += ` AND exercise_name = ?`;
        params.push(exercise);
    }
    
    sql += ` ORDER BY date DESC`;
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "workouts": rows });
    });
});

// Route to get workout calendar data
app.get('/api/workouts/calendar/:year/:month', (req, res) => {
    const { year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;
    
    const sql = `
        SELECT 
            date(date) as workout_date,
            COUNT(*) as workout_count,
            GROUP_CONCAT(exercise_name) as exercises
        FROM workouts 
        WHERE date BETWEEN ? AND ?
        GROUP BY date(date)
        ORDER BY workout_date
    `;
    
    db.all(sql, [startDate, endDate], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "calendar": rows });
    });
});

// Route to get workout statistics
app.get('/api/workouts/statistics', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_workouts,
            SUM(duration_minutes) as total_duration,
            AVG(duration_minutes) as avg_duration,
            SUM(calories_burned) as total_calories,
            (SELECT exercise_name FROM workouts GROUP BY exercise_name ORDER BY COUNT(*) DESC LIMIT 1) as most_frequent,
            (SELECT date FROM workouts ORDER BY calories_burned DESC LIMIT 1) as best_day
        FROM workouts
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "statistics": row });
    });
});

// Route to get exercise breakdown
app.get('/api/workouts/exercise-breakdown', (req, res) => {
    const sql = `
        SELECT 
            exercise_name,
            COUNT(*) as count,
            SUM(duration_minutes) as total_duration,
            SUM(calories_burned) as total_calories
        FROM workouts 
        GROUP BY exercise_name
        ORDER BY count DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "breakdown": rows });
    });
});

// Route to delete a workout
app.delete('/api/workouts/:id', (req, res) => {
    const sql = `DELETE FROM workouts WHERE id = ?`;
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Workout deleted successfully!" });
    });
});

// Route to export workouts as CSV
app.get('/api/workouts/export', (req, res) => {
    const sql = `SELECT date, exercise_name, duration_minutes, calories_burned FROM workouts ORDER BY date DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        
        // Convert to CSV
        let csv = 'Date,Exercise,Duration (min),Calories Burned\n';
        rows.forEach(row => {
            csv += `"${row.date}","${row.exercise_name}",${row.duration_minutes},${row.calories_burned}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=workout-history.csv');
        res.send(csv);
    });
});

// Route to get weekly activity data
app.get('/api/charts/weekly-activity', (req, res) => {
    const sql = `
        SELECT 
            date(date) as workout_date,
            COUNT(*) as workout_count
        FROM workouts 
        WHERE date >= date('now', '-7 days') 
        GROUP BY date(date)
        ORDER BY workout_date
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "weeklyActivity": rows });
    });
});

// Route to get calorie burn trend
app.get('/api/charts/calorie-trend', (req, res) => {
    const sql = `
        SELECT 
            date(date) as workout_date,
            SUM(calories_burned) as total_calories
        FROM workouts 
        WHERE date >= date('now', '-30 days') 
        GROUP BY date(date)
        ORDER BY workout_date
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "calorieTrend": rows });
    });
});

// Route to get exercise distribution
app.get('/api/charts/exercise-distribution', (req, res) => {
    const sql = `
        SELECT 
            exercise_name,
            COUNT(*) as exercise_count,
            SUM(calories_burned) as total_calories
        FROM workouts 
        GROUP BY exercise_name
        ORDER BY exercise_count DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "exerciseDistribution": rows });
    });
});

// Route to get weight progress
app.get('/api/charts/weight-progress', (req, res) => {
    const sql = `
        SELECT 
            date(measurement_date) as measurement_date,
            weight_kg
        FROM body_measurements 
        ORDER BY measurement_date
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "weightProgress": rows });
    });
});

// Route to get workout statistics
app.get('/api/charts/workout-stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_workouts,
            SUM(calories_burned) as total_calories,
            AVG(duration_minutes) as avg_duration,
            (SELECT exercise_name FROM workouts GROUP BY exercise_name ORDER BY COUNT(*) DESC LIMIT 1) as favorite_exercise
        FROM workouts
    `;
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "workoutStats": row });
    });
});

// Workout routes
app.get('/api/workouts', (req, res) => {
    const sql = `SELECT * FROM workouts ORDER BY date DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "workouts": rows || [] });
    });
});

// Workout creation with auto-calorie calculation
app.post('/api/workouts', (req, res) => {
    const { exercise_name, duration_minutes, calories_burned } = req.body;
    
    // If calories not provided, calculate based on exercise type
    let finalCalories = calories_burned;
    if (!finalCalories) {
        // Get exercise calorie rate from database
        db.get(`SELECT calories_burned_per_minute FROM exercises WHERE name = ?`, [exercise_name], (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            
            if (row) {
                finalCalories = Math.round(row.calories_burned_per_minute * duration_minutes);
            } else {
                // Default calculation if exercise not found
                finalCalories = Math.round(5 * duration_minutes); // 5 cal/min default
            }
            
            insertWorkout(exercise_name, duration_minutes, finalCalories, res);
        });
    } else {
        insertWorkout(exercise_name, duration_minutes, finalCalories, res);
    }
});

function insertWorkout(exercise_name, duration_minutes, calories_burned, res) {
    const sql = `INSERT INTO workouts (user_id, exercise_name, duration_minutes, calories_burned) VALUES (1, ?, ?, ?)`;
    
    db.run(sql, [exercise_name, duration_minutes, calories_burned], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        
        // AUTO-UPDATE CALORIE GOALS
        updateCalorieGoals(calories_burned);
        
        res.json({ 
            "message": "Workout logged successfully!", 
            "id": this.lastID,
            "calories_burned": calories_burned 
        });
    });
}

// Profile routes
app.get('/api/profile', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = 1`;
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "profile": row });
    });
});

app.post('/api/profile', (req, res) => {
    const { name, age, height_cm, weight_kg, gender } = req.body;
    const sql = `INSERT OR REPLACE INTO users (id, name, age, height_cm, initial_weight_kg, gender) VALUES (1, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, age, height_cm, weight_kg, gender], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Profile updated successfully!" });
    });
});

// Body measurements routes
app.get('/api/body-measurements', (req, res) => {
    const sql = `SELECT * FROM body_measurements WHERE user_id = 1 ORDER BY measurement_date DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "measurements": rows || [] });
    });
});

app.post('/api/body-measurements', (req, res) => {
    const { weight_kg, body_fat_percentage, chest_cm, waist_cm, hips_cm } = req.body;
    const sql = `INSERT INTO body_measurements (user_id, weight_kg, body_fat_percentage, chest_cm, waist_cm, hips_cm) VALUES (1, ?, ?, ?, ?, ?)`;
    db.run(sql, [weight_kg, body_fat_percentage, chest_cm, waist_cm, hips_cm], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Body measurements saved successfully!", "id": this.lastID });
    });
});

// Goals routes
app.get('/api/goals', (req, res) => {
    const sql = `SELECT * FROM goals WHERE user_id = 1 ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "goals": rows || [] });
    });
});

app.post('/api/goals', (req, res) => {
    const { goal_type, target_value, target_date } = req.body;
    const sql = `INSERT INTO goals (user_id, goal_type, target_value, target_date) VALUES (1, ?, ?, ?)`;
    db.run(sql, [goal_type, target_value, target_date], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Goal set successfully!", "id": this.lastID });
    });
});

app.put('/api/goals/:id', (req, res) => {
    const { current_value, is_completed } = req.body;
    const sql = `UPDATE goals SET current_value = ?, is_completed = ? WHERE id = ?`;
    db.run(sql, [current_value, is_completed, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Goal updated successfully!" });
    });
});

app.delete('/api/goals/:id', (req, res) => {
    const sql = `DELETE FROM goals WHERE id = ?`;
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Goal deleted successfully!" });
    });
});

// Enhanced BMI Calculator with BMR and Health Metrics
app.post('/api/health-metrics', (req, res) => {
    const { weight_kg, height_cm, age, gender } = req.body;
    
    if (!weight_kg || !height_cm) {
        return res.status(400).json({ "error": "Weight and height are required" });
    }

    // Calculate BMI
    const height_m = height_cm / 100;
    const bmi = (weight_kg / (height_m * height_m)).toFixed(1);
    
    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'female') {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    } else {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    }
    
    // Calculate ideal weight range
    const minIdealWeight = (18.5 * height_m * height_m).toFixed(1);
    const maxIdealWeight = (24.9 * height_m * height_m).toFixed(1);
    
    // Calculate daily calorie needs (BMR * activity factor)
    const sedentary = (bmr * 1.2).toFixed(0);
    const lightExercise = (bmr * 1.375).toFixed(0);
    const moderateExercise = (bmr * 1.55).toFixed(0);
    const heavyExercise = (bmr * 1.725).toFixed(0);
    
    // Determine BMI category
    let category, healthRisk;
    if (bmi < 18.5) {
        category = "Underweight";
        healthRisk = "Increased risk of nutritional deficiency and osteoporosis";
    } else if (bmi < 25) {
        category = "Normal weight";
        healthRisk = "Lowest risk of health problems";
    } else if (bmi < 30) {
        category = "Overweight";
        healthRisk = "Increased risk of heart disease, diabetes";
    } else {
        category = "Obese";
        healthRisk = "High risk of serious health conditions";
    }

    res.json({
        bmi: parseFloat(bmi),
        category,
        healthRisk,
        bmr: Math.round(bmr),
        idealWeightRange: {
            min: parseFloat(minIdealWeight),
            max: parseFloat(maxIdealWeight)
        },
        dailyCalorieNeeds: {
            sedentary: parseInt(sedentary),
            lightExercise: parseInt(lightExercise),
            moderateExercise: parseInt(moderateExercise),
            heavyExercise: parseInt(heavyExercise)
        },
        metrics: {
            weight_kg,
            height_cm,
            age,
            gender
        }
    });
});

// Route to get workout streak
app.get('/api/workout-streak', (req, res) => {
    const sql = `
        WITH consecutive_days AS (
            SELECT date(date) as workout_date,
                   date(date, '-' || (ROW_NUMBER() OVER (ORDER BY date(date) DESC) - 1) || ' days') as expected_date
            FROM workouts 
            GROUP BY date(date)
        )
        SELECT COUNT(*) as streak_days
        FROM consecutive_days
        WHERE workout_date = expected_date
        ORDER BY workout_date DESC
        LIMIT 30
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "streak": row ? row.streak_days : 0 });
    });
});

// Route to get monthly statistics
app.get('/api/monthly-stats/:year/:month', (req, res) => {
    const { year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;
    
    const sql = `
        SELECT 
            COUNT(*) as total_workouts,
            SUM(duration_minutes) as total_minutes,
            SUM(calories_burned) as total_calories,
            COUNT(DISTINCT date(date)) as active_days,
            (SELECT exercise_name FROM workouts 
             WHERE date BETWEEN ? AND ? 
             GROUP BY exercise_name 
             ORDER BY COUNT(*) DESC LIMIT 1) as most_frequent_exercise
        FROM workouts 
        WHERE date BETWEEN ? AND ?
    `;
    
    db.get(sql, [startDate, endDate, startDate, endDate], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ 
            monthlyStats: {
                total_workouts: row?.total_workouts || 0,
                total_minutes: row?.total_minutes || 0,
                total_calories: row?.total_calories || 0,
                active_days: row?.active_days || 0,
                most_frequent_exercise: row?.most_frequent_exercise || 'None'
            }
        });
    });
});

// ===== EXERCISE LIBRARY ROUTES =====

// Route to get all exercises
app.get('/api/exercises', (req, res) => {
    const sql = `SELECT * FROM exercises ORDER BY category, name`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "exercises": rows });
    });
});

// Route to get exercises by category
app.get('/api/exercises/:category', (req, res) => {
    const category = req.params.category;
    const sql = `SELECT * FROM exercises WHERE category = ? ORDER BY name`;
    db.all(sql, [category], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "exercises": rows });
    });
});

// Route to search exercises
app.get('/api/exercises/search/:query', (req, res) => {
    const query = `%${req.params.query}%`;
    const sql = `SELECT * FROM exercises WHERE name LIKE ? OR category LIKE ? OR muscle_groups LIKE ? ORDER BY name`;
    db.all(sql, [query, query, query], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "exercises": rows });
    });
});

// Automatic goal updating function
function updateCalorieGoals(calories_burned) {
    const sql = `
        UPDATE goals 
        SET current_value = current_value + ? 
        WHERE goal_type = 'calorie_burn' 
        AND is_completed = 0
        AND (target_date IS NULL OR target_date >= date('now'))
    `;
    
    db.run(sql, [calories_burned], function(err) {
        if (err) {
            console.error('Error updating calorie goals:', err);
        } else {
            console.log(`Updated calorie goals for ${calories_burned} calories`);
            checkCompletedGoals();
        }
    });
}

// Check and mark completed goals
function checkCompletedGoals() {
    const sql = `
        UPDATE goals 
        SET is_completed = 1 
        WHERE current_value >= target_value 
        AND is_completed = 0
        AND goal_type = 'calorie_burn'
    `;
    
    db.run(sql, [], function(err) {
        if (err) {
            console.error('Error checking completed goals:', err);
        } else if (this.changes > 0) {
            console.log(`Marked ${this.changes} goals as completed`);
        }
    });
}

// Start server
app.listen(port, () => {
    console.log(`🚀 Fitness tracker running at http://localhost:${port}`);
});