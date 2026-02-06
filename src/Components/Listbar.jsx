import React, { useEffect, useState } from "react";
// import "./Listbar.css"
import api from "../api"
import { LuPlus } from "react-icons/lu";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineUpdate } from "react-icons/md";

export default function Listbar(){

    const [content, setContent] = useState("");
    const [lists, setlists] = useState([])
    const [editId, setEditId] = useState(null);

    const handleCheckboxChange = (taskId) => {
        const currentTask = lists.find(task => task.id === taskId);
        const newCompletedStatus = !currentTask.boolen;
      
        // Update backend
        api.patch(`/task/update/${taskId}/`, { boolen: newCompletedStatus })
          .then(res => {
            // Update frontend state after successful patch
            setlists(prevLists =>
              prevLists.map(task =>
                task.id === taskId ? { ...task, boolen: newCompletedStatus } : task
              )
            );
          })
          .catch(err => {
            console.error("Error updating completed status:", err);
          });
      };

// Get data ---->

    useEffect(function(){
        api.get('/tasks/')
        .then(res => {
            setlists(res.data)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [])



// submit ----->



    const handleSubmit = (e) => {
        e.preventDefault(); 

        if (!content.trim()) return;

        api.post("/tasks/", {content: content,})
        .then(res => {
            return api.get('/tasks/');
        })

        .then(res => {
            setlists(res.data)
            setContent("")



        })

        .catch(err => {
            console.log(err.message)
        })
    
}


// delete ----->



function deleteTask(id) {
    
    
    api.delete(`/task/delete/${id}/`)
    .then(res => {
        setlists(prevLists => prevLists.filter(task => task.id !== id));
            // refresh tasks after deletion
        })
        .catch(err => {
            console.error("Error deleting:", err);
        });
    }



// Update ---->


    
    function startEditing(task) {
        setEditId(task.id);
        setContent(task.content); // only load content
    }


function handleUpdateSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    const updatedData = {
        content: content
    };

    api.patch(`/task/update/${editId}/`, updatedData)
        .then(res => {
            setlists(prevLists => prevLists.map(task =>
                task.id === editId ? res.data : task
            ));
            setContent("");
            setEditId(null);
        })
        .catch(err => {
            console.log(err.message);
        });
}


    return(
        <div className="p-4">

            <div className="flex flex-col items-center justify-center gap-2 max-w-[1200px] mx-auto h-screen">

             <h1 className="text-3xl font-bold">Your To Do</h1>
             <form onSubmit={editId ? handleUpdateSubmit : handleSubmit} className="flex flex-col gap-5">

            <div className="flex items-center gap-5">
                <input
                    className="border-b-2 px-4 py-2 focus:outline-none w-[350px]"
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter content"
                />


                <button className="p-2 bg-black text-amber-50 border-2 rounded-[10px] cursor-pointer" type="submit">{editId ? <MdOutlineSystemUpdateAlt/> : <LuPlus/>}</button>

            </div>


                
                    {lists.map(task => (
                       <div key={task.id}>
                        <ul className="">

                          <li className="flex items-center justify-between border-2 rounded-[10px] px-3 py-2">
                            <div className="flex items-center gap-3">

                            <input 
                              type="checkbox" 
                              checked={task.boolen} 
                              className="check cursor-pointer" 
                              onChange={() => handleCheckboxChange(task.id)}
                            />

                            <span id="texts" className={task.boolen ? "line-through" : null }>{task.content}</span>
                            </div>

                            <div className="space-x-5">
                                <button type="button" onClick={() => startEditing(task)} className="update p-3 bg-black text-amber-50 rounded-[10px] cursor-pointer"><MdOutlineUpdate/></button>
                                <button onClick={() => deleteTask(task.id)}  className="delete p-3 bg-black text-amber-50 rounded-[10px] cursor-pointer"><RiDeleteBin5Line/></button>
                            </div>
                          </li>
                        </ul>
                      </div>
                        ))}
                  
            </form>
            </div>
        </div>


    )
}