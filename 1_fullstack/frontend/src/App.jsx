import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [jockes, setJockes] = useState([]);
    useEffect(() => {
        axios
            .get("/api/jockes")
            .then((response) => {
                setJockes(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <>
            <h1>JOCKES</h1>
            <p>JOCKES: {jockes.length}</p>

            {jockes.map((jock) => (
                <div key={jock.id}>
                    <p>{jock.question}</p>
                    <p>{jock.answer}</p>
                </div>
            ))}
        </>
    );
}

export default App;
