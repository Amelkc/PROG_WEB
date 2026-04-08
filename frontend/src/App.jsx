import { useState } from 'react'
import { Header } from '../components/Header'
import { Route, Routes } from "react-router-dom";
import './App.css'
import { LoadingWrap } from '../components/LoadingWrap'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { EventForm } from '../components/EventForm'
import { EventList } from '../components/EventList';
import { Footer } from '../components/footer';
import { EventDetails } from '../components/EventDetails';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='app-content'>
      <Header></Header>
      <Routes>
        {/*TO-DO change "/" logged->dashboard else login*/}
        <Route path="/" element={<EventForm/>} /> 
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/events" element={<EventList/>} />
        <Route path="/events/test" element={<EventDetails/>} />
      </Routes>
      <Footer></Footer>
    </div>
    </>
  )
}

export default App
