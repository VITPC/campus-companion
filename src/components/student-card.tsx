type StudentCardProps = {
    student: Student;
};

export default function StudentCard({ student }: StudentCardProps) {
    return (
        <section id="profile">
            <div>
                <img
                    className="profile__image"
                    src={student.avatar as string}
                    alt="profile headshot image of a woman"
                />
                <span className="profile__upload">Upload image</span>
            </div>

            <div className="profile__name">
                <h3>{student.name}</h3>
                <p>{student.programme}</p>
            </div>

            <dl id="profile__info">
                <dt>student ID</dt>
                <dd>{student.id}</dd>

                <dt>Program</dt>
                <dd>{student.programme}</dd>

                <dt>Year</dt>
                <dd>{student.academicYear}</dd>

                <dt>Email</dt>
                <dd>{student.email}</dd>

                <dt>Phone</dt>
                <dd>{student.phone}</dd>

                <dt>Bio</dt>
                <dd>{student.bio}</dd>
            </dl>
        </section>
    );
}
