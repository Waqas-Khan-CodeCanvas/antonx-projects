import express from "express";
import cors from "cors";
const app = express();
const port  = 3000;

app.use(cors())
app.use(express.json())

app.get("/", (req , res)=>{
    res.json("hello world")
})

app.get("/users" , (req , res)=>{
    res.json(["kamran","waqas " , "faizan " , "shaheer " , "naheel " , "zaryab "])
})

app.post("/addUser", (req, res) => {
    // Check if the username field actually exists inside req.body
    if (req.body && req.body.username) {
        console.log("Received data:", req.body); // Will print: { username: "your_input" }
        console.log("user added successfully.");
        
        // Always return a JSON response and a 201 (Created) status code
        res.status(201).json({ 
            success: true, 
            message: "User added successfully.",
            user: req.body.username 
        });
    } else {
        // Return a 400 (Bad Request) if the payload is empty or wrong
        res.status(400).json({ 
            success: false, 
            message: "Sorry, user was not added. Missing username field." 
        });
    }
});


app.listen(port , ()=>{
    console.log("server is running on port", port)
})