-- seed.sql

\connect outbreak_atlas;

-- Clear existing data (in case of re-seeding)
TRUNCATE reports RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;

-- Insert test users
INSERT INTO users (username, password, first_name, last_name, age, zipcode, state, country, is_admin)
VALUES
  ('admin', 'hashedpassword1', 'Alice', 'Admin', 35, '10001', 'NY', 'USA', TRUE),
  ('mooks2022', 'mookster21', 'Michael', 'Ellis', 38, '10001', 'NY', 'USA', TRUE),
  ('john_doe', 'hashedpassword2', 'John', 'Doe', 28, '30301', 'GA', 'USA', FALSE),
  ('jane_smith', 'hashedpassword3', 'Jane', 'Smith', 42, '60601', 'IL', 'USA', FALSE),
  ('mark_twain', 'hashedpassword4', 'Mark', 'Twain', 50, '94101', 'CA', 'USA', FALSE),
  ('lucy_liu', 'hashedpassword5', 'Lucy', 'Liu', 33, '75201', 'TX', 'USA', FALSE);

-- Insert test reports
INSERT INTO reports (user_id, primary_symptom, symptoms, severity, temperature, notes, zipcode, state, latitude, longitude)
VALUES
  (1, 'fever', ARRAY['fever', 'fatigue'], 'moderate', 101.2, 'Felt weak for 2 days', '10001', 'NY', 40.7128, -74.0060),
  (2, 'cough', ARRAY['cough', 'congestion'], 'mild', 99.1, 'Mild cold symptoms', '30301', 'GA', NULL, NULL), -- no location
  (2, 'diarrhea', ARRAY['diarrhea', 'nausea'], 'severe', 100.0, 'Stomach issues all day', '30301', 'GA', 33.7490, -84.3880),
  (3, 'headache', ARRAY['headache'], 'moderate', 98.6, 'Recurring headaches for a week', '60601', 'IL', NULL, NULL),
  (3, 'rash', ARRAY['rash', 'fever'], 'moderate', 99.5, 'Red patches on arms', '60601', 'IL', 41.8781, -87.6298),
  (4, 'cough', ARRAY['cough', 'fever'], 'severe', 102.5, 'High fever with cough', '94101', 'CA', 37.7749, -122.4194),
  (5, 'fatigue', ARRAY['fatigue'], 'mild', 97.9, 'Just tired, maybe allergies', '75201', 'TX', NULL, NULL),
  (5, 'nausea', ARRAY['nausea', 'vomiting'], 'moderate', 100.5, 'Food poisoning symptoms', '75201', 'TX', 32.7767, -96.7970),
  (1, 'bodyache', ARRAY['bodyache', 'chills'], 'mild', 98.9, 'Flu-like symptoms', '10001', 'NY', 40.7306, -73.9352),
  (4, 'fever', ARRAY['fever', 'chills'], 'severe', 103.1, 'Severe fever, seeking care', '94101', 'CA', NULL, NULL);
