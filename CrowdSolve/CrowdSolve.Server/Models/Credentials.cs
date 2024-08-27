using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class Credentials
    {
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string? Username { get; set; }

        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string? Password { get; set; }
    }
}
