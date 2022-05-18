export const FAILURE_MESSAGES = {
  SERVER_DOWN:
    "The API server appears to be down. Please ensure that the Node server is up and running.",
  AUTHENTICATION_FAILED: `Authentication was unsuccessful. Please double-check that the values in the .env file are correct.
If you are still unable to access the API, please contact the NexHealth team.`,
  ACCESS_FORBIDDEN: `It appears that the authorization with the NexHealth API failed. Please double-check that the values in the .env file are correct. If the issue persists, contact the NexHealth team for assistance.`,
};
