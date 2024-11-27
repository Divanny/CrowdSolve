const CompanyEvaluation = ({ solutions }) => {
    return (
        <div>
            <h2>Evaluación de la Empresa</h2>
            {solutions.map(solution => (
                <div key={solution.idSolucion}>
                    <h3>{solution.titulo}</h3>
                    <p>{solution.descripcion}</p>
                    <input type="number" min="0" max="100" placeholder="Puntuación (0-100)" />
                </div>
            ))}
        </div>
    );
};

export default CompanyEvaluation;