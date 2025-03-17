const Persons = ({persons, onClickDelete}) => (
    <div>
        <ul>
            {persons.map((person) => (
                <li key={person.id}>{person.name} {person.number}
                    <button onClick={() => onClickDelete(person.id, person.name)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
)
export default Persons