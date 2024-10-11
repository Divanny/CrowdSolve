using System.Security.Cryptography;
using System.Text;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase para generar códigos OTP.
    /// </summary>
    public static class OTP
    {
        /// <summary>
        /// Generar un código OTP.
        /// </summary>
        /// <returns></returns>
        public static string GenerateOTP()
        {
            string secretKey = "12345678901234567890";
            string digits = "6";

            long T0 = 0;
            long X = 30;

            long currentTimestamp = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;
            long step = X == 0 ? 30 : X;

            long T = (currentTimestamp - T0) / step;

            string steps = Convert.ToString(T, 16).PadLeft(16, '0');

            byte[] msg = Encoding.UTF8.GetBytes(steps);
            byte[] k = Encoding.UTF8.GetBytes(secretKey);

            HMACSHA1 hmac = new HMACSHA1(k);
            byte[] hash = hmac.ComputeHash(msg);

            int offset = hash[hash.Length - 1] & 0xf;

            int binary = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);

            int otp = binary % (int)Math.Pow(10, Convert.ToInt32(digits));

            return otp.ToString().PadLeft(Convert.ToInt32(digits), '0');
        }
    }
}
