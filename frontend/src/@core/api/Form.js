import { apiInstance } from './axiosInstance';

const getSteps = (taskId) => apiInstance().get(`workflow/${taskId}/steps`);

export { getSteps };
