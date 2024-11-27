import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '@/hooks/use-axios';
import CompanyEvaluation from '@/components/challenge/CompanyEvaluation';
import UserVoting from '@/components/challenge/UserVoting';
import { useSelector } from 'react-redux';

const ChallengeEvaluation = () => {
    const { challengeId } = useParams();
    const { api } = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await api.get(`/api/Desafios/${challengeId}`);
                setChallenge(response.data);
                setSolutions(response.data.Soluciones);
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate(-1); // Go back to the previous route
            }
        };

        fetchChallenge();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeId, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!challenge) {
        return <div>Desafío no encontrado</div>;
    }

    const currentEvaluationProcess = challenge.procesoEvaluacion.find(pe => pe.idEstatusProceso === challenge.idEstatusDesafio);

    if (challenge.EstatusDesafio !== 'En evaluación') {
        navigate(-1); // Go back to the previous route
        return null;
    }

    if (currentEvaluationProcess.tipo === 'Empresa' && user.idUsuario !== challenge.idUsuarioEmpresa) {
        navigate(-1); // Go back to the previous route
        return null;
    }

    if (currentEvaluationProcess.tipo === 'Comunidad' && (user.informacionEmpresa || !user)) {
        navigate(-1); // Go back to the previous route
        return null;
    }

    if (currentEvaluationProcess.tipo === 'Participantes' && !solutions.some(solution => solution.idUsuario === user.idUsuario)) {
        navigate(-1); // Go back to the previous route
        return null;
    }

    return (
        <div className="container mx-auto py-8">
            <h1>Evaluación del Desafío</h1>
            {currentEvaluationProcess.tipo === 'Empresa' && <CompanyEvaluation solutions={solutions} />}
            {(currentEvaluationProcess.tipo === 'Comunidad' || currentEvaluationProcess.tipo === 'Participantes') && <UserVoting solutions={solutions} />}
        </div>
    );
};

export default ChallengeEvaluation;