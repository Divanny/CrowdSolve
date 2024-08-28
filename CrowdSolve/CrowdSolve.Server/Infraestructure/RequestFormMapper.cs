using System.Globalization;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase estática que mapea los datos de un formulario de solicitud a un objeto de destino.
    /// </summary>
    public static class RequestFormMapper
    {
        /// <summary>
        /// Mapea los datos de un formulario de solicitud a un objeto de destino.
        /// </summary>
        /// <typeparam name="T">Tipo de objeto de destino.</typeparam>
        /// <param name="request">Colección de formularios de solicitud.</param>
        /// <returns>Objeto de destino mapeado.</returns>
        public static T Map<T>(IFormCollection request) where T : new()
        {
            var item = new T();
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                try
                {
                    Type propType = property.PropertyType;
                    var underlyingType = Nullable.GetUnderlyingType(propType);

                    if (propType == typeof(IFormFile))
                    {
                        var formItemFile = request.Files[property.Name];
                        property.SetValue(item, formItemFile);
                        continue;
                    }

                    if (propType == typeof(IFormFile[]))
                    {
                        var files = request.Files.ToArray();

                        if (files.Length > 0)
                        {
                            var fileArray = new IFormFile[files.Length];
                            Array.Copy(files, fileArray, files.Length);
                            property.SetValue(item, fileArray);
                            continue;
                        }
                    }

                    var formItemValue = request[property.Name];

                    if (string.IsNullOrEmpty(formItemValue)) continue;
                    if (formItemValue == "null") continue;

                    if (propType == typeof(DateTime?))
                    {
                        property.SetValue(item, Convert.ToDateTime(formItemValue, System.Globalization.CultureInfo.InvariantCulture));
                        continue;
                    }

                    if (propType == typeof(string))
                    {
                        property.SetValue(item, formItemValue.ToString());
                        continue;
                    }

                    if (propType == typeof(int))
                    {
                        property.SetValue(item, Convert.ToInt32(formItemValue));
                        continue;
                    }

                    if (propType == typeof(int?))
                    {
                        property.SetValue(item, Convert.ToInt32(formItemValue));
                        continue;
                    }

                    if (propType == typeof(decimal) || underlyingType == typeof(decimal))
                    {
                        property.SetValue(item, Convert.ToDecimal(formItemValue));
                        continue;
                    }

                    if (propType == typeof(TimeSpan?))
                    {
                        property.SetValue(item, TimeSpan.Parse(formItemValue));
                        continue;
                    }

                    if (propType == typeof(bool?))
                    {
                        property.SetValue(item, Convert.ToBoolean(formItemValue));
                        continue;
                    }

                    if (propType.IsEnum)
                    {
                        property.SetValue(item, Enum.Parse(propType, formItemValue));
                        continue;
                    }

                    if (underlyingType == null)
                    {
                        property.SetValue(item, null);
                        continue;
                    }


                    if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
                    {
                        if (underlyingType != null)
                        {
                            var conversionMethod = typeof(Convert).GetMethod("To" + underlyingType.Name, new[] { propType, typeof(CultureInfo) });
                            if (conversionMethod != null)
                            {
                                property.SetValue(item, conversionMethod.Invoke(null, new object[] { formItemValue, CultureInfo.InvariantCulture }));
                                continue;
                            }
                        }
                    }
                }

                catch (Exception ex)
                {
                    throw ex;
                }
            }

            return item;
        }
    }
}
