import { useState } from 'react'
import { Header } from '../components/Header'
import { Route, Routes } from "react-router-dom";
import './App.css'

import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { EventForm } from '../components/EventForm'

import { Footer } from '../components/footer';
import { EventDetails } from '../pages/EventDetails';
import { RequireAdmin } from '../context/AuthContext';
import { DashboardPage } from '../pages/Dashboard';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='app-content'>
      <Header></Header>
      <Routes>
        {/*TO-DO change "/" logged->dashboard else login*/}
        <Route path="/create-event" element={<RequireAdmin><EventForm/></RequireAdmin>}/> 
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/events" element={<EventsPage/>} />
        <Route path="/events/test" element={<EventDetails/>} />
        <Route path="/dashboard" element={<DashboardPage />}/>
        <Route path="/" element={<HomePage/>} />
      </Routes>
      <Footer></Footer>
    </div>
    </>
  )
}

export default App
