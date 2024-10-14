using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Infraestructure
{
    public static class ModelValidation
    {
        public static bool IsValid { get; set; }
        public static Dictionary<string, string> Errors { get; set; }

        /// <summary>
        /// Obtiene los errores de validación de un objeto.
        /// </summary>
        /// <param name="thing">El objeto a validar.</param>
        /// <returns>Un diccionario con los errores de validación.</returns>
        public static Dictionary<string, string> GetErrors(object thing)
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            var vc = new ValidationContext(thing, null);
            var success = Validator.TryValidateObject(thing, vc, errors, true);

            Dictionary<string, string> ValidationErrors = new Dictionary<string, string>();

            foreach (ValidationResult err in errors)
            {
                ValidationErrors.Add(err.MemberNames.First(), err.ErrorMessage);
            }

            return ValidationErrors;
        }
    }
}
