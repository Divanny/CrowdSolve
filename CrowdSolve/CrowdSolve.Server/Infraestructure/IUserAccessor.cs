/// <summary>
/// Interfaz para acceder a la información del usuario.
/// </summary>
public interface IUserAccessor
{
    /// <summary>
    /// Obtiene el identificador del usuario.
    /// </summary>
    int idUsuario { get; }
}
public class UserAccessor : IUserAccessor
{
    public int idUsuario { get; set; }
}