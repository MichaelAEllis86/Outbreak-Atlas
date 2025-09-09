-- seed.sql
\connect outbreak_atlas;

-- =====================================
-- CLEAR EXISTING DATA (if re-seeding)
-- =====================================
TRUNCATE user_locations RESTART IDENTITY CASCADE;
TRUNCATE reports RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;

-- =====================================
-- INSERT USERS
-- =====================================
INSERT INTO users (username, password, first_name, last_name, age, zipcode, state, country, is_admin)
VALUES
  ('admin', 'hashedpassword1', 'Alice', 'Admin', 35, '10001', 'NY', 'USA', TRUE),
  ('mooks2022', 'mookster21', 'Michael', 'Ellis', 38, '10001', 'NY', 'USA', TRUE),
  ('john_doe', 'hashedpassword2', 'John', 'Doe', 28, '30301', 'GA', 'USA', FALSE),
  ('jane_smith', 'hashedpassword3', 'Jane', 'Smith', 42, '60601', 'IL', 'USA', FALSE),
  ('mark_twain', 'hashedpassword4', 'Mark', 'Twain', 50, '94101', 'CA', 'USA', FALSE),
  ('lucy_liu', 'hashedpassword5', 'Lucy', 'Liu', 33, '75201', 'TX', 'USA', FALSE),
  ('emma_white', 'hashedpassword6', 'Emma', 'White', 29, '98101', 'WA', 'USA', FALSE),
  ('oliver_gray', 'hashedpassword7', 'Oliver', 'Gray', 45, '85001', 'AZ', 'USA', FALSE),
  ('mia_green', 'hashedpassword8', 'Mia', 'Green', 36, '33101', 'FL', 'USA', FALSE),
  ('liam_brown', 'hashedpassword9', 'Liam', 'Brown', 40, '15201', 'PA', 'USA', FALSE);

