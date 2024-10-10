using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Models;
using System.Net.Mail;
using System.Net.Mime;
using System.Reflection.Metadata;

namespace CrowdSolve.Server.Infraestructure
{
    public static class Mailing
    {
        private static string mailTemplatesPath = "wwwroot/MailTemplates";
        public static Credentials GetCredentials(MailingUsers mailUser)
        {
            switch (mailUser)
            {
                case MailingUsers.administration:
                    return new Credentials()
                    {
                        Email = "",
                        Password = ""
                    };
                case MailingUsers.support:
                    return new Credentials()
                    {
                        Email = "support@crowdsolve.site",
                        Password = "v6wnZ#aj"
                    };
                default:
                    return new Credentials()
                    {
                        Email = "noreply@crowdsolve.site",
                        Password = "l8e&kecB"
                    };
            }
        }

        public static void SendMail(MailMessage message, Credentials credentials)
        {
            SmtpClient client = new SmtpClient("smtp.zoho.com", 587);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential(credentials.Email, credentials.Password);
            client.EnableSsl = true;
            client.Send(message);
        }

        public static void SendMail(string[] to, string subject, string body, MailingUsers mailUser)
        {
            MailMessage message = new MailMessage();

            foreach (string item in to)
            {
                message.To.Add(item);
            }

            Credentials credentials = GetCredentials(mailUser);

            string template = System.IO.File.ReadAllText($"{mailTemplatesPath}/mailing-template.html");
            body = template.Replace("${content}", body);

            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;
            message.From = new MailAddress(credentials.Email);

            SendMail(message, credentials);
        }

        public static void SendForgotPasswordMail(string to, string otp)
        {
            string subject = "Recuperación de contraseña";
            string template = System.IO.File.ReadAllText($"{mailTemplatesPath}/forgot-password-email.html");
            string body = template.Replace("${otp}", otp);

            SendMail(new string[] { to }, subject, body, MailingUsers.noreply);
        }
    }
}
