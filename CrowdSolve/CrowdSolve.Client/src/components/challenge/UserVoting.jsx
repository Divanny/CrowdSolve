const UserVoting = ({ solutions }) => {
    return (
        <div>
            <h2>Evaluación por Votación</h2>
            {solutions.map(solution => (
                <div key={solution.idSolucion}>
                    <h3>{solution.titulo}</h3>
                    <p>{solution.descripcion}</p>
                    <button>Votar +1</button>
                </div>
            ))}
        </div>
    );
};

export default UserVoting;