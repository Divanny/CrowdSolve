using System;
using Microsoft.AspNetCore.Http;

namespace CrowdSolve.Server.Infrastructure
{
    public static class Utils
    {
        public static bool IsLastPart(IHeaderDictionary headers)
        {
            int isLastPart;
            if (!int.TryParse(headers["X-Last-Part"].ToString(), out isLastPart))
            {
                isLastPart = 1;
            }
            return Convert.ToBoolean(isLastPart);
        }
    }
}