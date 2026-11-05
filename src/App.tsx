import StudentCard from "./components/student-card";
import "./index.css";
import type { Student } from "./types";

const fakeStudents: Array<Student> = [
    {
        name: "Bless Darah",
        programme: "Cybersecurity",
        id: "83028e",
        email: "user@test.com",
        phone: "282032038",
        bio: "Nothing to know about me",
        avatar: null,
        academicYear: "2026/2027",
    },
    {
        name: "James Agbor",
        programme: "Data Science",
        id: "83029e",
        email: "james@test.com",
        phone: "679408203",
        bio: "working in the domain of cloud sec",
        avatar: null,
        academicYear: "2026/2027",
    },
];

export function App() {
    return (
        <div>
            <header>
                <h3>Student profile</h3>
                <span>Edit</span>
            </header>
            {fakeStudents.map((fs) => (
                <StudentCard student={fs} key={fs.id} />
            ))}
        </div>
    );
}

export default App;
