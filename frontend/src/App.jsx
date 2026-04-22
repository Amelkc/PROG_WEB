
import { Header } from '../components/Header/Header'
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css'


import { Footer } from '../components/Footer/Footer';
import { EventDetails } from '../pages/EventDetailsPage/EventDetailsPage';
import { RequireAdmin, RequireAuth } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { HomePage } from '../pages/HomePage/HomePage';
import { EventsPage } from '../pages/EventsPage/EventsPage';
import { AuthPage } from '../pages/AuthPage/AuthPage';
import {ParticipantsPage} from '../pages/ParticipantsPage/ParticipantsPage'
import {ProfilePage} from '../pages/Profile'
import { EventCreate } from '../pages/EventCreatePage/EventCreatePage';
function App() {
  

  return (
    <>
    <div className='app-content'>
      <Header></Header>
      <Routes>
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/login" element={<AuthPage/>} />
        <Route path="/events" element={<RequireAuth><EventsPage/></RequireAuth>} />
        <Route path="/events/:id" element={<RequireAuth><EventDetails/></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>}/>
        <Route path="/participants" element={<RequireAdmin><ParticipantsPage/></RequireAdmin>}/>
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/profile/:id" element={<RequireAdmin><ProfilePage /></RequireAdmin>} />
        <Route path="/" element={<RequireAuth><HomePage/></RequireAuth>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/admin/events/create" element={<RequireAdmin><EventCreate /></RequireAdmin>}/>
      </Routes>
      <Footer></Footer>
    </div>
    </>
  )
}

export default App
