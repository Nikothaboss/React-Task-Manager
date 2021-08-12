import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }
    getTasks()
  }, [])

  //. Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks")
    const data = await res.json()

    console.log(data)

    return data
  }

  //. Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])


    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task };
    // setTasks([newTask, ...tasks])
  }

  const deleteTask = async (id) => {
    // . Delete request - server side
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    console.log(data)

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  const hideAddTask = () => {
    setShowAddTask(!showAddTask)
  }


  return (
    <Router>
      <div className="container">
        <Header title="Task Manager" onClick={hideAddTask} color={showAddTask ? "red" : "green"} text={showAddTask ? "X" : "Add"} />

        <Route path="/" exact render={() => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "No more tasks"}
          </>
        )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
