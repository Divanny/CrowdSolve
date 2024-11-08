import { useSelector } from "react-redux";
import { selectUserViews } from "../redux/selectors/userSelectors";
/**
 * Hook para validar el acceso del usuario a una ruta específica.
 * @param {number} permisoId - El ID del permiso del enum PermisosEnum.
 * @returns {boolean} - Devuelve true si el usuario tiene permiso, de lo contrario false.
 */
function usePermisoAcceso(permisoId) {
  // Acceder al estado de Redux donde están almacenados los permisos del usuario
  const vistasUsuario = useSelector(selectUserViews);

  // Validar si el permisoId está en la lista de permisos del usuario
  const tienePermiso = vistasUsuario.some((x) => x.idVista == permisoId);
  
  return tienePermiso;
}

export default usePermisoAcceso;
