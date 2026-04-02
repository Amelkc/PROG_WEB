import { useState } from 'react'
import { Header } from '../components/Header'
import './App.css'
import { LoadingWrap } from '../components/Loading'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { EventForm } from '../components/EventForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Header></Header>
      <EventForm></EventForm>
    
    </div>
    </>
  )
}

export default App
