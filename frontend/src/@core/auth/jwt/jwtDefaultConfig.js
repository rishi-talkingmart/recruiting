export default {
  // Endpoints
  loginEndpoint: 'oauth/login/access-token',
  registerEndpoint: 'oauth/jwt/register',
  refreshEndpoint: 'oauth/refresh-token',
  logoutEndpoint: 'oauth/jwt/logout',
  profileEndPoint: 'oauth/test-token',
  pendingWorkFlows: 'workflow/pending',
  refreshTokenEndpoint: 'customer/session-token',
  allWorkFlows: 'workflow',
  generateExecutedWorkflow: 'workflow/{0}/generate',
  submitExecutedWorkFlow: 'workflow/{0}/executed/{1}',
  getUwesSurveyData: 'dashboard/me?skip=0&limit=1000',
  verifyAccount: 'customer/create-user/{0}',
  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
};
