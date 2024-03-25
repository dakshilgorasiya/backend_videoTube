import express from "express";

const app = express();

// app.get("/", (req, res) => {
//     res.send("Server is ready");
// });

// get a list of 5 jokes

app.get('/api/jockes', (req, res) => {
    const jokes = [
        {
            id: 1,
            question: "What do you call a bear with no teeth?",
            answer: "A gummy bear",
        },
        {
            id: 2,
            question: "What do you call a computer that sings?",
            answer: "A-Dell",
        },
        {
            id: 3,
            question: "What do you call a fish with no eyes?",
            answer: "Fsh",
        },
        {
            id: 4,
            question: "What do you call a pile of cats?",
            answer: "A meowtain",
        },
        {
            id: 5,
            question: "What do you call a fake noodle?",
            answer: "An impasta",
        },
    ];
    res.send(jokes);
})    

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
