
import { Header } from '../components/Header'
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css'

import { EventForm } from '../components/EventForm'

import { Footer } from '../components/Footer';
import { EventDetails } from '../pages/EventDetails';
import { RequireAdmin, RequireAuth } from '../context/AuthContext';
import { DashboardPage } from '../pages/Dashboard';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { AuthPage } from '../pages/AuthPage';
import {ParticipantsPage} from '../pages/ParticipantsPage'
import {ProfilePage} from '../pages/Profile'
function App() {
  

  return (
    <>
    <div className='app-content'>
      <Header></Header>
      <Routes>
        {/*TO-DO change "/" logged->dashboard else login*/}
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/create-event" element={<RequireAdmin><EventForm/></RequireAdmin>}/> 
        <Route path="/login" element={<AuthPage/>} />
        <Route path="/events" element={<RequireAuth><EventsPage/></RequireAuth>} />
        <Route path="/events/:id" element={<RequireAuth><EventDetails/></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>}/>
        <Route path="/participants" element={<RequireAdmin><ParticipantsPage/></RequireAdmin>}/>
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/profile/:id" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/" element={<RequireAuth><HomePage/></RequireAuth>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer></Footer>
    </div>
    </>
  )
}

export default App
