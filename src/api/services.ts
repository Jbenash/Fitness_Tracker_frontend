import api from './axios';

export interface ActivityRequest {
  userId: string;
  type: string;
  duration: number;
  caloriesBurnt: number;
  additionalMatrice?: Record<string, any>;
}

export interface ActivityResponse extends ActivityRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  activityId: string;
  userId: string;
  activityType: string;
  recommendationText: string;
  improvements: string[];
  suggestions: string[];
  safety: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export const userService = {
  getProfile: (userId: string) => api.get<UserProfile>(`/api/users/${userId}`),
  register: (data: any) => api.post('/api/users/register', data),
};

export const activityService = {
  trackActivity: (data: ActivityRequest) => api.post<ActivityResponse>('/api/activities', data),
  getAllActivities: () => api.get<ActivityResponse[]>('/api/activities'),
  getActivity: (id: string) => api.get<ActivityResponse>(`/api/activities/${id}`),
};

export const aiService = {
  getUserRecommendations: (userId: string) => api.get<Recommendation[]>(`/api/ai/users/${userId}`),
  getActivityRecommendations: (activityId: string) => api.get<Recommendation>(`/api/ai/activities/${activityId}`),
};
