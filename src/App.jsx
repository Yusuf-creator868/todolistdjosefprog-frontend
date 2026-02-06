import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './Components/MainLayout'



function App() {
  

  return (

      <div>
        <BrowserRouter>
        <Routes>
          <Route index element={<MainLayout/>}>
          </Route>
        </Routes>
        </BrowserRouter>
      </div>
 
  
  )
}

export default App