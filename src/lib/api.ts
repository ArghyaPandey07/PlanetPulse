import type { Activity } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface DashboardData {
  totalCo2Kg: number;
  categoryBreakdown: Record<string, number>;
  weekRange: { start: string; end: string };
}

export interface WeeklyData {
  targetKg: number | null;
  currentCo2Kg: number;
  progressPercent: number | null;
  exceeded: boolean;
  nudgeMessage: string | null;
  weekRange: { start: string; end: string };
}

// Helpers for mapping nonveg_meal <-> non_veg_meal
const mapTypeToBackend = (type: string) => type === 'nonveg_meal' ? 'non_veg_meal' : type;
const mapTypeToFrontend = (type: string) => type === 'non_veg_meal' ? 'nonveg_meal' : type;

const mapActivityToFrontend = (activity: any): Activity => ({
  ...activity,
  type: mapTypeToFrontend(activity.type),
});

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // We expect the backend to always return JSON for both success and errors (400)
    const json = await res.json();
    return json;
  } catch (err) {
    return {
      success: false,
      errors: [{ field: 'general', message: err instanceof Error ? err.message : 'Network error' }]
    };
  }
}

export const logActivity = async (data: { type: string; quantity: number | string; date: string }): Promise<ApiResponse<Activity>> => {
  const payload = {
    ...data,
    type: mapTypeToBackend(data.type)
  };
  
  const res = await fetchApi<any>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (res.success && res.data) {
    return { ...res, data: mapActivityToFrontend(res.data) };
  }
  return res;
};

export const getActivities = async (filters?: { type?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<Activity[]>> => {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', mapTypeToBackend(filters.type));
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetchApi<any[]>(`/api/activities${qs}`);
  
  if (res.success && res.data) {
    return { ...res, data: res.data.map(mapActivityToFrontend) };
  }
  return res;
};

export const getDashboard = async (): Promise<ApiResponse<DashboardData>> => {
  const res = await fetchApi<any>('/api/dashboard');
  if (res.success && res.data && res.data.categoryBreakdown) {
    const mappedBreakdown: Record<string, number> = {};
    for (const [key, val] of Object.entries(res.data.categoryBreakdown)) {
      mappedBreakdown[mapTypeToFrontend(key)] = val as number;
    }
    return {
      ...res,
      data: {
        ...res.data,
        categoryBreakdown: mappedBreakdown,
      }
    };
  }
  return res;
};

export const getWeekly = () => fetchApi<WeeklyData>('/api/weekly');

export const updateTarget = (weeklyTargetKg: number | null) => 
  fetchApi<{ weeklyTargetKg: number | null }>('/api/settings/target', {
    method: 'PUT',
    body: JSON.stringify({ weeklyTargetKg }),
  });
