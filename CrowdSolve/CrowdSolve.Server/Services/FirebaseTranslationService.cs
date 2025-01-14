using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Google.Cloud.Translation.V2;

namespace CrowdSolve.Server.Services
{
    public class FirebaseTranslationService
    {
        private readonly TranslationClient _client;
        private readonly IConfiguration _configuration;

        public FirebaseTranslationService(IConfiguration configuration)
        {
            var credentialPath = Path.Combine(Directory.GetCurrentDirectory(), "crowdsolve-e4ade-firebase-adminsdk-4q77k-452ab49a66.json");
            GoogleCredential credential = GoogleCredential.FromFile(credentialPath);
            _client = TranslationClient.Create(credential);
            _configuration = configuration;
        }

        /// <summary>
        /// Traduce un texto a un idioma específico.
        /// </summary>
        /// <param name="texto"></param>
        /// <param name="idiomaDestino"></param>
        /// <returns></returns>
        public string Traducir(string texto, string idiomaDestino)
        {
            if (IsDevelopmentEnvironment())
            {
                return texto;
            }
            var response = _client.TranslateText(texto, idiomaDestino);
            return response.TranslatedText;
        }

        /// <summary>
        /// Verifica si el entorno de desarrollo está activo.
        /// </summary>
        /// <returns>true si el entorno de desarrollo está activo, false en caso contrario.</returns>
        private bool IsDevelopmentEnvironment()
        {
            string environment = _configuration["Environment"];
            return environment == "Development";
        }
    }
}
