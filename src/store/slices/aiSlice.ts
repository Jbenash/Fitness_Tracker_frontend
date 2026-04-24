import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiService, Recommendation } from '../../api/services';

interface AIState {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  recommendations: [],
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

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {},
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
      });
  },
});

export default aiSlice.reducer;
