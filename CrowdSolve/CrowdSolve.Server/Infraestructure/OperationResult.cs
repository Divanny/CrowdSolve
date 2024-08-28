namespace CrowdSolve.Server.Infraestructure
{
    public class OperationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public Dictionary<string, string>? Errors { get; set; }
        public object? Data { get; set; }
        public string? Token { get; set; }

        public OperationResult(bool Success, string Message)
        {
            this.Success = Success;
            this.Message = Message;
        }
        public OperationResult(bool Success, string Message, Dictionary<string, string> Errors)
        {
            this.Success = Success;
            this.Message = Message;
            this.Errors = Errors;
        }
        public OperationResult(bool Success, string Message, object Data)
        {
            this.Success = Success;
            this.Message = Message;
            this.Data = ClearFiles(Data);
        }
        public OperationResult(bool Success, string Message, object Data, string token)
        {
            this.Success = Success;
            this.Message = Message;
            this.Data = ClearFiles(Data);
            this.Token = token;
            this.Errors = Errors;
        }
        private object ClearFiles(object data)
        {
            foreach (var prop in data.GetType().GetProperties())
            {
                if (prop.PropertyType == typeof(System.Web.HttpUtility))
                {
                    prop.SetValue(data, null);
                }
            }
            return data;
        }
    }
}
