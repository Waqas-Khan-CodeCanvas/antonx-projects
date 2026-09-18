async function createUser() {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Ali",
      age:26,
      city:"mardan"
    }),
  });
  const data = await response.json();
  console.log("data" , data)
}

createUser()