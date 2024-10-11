using System.Security.Cryptography;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Provides methods for hashing and verifying passwords.
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 128 / 8;
        private const int KeySize = 256 / 8;
        private const int Iterations = 10000;
        private static readonly HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA256;
        private const char Delimiter = ';';

        /// <summary>
        /// Hashes a password using a random salt.
        /// </summary>
        /// <param name="password">The password to hash.</param>
        /// <returns>The hashed password.</returns>
        public string Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, hashAlgorithmName, KeySize);

            return string.Join(Delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
        }

        /// <summary>
        /// Verifies if a password matches a given hash.
        /// </summary>
        /// <param name="hash">The hash to compare against.</param>
        /// <param name="password">The password to verify.</param>
        /// <returns>True if the password matches the hash, otherwise false.</returns>
        public bool Check(string hash, string password)
        {
            var elements = hash.Split(Delimiter);
            var saltBytes = Convert.FromBase64String(elements[0]);
            var hashBytes = Convert.FromBase64String(elements[1]);

            var hashInput = Rfc2898DeriveBytes.Pbkdf2(password, saltBytes, Iterations, hashAlgorithmName, KeySize);
            return CryptographicOperations.FixedTimeEquals(hashBytes, hashInput);
        }
    }

    /// <summary>
    /// Provides methods for hashing and verifying passwords.
    /// </summary>
    public interface IPasswordHasher
    {
        /// <summary>
        /// Hashes a password using a random salt.
        /// </summary>
        /// <param name="password">The password to hash.</param>
        /// <returns>The hashed password.</returns>
        string Hash(string password);

        /// <summary>
        /// Verifies if a password matches a given hash.
        /// </summary>
        /// <param name="hash">The hash to compare against.</param>
        /// <param name="password">The password to verify.</param>
        /// <returns>True if the password matches the hash, otherwise false.</returns>
        bool Check(string hash, string password);
    }

}
