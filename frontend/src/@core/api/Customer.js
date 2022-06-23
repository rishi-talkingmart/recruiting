import { apiInstance } from './axiosInstance';

const tenant_id = process.env.VUE_APP_TENANT_ID;

const createCustomer = (name, email) => apiInstance().post(`customer/create`, { name, email, tenant_id });

export { createCustomer };
