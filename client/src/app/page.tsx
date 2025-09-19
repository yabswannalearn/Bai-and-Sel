"use client"

import React, { useEffect, useState} from 'react'

export default function page() {

  const[message, setMessage] = useState("Loading");
  const[items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/home").then(
    response => response.json()
  ).then(
    data => {
      console.log(data)
      setMessage(data.message)
      setItems(data.items)
    }
  )
  }, [])

  return (
    <div>
      <div>{message}</div>

    {items.map((items, index) => (
        <div key={index}>{items}</div>
      ))}

    </div>

  )
}
