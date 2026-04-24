import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string;
  userProfile: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId') || '',
  userProfile: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ userId: string; profile: any; token: string }>) => {
      state.userId = action.payload.userId;
      state.userProfile = action.payload.profile;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Persist to LocalStorage
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.profile));
    },
    logout: (state) => {
      // Clear Redux State
      state.userId = '';
      state.userProfile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear Persistence
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },
    setUserProfile: (state, action: PayloadAction<any>) => {
      state.userProfile = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setUserId, setUserProfile, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