-- =====================================
-- INSERT REPORTS (NEW + ORIGINAL, WITH DISTRIBUTED DATES)
-- =====================================
INSERT INTO reports (user_id, primary_symptom, symptoms, severity, temperature, notes, zipcode, state, latitude, longitude, created_at)
VALUES
  -- Last week
  (1, 'fever', ARRAY['fever', 'fatigue'], 'moderate', 101.2, 'Felt weak for 2 days', '10001', 'NY', 40.7128, -74.0060, NOW() - INTERVAL '2 days'),
  (2, 'cough', ARRAY['cough', 'congestion'], 'mild', 99.1, 'Mild cold symptoms', '30301', 'GA', NULL, NULL, NOW() - INTERVAL '3 days'),
  (3, 'headache', ARRAY['headache'], 'moderate', 98.6, 'Recurring headaches for a week', '60601', 'IL', NULL, NULL, NOW() - INTERVAL '5 days'),
  (1, 'bodyache', ARRAY['bodyache', 'chills'], 'mild', 98.9, 'Flu-like symptoms', '10001', 'NY', 40.7306, -73.9352, NOW() - INTERVAL '1 day'),

  -- Last month
  (4, 'cough', ARRAY['cough', 'fever'], 'severe', 102.5, 'High fever with cough', '94101', 'CA', 37.7749, -122.4194, NOW() - INTERVAL '10 days'),
  (5, 'fatigue', ARRAY['fatigue'], 'mild', 97.9, 'Just tired, maybe allergies', '75201', 'TX', NULL, NULL, NOW() - INTERVAL '15 days'),
  (6, 'shortness of breath', ARRAY['shortness of breath', 'fatigue'], 'severe', 101.8, 'Possible respiratory infection', '98101', 'WA', 47.6062, -122.3321, NOW() - INTERVAL '20 days'),
  (7, 'rash', ARRAY['rash'], 'moderate', 98.8, 'Localized rash on arms', '98101', 'WA', NULL, NULL, NOW() - INTERVAL '25 days'),

  -- Last year
  (8, 'fever', ARRAY['fever', 'loss of taste'], 'moderate', 100.3, 'Suspected viral infection', '85001', 'AZ', 33.4484, -112.0740, NOW() - INTERVAL '2 months'),
  (9, 'diarrhea', ARRAY['diarrhea', 'cramps'], 'mild', 99.4, 'Food-related issue', '33101', 'FL', 25.7617, -80.1918, NOW() - INTERVAL '3 months'),
  (10, 'chills', ARRAY['chills', 'fever'], 'severe', 102.9, 'Severe flu-like episode', '15201', 'PA', 40.4406, -79.9959, NOW() - INTERVAL '4 months'),
  (2, 'diarrhea', ARRAY['diarrhea', 'nausea'], 'severe', 100.0, 'Stomach issues all day', '30301', 'GA', 33.7490, -84.3880, NOW() - INTERVAL '6 months'),
  (3, 'rash', ARRAY['rash', 'fever'], 'moderate', 99.5, 'Red patches on arms', '60601', 'IL', 41.8781, -87.6298, NOW() - INTERVAL '7 months'),
  (4, 'fever', ARRAY['fever', 'chills'], 'severe', 103.1, 'Severe fever, seeking care', '94101', 'CA', NULL, NULL, NOW() - INTERVAL '8 months'),
  (5, 'nausea', ARRAY['nausea', 'vomiting'], 'moderate', 100.5, 'Food poisoning symptoms', '75201', 'TX', 32.7767, -96.7970, NOW() - INTERVAL '9 months'),
  (6, 'cough', ARRAY['cough', 'headache'], 'mild', 98.7, 'Dry cough, slight headache', '98101', 'WA', 47.6097, -122.3331, NOW() - INTERVAL '10 months'),
  (7, 'fatigue', ARRAY['fatigue'], 'mild', 98.3, 'General tiredness, no fever', '33101', 'FL', NULL, NULL, NOW() - INTERVAL '11 months'),
  (8, 'nausea', ARRAY['nausea', 'vomiting'], 'severe', 101.4, 'Possible food poisoning', '85001', 'AZ', 33.4490, -112.0730, NOW() - INTERVAL '12 months'),
  (9, 'cough', ARRAY['cough', 'sore throat'], 'moderate', 100.7, 'Persistent cough, possible flu', '15201', 'PA', 40.4410, -79.9930, NOW() - INTERVAL '12 months'),

  -- NEW EXTRA DATA for testing
  (10, 'fatigue', ARRAY['fatigue', 'headache'], 'moderate', 99.0, 'Feeling tired after work', '10001', 'NY', NULL, NULL, NOW() - INTERVAL '6 days'),
  (1, 'fever', ARRAY['fever', 'chills'], 'severe', 103.2, 'High fever, seeking help', '10001', 'NY', 40.7150, -73.9900, NOW() - INTERVAL '8 days'),
  (3, 'nausea', ARRAY['nausea'], 'mild', 98.5, 'Stomach discomfort', '60601', 'IL', NULL, NULL, NOW() - INTERVAL '3 months'),
  (4, 'cough', ARRAY['cough', 'fatigue'], 'moderate', 100.1, 'Persistent cough', '94101', 'CA', 37.7750, -122.4180, NOW() - INTERVAL '1 month');

-- =====================================
-- INSERT USER LOCATIONS
-- =====================================
INSERT INTO user_locations (user_id, nickname, zipcode, state)
VALUES
  (1, 'Home (NYC)', '10001', 'NY'),
  (2, 'Work (Atlanta)', '30301', 'GA'),
  (2, 'Vacation Spot', '75201', 'TX'),
  (3, 'Home (Chicago)', '60601', 'IL'),
  (4, 'Bay Area', '94101', 'CA'),
  (5, 'Dallas', '75201', 'TX'),
  (6, 'Seattle Center', '98101', 'WA'),
  (7, 'Phoenix Base', '85001', 'AZ'),
  (8, 'Miami Beach', '33101', 'FL'),
  (9, 'Pittsburgh', '15201', 'PA');