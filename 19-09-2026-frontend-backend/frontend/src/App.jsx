import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  async function addUser(e) {
    e.preventDefault();

    // 1. Get the string value from the input field
    const usernameValue = e.target.username.value;

    // 2. Put it inside an object that matches what Express expects
    const userPayload = { username: usernameValue };

    try {
      const response = await fetch("http://localhost:3000/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Express looks for this header
        },
        body: JSON.stringify(userPayload), // ⚠️ Make sure this matches your variable name!
      });

      const data = await response.json();
      console.log("Server responded:", data);

      // Update your local UI list dynamically
      setUsers((prevUsers) => [...prevUsers, usernameValue]);
      e.target.reset(); // Clear the input field
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  return (
    <>
      <h2>All users</h2>
      <ul>
        {/* 4. Map over the state variable instead */}
        {users.map((user, index) => (
          // If your user object has an '_id' or 'id' from the database, use that instead of index
          <li key={index}> {user}</li>
        ))}
      </ul>
      <div>
        <form onSubmit={addUser}>
          <input type="text" name="username" placeholder="Enter your name ." />
          <button type="submit">addUser</button>
        </form>
      </div>
    </>
  );
}

export default App;
