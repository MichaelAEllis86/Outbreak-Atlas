DROP DATABASE IF EXISTS outbreak_atlas; 
CREATE DATABASE outbreak_atlas;
DROP DATABASE IF EXISTS outbreak_atlas_test; 
CREATE DATABASE outbreak_atlas_test;
\connect outbreak_atlas;



-- TABLE FOR USERS
-- Primary key is id
-- USA-only for now, requires zipcode/state for localization.
-- 1-to-many relationship: one user can submit many reports.
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL,
    zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^\d{5}$'),
    state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
    country VARCHAR(3) DEFAULT 'USA' NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL

);

CREATE TABLE reports(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    primary_symptom TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
    temperature DECIMAL(4,1) DEFAULT 98.6 NOT NULL CHECK (temperature BETWEEN 90 AND 110),
    notes TEXT,
    zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^\d{5}$'),
    state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
    latitude DECIMAL (9,6),
    longitude DECIMAL (9,6),
    has_location BOOLEAN GENERATED ALWAYS AS (
        latitude IS NOT NULL AND longitude IS NOT NULL
    ) STORED
    
);

CREATE TABLE user_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT,
  zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^[0-9]{5}$'),
  state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$')
);


\connect outbreak_atlas_test;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL,
    zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^\d{5}$'),
    state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
    country VARCHAR(3) DEFAULT 'USA' NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL

);

CREATE TABLE reports(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    primary_symptom TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
    temperature DECIMAL(4,1) DEFAULT 98.6 NOT NULL CHECK (temperature BETWEEN 90 AND 110),
    notes TEXT,
    zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^\d{5}$'),
    state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
    latitude DECIMAL (9,6),
    longitude DECIMAL (9,6),
    has_location BOOLEAN GENERATED ALWAYS AS (
        latitude IS NOT NULL AND longitude IS NOT NULL
    ) STORED 
    
);

CREATE TABLE user_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT,
  zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^[0-9]{5}$'),
  state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$')
);

