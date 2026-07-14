import axios from 'axios';
import Logger from '../lib/Logger';

export const AxiosClient = axios.create({
  timeout: 30_000,
});

AxiosClient.interceptors.request.use((config) => {
  if ((config as any).debug) {
    (config as any).metadata = { startTime: Date.now() };
    Logger.debug({
      message: `Axios Request: ${config.method?.toUpperCase()} ${config.url}`,
      data: config.data,
      params: config.params,
    });
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

AxiosClient.interceptors.response.use((response) => {
  if ((response.config as any).debug) {
    const duration = Date.now() - (response.config as any).metadata.startTime;
    Logger.debug({
      message: `Axios Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`,
      status: response.status,
      data: response.data,
    });
  }
  return response;
}, (error) => {
  if (error.config?.debug) {
    const duration = error.config.metadata ? Date.now() - error.config.metadata.startTime : 'unknown';
    Logger.error({
      message: `Axios Error: ${error.config.method?.toUpperCase()} ${error.config.url} - ${duration}ms`,
      error: error.message,
      data: error.response?.data,
    });
  }
  return Promise.reject(error);
});
