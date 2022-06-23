import jwtDefaultConfig from './jwtDefaultConfig';

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null;

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // For Refreshing Token
  subscribers = [];

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns;
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const accessToken = this.getToken();

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        config.headers['X-API-KEY'] = 'secret';

        config.baseURL = process.env.VUE_APP_API_URL;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 403) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // Update accessToken in localStorage
              this.setToken(r.data.access_token);
              this.onAccessTokenFetched(r.data.access_token);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
    String.prototype.format = function () {
      var args = arguments;
      return this.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] == 'undefined' ? match : args[index];
      });
    };
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) => callback(accessToken));
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args);
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args);
  }
  profile() {
    return Promise.all([this.axiosIns.post(this.jwtConfig.refreshTokenEndpoint), this.axiosIns.post(this.jwtConfig.profileEndPoint)]);
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint + `/${this.getRefreshToken()}`);
  }

  pendingSurveys() {
    return this.axiosIns.get(this.jwtConfig.pendingWorkFlows);
  }

  surveys() {
    return this.axiosIns.get(this.jwtConfig.allWorkFlows);
  }
  async getUwesSurveyData() {
    return (await this.axiosIns.get(this.jwtConfig.getUwesSurveyData)).data.filter((res) => res.workflow_id === process.env.VUE_APP_UWES_ID);
  }
  async verifyAccount(token, password) {
    return this.axiosIns.post(this.jwtConfig.verifyAccount.format(token), { password });
  }
}
