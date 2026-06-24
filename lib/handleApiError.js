export function handleApiError(error, defaultMessage = "Something went wrong") {
  if (!error) return defaultMessage;

  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
}