using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Models;
using System.Net.Mail;

namespace CrowdSolve.Server.Infraestructure
{
    public class Mailing
    {
        private string mailTemplatesPath = "wwwroot/MailTemplates";
        private IConfiguration configuration;

        public Mailing(IConfiguration config)
        {
            configuration = config;
        }

        public Credentials GetCredentials(MailingUsers mailUser)
        {
            string email = configuration.GetValue<string>($"Mailing:{mailUser}:Email");
            string password = configuration.GetValue<string>($"Mailing:{mailUser}:Password");

            return new Credentials()
            {
                Email = email,
                Password = password
            };
        }

        public void SendMail(MailMessage message, Credentials credentials)
        {
            SmtpClient client = new SmtpClient("smtp.zoho.com", 587);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential(credentials.Email, credentials.Password);
            client.EnableSsl = true;
            client.Send(message);
        }

        public void SendMail(string[] to, string subject, string body, MailingUsers mailUser)
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

        public void SendForgotPasswordMail(string to, string otp)
        {
            string subject = "Recuperación de contraseña";
            string template = System.IO.File.ReadAllText($"{mailTemplatesPath}/forgot-password-email.html");
            string body = template.Replace("${otp}", otp);

            SendMail(new string[] { to }, subject, body, MailingUsers.noreply);
        }
    }
}
