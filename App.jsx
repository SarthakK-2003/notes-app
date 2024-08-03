import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { onSnapshot,addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { notesCollection , db} from './firebase';

export default function App() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [tempNoteText, setTempNoteText] = useState("");
 
    
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt)

    
    //used to set up a real-time listener for changes in a data collection from firebase by using onSnapshot function 
    //and to update the local state in the React component whenever there is a change in that collection
    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            //sync up our local array notes with snapshot data 
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id : doc.id
            }))
            setNotes(notesArr);
        }) 
        return unsubscribe;
    }, []);


    //to acces current note id 
    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    },[notes])

    
    // setting current note to temp note 
    // (it is use effect function to generate debouncing so that there are less reads in our firestore database)
    useEffect(() => {
        if (currentNote){
            setTempNoteText(currentNote.body);
        }
    },[currentNote])

   
    //debouncing 
    useEffect(() => {
        const tiemoutId = setTimeout(() => {
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText);
            }
        },500)
        return () => clearTimeout(tiemoutId)
    },[tempNoteText])

    
    //function to create note using addDoc function from Firebase or firestore 
    //firebase provides us id automatically to the data 
    async function createNewNote() {
        const newNote = {        
            body: "# Type your markdown note's title here",
            createdAt : Date.now(),
            updatedAt : Date.now()
        };
        const newNoteRef = await addDoc(notesCollection,newNote);
        setCurrentNoteId(newNoteRef.id);
    }

    
    //function used to update data from notes using setDoc function and doc function from firestore/firebase 
    async function updateNote(text) {
        const docRef = doc(db,"notes",currentNoteId);
        await setDoc(docRef, {body : text , updatedAt : Date.now()}, {merge : true})
    }

    
    //function used to delete note from notes collection present if firestore db using deleteDoc func
    async function deleteNote(noteId) {
        const docRef = doc(db,"notes",noteId);
        await deleteDoc(docRef)
    }

    
    return (
        <main>
            {
                notes.length > 0 ?
                <Split
                    sizes={[25, 75]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId} 
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    <Editor
                        tempNoteText={tempNoteText}
                        setTempNoteText={setTempNoteText}
                    />
                    
                </Split> :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}
                    >
                        Create one now
                    </button>
                </div>
            }
        </main>
    );
}
