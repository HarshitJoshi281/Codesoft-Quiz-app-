import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import user from "./models/user.js"; 
import Quiz from "./models/question.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


await mongoose.connect("mongodb://localhost:27017/qizapp");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
  res.render("index");
});
app.get("/signin", (req,res) => {
  res.render("signin")
}
)
app.post("/signin", async (req, res) => {
  
  const { email, password } = req.body;
  
  try {
    const newUser = new user({ Email: email, Password: password });
    const existing = await user.findOne({Email: email} )
    if(existing){
      res.send(`<script>alert("Already a user try signup!"); window.location.href = "/signup";</script>`)
    }
     
    else{
      await newUser.save();
      res.send(`<script> alert("Info saved "); window.location.href = "/signup";</script>`)
   
    ;}
  } catch (err) {
    res.status(500).send("Error saving user: " + err);
  }
});
app.get("/signup", (req,res) => {
  res.render("signup")
}
)

app.post("/signup", async (req, res) => {
  
  const {email , password}= req.body
  let exists = await user.findOne({Email:email, Password: password})
  
  if(exists){
    res.send(`<script> window.location.href = "/submit-quiz";</script>`)
  }
  else{
    res.send(`<script>alert("Wrong email or password"); window.location.href = "/signup";</script>`);
  }
});
app.get("/submit-quiz", (req,res) => {
  res.render("quiz_create")
}
)
app.post("/submit-quiz", async (req, res) => {
  const { quizName, questions } = req.body;

  try {
    const exists = await Quiz.findOne({ quizName });

    if (exists) {
      return res.status(400).json({ error: "Quiz already exists" });
     
    }

    const newQuiz = new Quiz({ quizName, questions });
    await newQuiz.save();

    return res.status(200).json({ message: "Quiz submitted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});
app.get("/signinj", (req,res) => {
  res.render("signinj")
}
)
app.post("/signinj", async (req, res) => {
  
  const { email, password } = req.body;
  
  try {
    const newUsers = new user({ Email: email, Password: password });
    const existings = await user.findOne({Email: email} )
    if(existings){
      res.send(`<script>alert("Already a user try signup!"); window.location.href = "/signupj";</script>`)
    }
     
    else{
      await newUsers.save();
      res.send(`<script> alert("Info saved "); window.location.href = "/signupj";</script>`)
   
    ;}
  } catch (err) {
    res.status(500).send("Error saving user: " + err);
  }
});
app.get("/signupj", (req,res) => {
  res.render("signupj")
}
)

app.post("/signupj", async (req, res) => {
  
  const {email , password}= req.body
  let exists = await user.findOne({Email:email, Password: password})
  
  if(exists){
    res.send(`<script> alert("Welcome To our Quiz ");window.location.href = "/quiz";</script>`)
  }
  else{
    res.send(`<script>alert("Wrong email or password"); window.location.href = "/signupj";</script>`);
  }
});

app.get("/quiz", async (req, res) => {
  res.render("quiz")
});
app.get("/get-quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, "quizName");
    res.json(quizzes); 
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/quiz/:quizName", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizName: req.params.quizName });
    if (!quiz) {
      return res.status(404).send("Quiz not found");
    }
    res.render("take_quiz", { quiz });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/submit-answers/:quizName", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizName: req.params.quizName });
    if (!quiz) return res.status(404).send("Quiz not found");

    const userAnswers = req.body.answers;
    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      // Find the index of the  answer
      const userAnswerIndex = question.options.indexOf(userAnswers[index]);
      const isCorrect = userAnswerIndex === question.correctAnswerIndex;
      
      if (isCorrect) score++;
      
      results.push({
        question: question.question,
        userAnswer: userAnswers[index],
        correctAnswer: question.options[question.correctAnswerIndex],
        isCorrect
      });
    });

    res.render("quiz_results", {
      quizName: quiz.quizName,
      score,
      totalQuestions: quiz.questions.length,
      results
    });
  } catch (err) {
    console.error("Error processing answers:", err);
    res.status(500).send("Server error");
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
