import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { AuthProvider } from "./utils/AuthContext"; // Import AuthProvider

const container = document.getElementById('app'); // Changed from 'root' to 'app' to match your ID
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <AuthProvider> {/* Wrap App with AuthProvider in order to enable React Context for the authentication */}
    <App tab="home" />
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
