
  <div align="center">
  <img src="https://raw.githubusercontent.com/MichaelAEllis86/Outbreak-Atlas/main/frontend/src/assets/logo.png" 
       alt="Outbreak Atlas Logo" width="300"/>
</div>

  # 🧭 Outbreak Atlas
  **Tracking health trends across the U.S. through data visualization and community sourced illness reports**


---

## 🌐 Deployed App
🚀 **Live Site:** [Outbreak Atlas on Render](https://your-deployment-link-here.com)  
📦 **GitHub Repository:** [github.com/MichaelAEllis86/Outbreak-Atlas](https://github.com/MichaelAEllis86/Outbreak-Atlas)

---

## 🩺 Project Overview

**Outbreak Atlas** is a full-stack web application designed to track and visualize public health data across the United States. It integrates **real-world epidemiological APIs** (such as the US Center for Disease Control's (CDC’s) *ILINet Influenza Surveillance* dataset via Carnegie Melon University's Delphi API) with **user-submitted symptom reports** to help identify emerging illness trends.

My goal in the creation of this project is to create a small application where the user experience for checking for USA epidemiological trends can be easy, centralized, and succinct providing an experience similar to checking the weather for a given locality.

Users can:
- Explore CDC-reported flu surveillance data through interactive charts and visualizations.
- Explore user submitted illness report trends that have been contributed directly to the Outbreak-Atlas site.
- Explore 3 levels of data locality: national, state, and 5 digit zipcode.
- Submit their own anonymous illness reports to contribute to community-driven health surveillance.
- View their own report history and account details in a secure, personalized dashboard.
  

To ensure the user experiences data that is relevant as well as up to date we feature data from two key sources that provide different and complementary strengths (see below).



### 🔍 Epidemiological Data Sources we use
 
#### 1.  CDC ILINet Influenza Surveillance (fluview)  CDC links-> https://www.cdc.gov/fluview/ & https://www.cdc.gov/fluview/overview/index.html API Link: https://cmu-delphi.github.io/delphi-epidata/api/fluview.html Carnegie Melon University Delphi Research Group -> https://delphi.cmu.edu/

 For public health data, we use data sourced from the CDC's Fluview Surveillance Network CDC FluView and obtained through Carnegie Melon University's Delphi Research Group Epidata API via the fluview API Endpoint. The CDC Fluview (ILInet) network is a surveillance network of ~ 3000 volunteer outpatient health services (Clinics/Pediatric Clinics/Urgent Care/Ambulatory Care/Student Health Centers etc). These outpatient services report the number of patients seen, and the number of patients ill with a flu-like respiratory illness (ILI). An ill patient is qualified as having a fever/body temperature of over 100 
 °F and having >2 flu-like respiratory symptoms. This data is available at the national and state level. Read more about the CDC influenza surveillance network in the links above.

 #### 2. User Submitted Symptom Reports

 We allow users to create a simple account and self report their own symptoms quickly and easily. These symptom reports include several common symptoms such as cough, cold, fever, nausea, chills, headache, fatigue etc. Users also report severity of symptoms (mild, moderate, severe), any associated temperature or fever in degrees °F, additional notes or comments, their zipcode and state where the symptoms occured, and they have the option to allow location services to take more precise coordinates of their report for mapping purposes. This allows for symptom data to be generated quickly by the user without the need for a doctor visit or testing confirmation. We then aggregate this data and can group it in various ways such as by symptoms, categories of symptoms such as dermal, respiratory, gastrointestinal etc, severity, state, and zipcode.

 User symptom reports serve as a useful supplment to CDC public health data. Government structured public health data ensures accuracy and veracity of the information, but is often 1-2 weeks an minimum out of date as all of this reporting requires time and analysis. This time delay can be even longer when looking for presence of laboratory confirmed cases of illness. Self-reported data lacks the institutional verification and accuracy but can reveal illness trends in local communities or subcommunities like schools, nursing homes, etc more quickly. It also has the ability cover cases that go unreported officially and do not go through the U.S. healthcare system expanding the potential scope of the data. There are many legitimate challenges in reporting disease at the government level. Not all sick people have access to medical care for example, or they may choose not to seek medical attention for minor illnesses like cold and flu. Outbreak Atlas therefore combines both government CDC fluview surveillance and user-reported symptoms to take advantage of the strengths of both data types.





---

## 🧩 Features

### 🦠🌍 1. National & State CDC fluview Trends
- Displays **CDC Influenza-like Illness (ILI)** trends using interactive bar and line charts.
- Visualizes flu-like illness totals by week and age group.
- Aggregates user-reported data for local insights (e.g., zip code or state).

### 😷📊 2. National, State, and Zipcode User report trends
- Displays Trends using interactive bar, line, and pie charts
- Visualizes data by number of reports in a given locality.
- Visualizes data categorically by types of symptoms exhibited and severity.

### 3.🔍🌍 Location Queries
   - Search by state for CDC fluview and user report trends
   - Search by zipcode for user report trends
   - National data is available on the home page for both data sources

### 4.📍 Local Trends for Users
   - Login grants access to trend reports for users local area
   - available at state and zipcode levels of granularity.

### 🧑‍🤝‍🧑 5. User Accounts
- Secure registration and login via JWT authentication.
- Users can **edit their account details** or **view their report history** from their dashboard.
- Middleware ensures only authorized users or admins can access sensitive routes.

### 🧾 6. Report an Illness
- Interactive form to submit new reports with:
  - Symptom selection
  - Severity level
  - Temperature and geolocation (state, zip)
- Validation on both frontend (Formik + Yup) and backend (SQL constraints).
- Smooth pagination and MUI DataGrid for accessing/editing/deleting personal report data ( account owner only) .

### 🧠 7. Data Visualization
- Built with **Recharts** for elegant, responsive charting.
- Dashboard layout built with **Material-UI (MUI) v7**, using a consistent theme and color palette.

### 🧮 8. Admin Features (Optional)
- Admin accounts can view all reports.
- Fine-grained access control via middleware (`ensureIsAdminOrUserId`).

---

## 🧭 User Flow

1. **Landing Page:**  
   - Users see national flu trends and a prompt to log in or register.

2. **Authentication:**  
   - New users register via a secure form.  
   - Returning users log in and receive a JWT token stored locally.

3. **Dashboard:**  
   - Displays the user’s previous illness reports.  
   - Allows editing or deletion of any report.
   - Chart visualizations of user's personal reports

4. **Report Submission:**  
   - Users can submit new reports via a form validated by Formik/Yup.  
   - Data is saved in PostgreSQL and immediately reflected in dashboards.

5. **Explore Trends:**  
   - Interactive section for viewing illness data by state and zipcode locations.  
   - Dynamic charts update based on API calls.

---

## 🧬 APIs Used

### **Delphi / CDC FluView API**
- Endpoint: [`https://api.delphi.cmu.edu/epidata/fluview/`](https://api.delphi.cmu.edu/epidata/fluview/)
- Provides national influenza-like illness (ILI) data from the CDC’s ILINet system.
- Data includes:
  - Weighted percentage of patients with flu-like symptoms.
  - Total outpatient visits by week.
  - Age-group breakdown of ILI cases.

📝 **Note:** During the 2025 U.S. government shutdown, CDC updates were delayed, and data availability may be intermittent.

---

## 🧠 Tech Stack

### **Frontend**
- React (Vite)
- Material-UI v7.3.2
- React Router DOM
- Axios
- Formik + Yup for form management
- Recharts for data visualization

### **Backend**
- Node.js + Express
- PostgreSQL with `pg`
- JWT Authentication
- Custom Middleware for role-based access
- JSON Schema for request validation

### **Development & Deployment**
- Git / GitHub for version control
- Render or Vercel for deployment
- ESLint and Prettier for code quality

---

##  🧰 Setup & Installation (bash/terminal cmds)

### clone repository
   - git clone https://github.com/MichaelAEllis86/Outbreak-Atlas.git
   - cd outbreak-atlas

### install backend dependencies 
   - npm install

### start express server
   - node server.js

### start frontend (in separate terminal window)
  - cd frontend
  - npm install
   -npm run dev

## 💡 Future Enhancements

🗺️ Interactive heatmaps for user-submitted & CDC reports

📍 Saved Locations: Users can save a given state or zipcode location for quick data retrieval for multiple areas.

📊 Expanded support for additional CDC datasets such as coronavirus or laboratory verfied flu cases and hospitalization data.

🌤️ Integration with external APIs (e.g., environmental health data)

## 🧑‍💻 About this  Author

by Michael A. Ellis (MS Biochemistry & Molecular Biology University of Georgia 2017) |
Software Engineer | Biochemist | Data Enthusiast

- 🔗 GitHub -> https://github.com/MichaelAEllis86

- 🔗 LinkedIn -> https://www.linkedin.com/in/michaelaellis2/

- 🔗 ORCID & scientific publications/citations -> https://orcid.org/0000-0002-2728-984X


## ⚙️ Database Schema for user symptom reporting

**Reports Table:**
```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  primary_symptom TEXT NOT NULL,
  symptoms TEXT[] NOT NULL,
  severity VARCHAR(10) CHECK (severity IN ('mild', 'moderate', 'severe')),
  temperature DECIMAL(4,1) CHECK (temperature BETWEEN 90 AND 110),
  notes TEXT,
  zipcode VARCHAR(5) CHECK (zipcode ~ '^\d{5}$'),
  state CHAR(2) CHECK (state ~ '^[A-Z]{2}$'),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  has_location BOOLEAN GENERATED ALWAYS AS (latitude IS NOT NULL AND longitude IS NOT NULL) STORED
);






