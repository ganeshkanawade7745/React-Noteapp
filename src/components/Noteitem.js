import React, { useContext } from 'react'
import NoteContext from '../context/NoteContext'

const Noteitem = () => {
    const context = useContext(NoteContext)


  const { notes, setNotes } = context;
  return (
    <div>Noteitem</div>
  )
}

export default Noteitem