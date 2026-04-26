import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiService, Recommendation } from '../../api/services';

interface AIState {
  recommendations: Recommendation[];
  currentRecommendation: Recommendation | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  recommendations: [],
  currentRecommendation: null,
  loading: false,
  error: null,
};

//thunk - A function that wraps an expression to delay its evaluation.
//In Redux, thunks allow you to write action creators that return a function instead of an action.
//Thunks are the standard way to handle async logic in Redux.

export const fetchAIInsights = createAsyncThunk(
  'ai/fetchInsights',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await aiService.getUserRecommendations(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActivityRecommendation = createAsyncThunk(
  'ai/fetchActivityRecommendation',
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await aiService.getActivityRecommendations(activityId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearCurrentRecommendation: (state) => {
      state.currentRecommendation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActivityRecommendation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivityRecommendation.fulfilled, (state, action: PayloadAction<Recommendation>) => {
        state.loading = false;
        state.currentRecommendation = action.payload;
      })
      .addCase(fetchActivityRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRecommendation } = aiSlice.actions;
export default aiSlice.reducer;
