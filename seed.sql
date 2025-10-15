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
  ('liam_brown', 'hashedpassword9', 'Liam', 'Brown', 40, '15201', 'PA', 'USA', FALSE),
  -- New users
  ('sofia_clark', 'hashedpassword10', 'Sofia', 'Clark', 27, '80201', 'CO', 'USA', FALSE),
  ('ethan_martin', 'hashedpassword11', 'Ethan', 'Martin', 31, '19101', 'PA', 'USA', FALSE),
  ('ava_jones', 'hashedpassword12', 'Ava', 'Jones', 22, '73301', 'TX', 'USA', FALSE),
  ('noah_wilson', 'hashedpassword13', 'Noah', 'Wilson', 55, '48201', 'MI', 'USA', FALSE),
  ('isabella_lopez', 'hashedpassword14', 'Isabella', 'Lopez', 34, '97201', 'OR', 'USA', FALSE);

-- =====================================
-- INSERT REPORTS (Expanded dataset)
-- =====================================
INSERT INTO reports (user_id, primary_symptom, symptoms, severity, temperature, notes, zipcode, state, latitude, longitude, created_at)
VALUES
  -- Recent week
  (1, 'fever', ARRAY['fever','fatigue'], 'moderate', 100.9, 'Fever with fatigue', '10001','NY', 40.7128,-74.0060, NOW() - INTERVAL '1 day'),
  (2, 'cough', ARRAY['cough','sore throat'], 'mild', 99.0, 'Slight cough','30301','GA', NULL,NULL, NOW() - INTERVAL '2 days'),
  (3, 'shortness of breath', ARRAY['shortness of breath','chest pain'], 'severe', 102.0,'ER visit','60601','IL',41.8781,-87.6298, NOW() - INTERVAL '3 days'),
  (4, 'fatigue', ARRAY['fatigue'], 'mild', 98.2, 'Exhausted after work','94101','CA',NULL,NULL,NOW() - INTERVAL '4 days'),

  -- Past month
  (5, 'rash', ARRAY['rash','itchiness'],'moderate',99.4,'Skin reaction','75201','TX',NULL,NULL,NOW() - INTERVAL '15 days'),
  (6, 'diarrhea', ARRAY['diarrhea','nausea'],'moderate',100.1,'Stomach flu','98101','WA',47.6062,-122.3321,NOW() - INTERVAL '20 days'),
  (7, 'headache', ARRAY['headache'],'mild',98.6,'Recurring migraine','85001','AZ',NULL,NULL,NOW() - INTERVAL '18 days'),
  (8, 'fever', ARRAY['fever','cough'],'severe',103.4,'Hospitalized','33101','FL',25.7617,-80.1918,NOW() - INTERVAL '12 days'),

  -- Past year (scattered across months)
  (9, 'nausea', ARRAY['nausea','vomiting'],'severe',101.2,'Food poisoning','15201','PA',40.4406,-79.9959,NOW() - INTERVAL '2 months'),
  (10,'cough',ARRAY['cough','congestion'],'moderate',99.9,'Dry cough','19101','PA',NULL,NULL,NOW() - INTERVAL '3 months'),
  (11,'bodyache',ARRAY['bodyache','chills'],'moderate',100.7,'Muscle soreness','80201','CO',39.7392,-104.9903,NOW() - INTERVAL '4 months'),
  (12,'fever',ARRAY['fever','chills'],'severe',104.1,'Severe flu','73301','TX',30.2672,-97.7431,NOW() - INTERVAL '5 months'),
  (13,'rash',ARRAY['rash'],'mild',98.4,'Mild rash','48201','MI',42.3314,-83.0458,NOW() - INTERVAL '7 months'),
  (14,'diarrhea',ARRAY['diarrhea','cramps'],'moderate',99.8,'Traveler’s diarrhea','97201','OR',NULL,NULL,NOW() - INTERVAL '8 months'),
  (15,'fatigue',ARRAY['fatigue','headache'],'moderate',99.3,'Post-viral fatigue','10001','NY',NULL,NULL,NOW() - INTERVAL '9 months'),
  (1,'chills',ARRAY['chills'],'severe',102.6,'Shaking chills','60601','IL',NULL,NULL,NOW() - INTERVAL '11 months'),
  (2,'sore throat',ARRAY['sore throat'],'mild',98.7,'Mild throat pain','94101','CA',NULL,NULL,NOW() - INTERVAL '10 months'),
  (3,'cough',ARRAY['cough','fatigue'],'moderate',100.2,'Persistent cough','98101','WA',47.6097,-122.3331,NOW() - INTERVAL '12 months');

-- =====================================
-- INSERT USER LOCATIONS (Expanded)
-- =====================================
INSERT INTO user_locations (user_id, nickname, zipcode, state)
VALUES
  (1,'Home (NYC)','10001','NY'),
  (2,'Work (Atlanta)','30301','GA'),
  (2,'Vacation Spot','75201','TX'),
  (3,'Home (Chicago)','60601','IL'),
  (4,'Bay Area','94101','CA'),
  (5,'Dallas','75201','TX'),
  (6,'Seattle Center','98101','WA'),
  (7,'Phoenix Base','85001','AZ'),
  (8,'Miami Beach','33101','FL'),
  (9,'Pittsburgh','15201','PA'),
  (10,'Philly Home','19101','PA'),
  (11,'Denver Apt','80201','CO'),
  (12,'Austin','73301','TX'),
  (13,'Detroit','48201','MI'),
  (14,'Portland','97201','OR');
