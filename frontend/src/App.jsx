// frontend/src/App.jsx
import React, {useState, useEffect, useContext} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateReportForm from "./CreateReportForm";
import UpdateReportPage from "./UpdateReportPage";
import TopNavBar from "./TopNavBar";
import SideNavBar from "./SideNavBar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import DashboardPage from "./DashboardPage";
import UserLocalTrendsPage from "./UserLocalTrendsPage";
import AboutPage from "./AboutPage";
import Home from "./Home";
import ExploreTrendsPage from "./ExploreTrends";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import { Box, Toolbar } from "@mui/material";
import AccountPage from "./AccountPage";


export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
      <TopNavBar />
      <SideNavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // push below top navbar only
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/create-report" element={<ProtectedRoute> <CreateReportForm /> </ProtectedRoute>} />
          <Route path="/update-report/:reportId" element={<ProtectedRoute> <UpdateReportPage /> </ProtectedRoute>} />
          <Route path="/dashboard/:userId" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
          <Route path="/local-trends" element={<ProtectedRoute> <UserLocalTrendsPage /></ProtectedRoute>} />
          <Route path="/explore-trends" element={<ProtectedRoute> <ExploreTrendsPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute> <AccountPage /></ProtectedRoute>} />
        </Routes>
      </Box>
      </AuthProvider>
    </BrowserRouter>
  );
}



  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )


// export default App
