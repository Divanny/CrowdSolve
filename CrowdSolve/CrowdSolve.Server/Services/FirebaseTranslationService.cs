using Google.Cloud.Translation.V2;

namespace CrowdSolve.Server.Services
{
    public class FirebaseTranslationService
    {
        private readonly TranslationClient _client;

        public FirebaseTranslationService()
        {
            _client = TranslationClient.Create();
        }

        public string Traducir(string texto, string idiomaDestino)
        {
            var response = _client.TranslateText(texto, idiomaDestino);
            return response.TranslatedText;
        }
    }
}
