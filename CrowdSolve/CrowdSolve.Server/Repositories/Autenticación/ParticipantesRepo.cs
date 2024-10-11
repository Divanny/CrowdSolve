using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class ParticipantesRepo : Repository<Participantes, ParticipantesModel>
    {
        public ParticipantesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<ParticipantesModel, Participantes>(p => new Participantes()
            {
                idParticipante = p.idParticipante,
                idUsuario = p.idUsuario,
                Nombres = p.Nombres,
                Apellidos = p.Apellidos,
                FechaNacimiento = p.FechaNacimiento,
                Telefono = p.Telefono,
                idNivelEducativo = p.idNivelEducativo,
                DescripcionPersonal = p.DescripcionPersonal
            }),
            (DB, filter) =>
            {
                return (from p in DB.Set<Participantes>().Where(filter)
                        join nivelEducativo in DB.Set<NivelesEducativo>() on p.idNivelEducativo equals nivelEducativo.idNivelEducativo
                        select new ParticipantesModel()
                        {
                            idParticipante = p.idParticipante,
                            idUsuario = p.idUsuario,
                            Nombres = p.Nombres,
                            Apellidos = p.Apellidos,
                            FechaNacimiento = p.FechaNacimiento,
                            Telefono = p.Telefono,
                            idNivelEducativo = p.idNivelEducativo,
                            NivelEducativo = nivelEducativo.Nombre,
                            DescripcionPersonal = p.DescripcionPersonal,
                        });
            }
        )
        {

        }
    }
}
