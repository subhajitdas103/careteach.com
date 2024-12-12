import { useState, useEffect } from 'react';
import axios from "axios";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [students,setStudents] = useState([])
  useEffect (()=>{
  async function getAllstudents() {
    try {
  const students = await axios.get("http://127.0.0.1:8000/api/student")
  console.log(students.data)
  setStudents(students.data)
    } catch (error) {
      console.log(error);
    }
  }
getAllstudents()
},[])


  return (
    <>
 <h1>Helllllllooooooooo</h1>
{
  students.map((student , i)=>{
    return (
      <h2>{student.student_name}</h2>
    )
})
}
    </>
  );
}

export default App
