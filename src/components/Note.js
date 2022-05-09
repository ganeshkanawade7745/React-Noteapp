import React, { useContext } from 'react'
import NoteContext from '../context/NoteContext'

const Note = () => {
    const context = useContext(NoteContext)


    const { notes, setNotes } = context;


  return (
    <div className='contianer my-3'>
    <h2>your Notes</h2>
    {notes.map((note)=>{
      return note.title;
    })}

  </div>
  )
}

export default Note