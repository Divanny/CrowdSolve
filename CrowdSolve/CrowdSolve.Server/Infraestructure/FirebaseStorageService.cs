using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Mvc;

namespace CrowdSolve.Server.Infraestructure
{
    public class FirebaseStorageService
    {
        private readonly StorageClient _storageClient;
        private readonly string _bucketName = "crowdsolve-e4ade.appspot.com";

        public FirebaseStorageService()
        {
            var credentialPath = Path.Combine(Directory.GetCurrentDirectory(), "crowdsolve-e4ade-firebase-adminsdk-4q77k-452ab49a66.json");
            GoogleCredential credential = GoogleCredential.FromFile(credentialPath);
            _storageClient = StorageClient.Create(credential);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string objectName, string contentType)
        {
            var storageObject = await _storageClient.UploadObjectAsync(_bucketName, objectName, contentType, fileStream);
            return storageObject.Id;
        }

        public async Task<MemoryStream> GetFileAsync(string id)
        {
            var memoryStream = new MemoryStream();

            var parts = id.Substring(_bucketName.Length + 1).Split('/');
            var filePath = string.Join("/", parts.Take(parts.Length - 1));

            await _storageClient.DownloadObjectAsync(_bucketName, filePath, memoryStream);

            memoryStream.Position = 0;

            return memoryStream;
        }

        public async Task DeleteFileAsync(string id)
        {
            var parts = id.Substring(_bucketName.Length + 1).Split('/');
            var filePath = string.Join("/", parts.Take(parts.Length - 1));

            await _storageClient.DeleteObjectAsync(_bucketName, filePath);
        }
    }
}