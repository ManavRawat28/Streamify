import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import NotificationPage from './pages/NotificationPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';
import toast, { Toaster } from 'react-hot-toast';
import PageLoader from './component/PageLoader';
import useAuthUser from './hooks/useAuthUser';
import Layout from './component/Layout';
import {useThemeStore} from './store/useThemeStore.js';
import FriendsPage from './pages/FriendPage.jsx';



const App = () => {
  const { isLoading, authUser } = useAuthUser();
  
 const {theme}=useThemeStore()

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.user?.isOnboarded ?? false;

  if (isLoading) return <PageLoader />;

  return (
    <div className="" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              
             <Layout showSidebar={true}>
               <HomePage />
             </Layout>
              
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/notifications"
          element={isAuthenticated && isOnboarded ?(
          <Layout showSidebar={true}>
            <NotificationPage />
          </Layout>
          ):(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
          )}
        />
       <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
       <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
           
                <CallPage />
              
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
           
              <Layout showSidebar={true}>
            <FriendsPage />
          </Layout>
              
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? <OnboardingPage /> : <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
