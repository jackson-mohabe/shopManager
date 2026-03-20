export const logError = (screen, error) => {
  const log = {
    screen,
    error: error.message || String(error),
    time: new Date().toLocaleString(),
  };

  const existing = JSON.parse(localStorage.getItem("error_logs") || "[]");
  existing.unshift(log);

  if (existing.length > 50) existing.pop();
  localStorage.setItem("error_logs", JSON.stringify(existing));
  console.error(`[${screen}] Error:`, error);
};

export const getErrorLogs = () => {
  return JSON.parse(localStorage.getItem("error_logs") || "[]");
};

export const clearErrorLogs = () => {
  localStorage.removeItem("error_logs");
};
