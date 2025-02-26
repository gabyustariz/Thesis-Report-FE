// apiFunctions.ts
import axios, { AxiosResponse } from 'axios';
import api from './axiosConfig';

export const fetchData = async <T>(url: string, params = {}): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, { params });
  return response.data;
};

export const postData = async <T>(url: string, data = {}): Promise<T> => {
  const response: AxiosResponse<T> = await api.post(url, data);
  return response.data;
};

export const putData = async <T>(url: string, data = {}): Promise<T> => {
  const response: AxiosResponse<T> = await api.put(url, data);
  return response.data;
};

export const patchData = async <T>(url: string, data = {}): Promise<T> => {
  const response: AxiosResponse<T> = await api.patch(url, data);
  return response.data;
};