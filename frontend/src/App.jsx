import { useState } from 'react'
import { Header } from '../components/Header'
import { Route, Routes } from "react-router-dom";
import './App.css'
import { LoadingWrap } from '../components/Loading'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { EventForm } from '../components/EventForm'
import { EventList } from '../components/EventList';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Header></Header>
      <Routes>
        {/*TO-DO change "/" logged->dashboard else login*/}
        <Route path="/" element={<LoginForm/>} /> 
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/events" element={<EventList/>} />
      </Routes>
    
    </div>
    </>
  )
}

export default App
