import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { activityService, ActivityResponse, ActivityRequest } from '../../api/services';

interface ActivityState {
  items: ActivityResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await activityService.getAllActivities();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addActivity = createAsyncThunk(
  'activities/add',
  async (data: ActivityRequest, { rejectWithValue }) => {
    try {
      const response = await activityService.trackActivity(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<ActivityResponse[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addActivity.fulfilled, (state, action: PayloadAction<ActivityResponse>) => {
        state.items.unshift(action.payload);
      });
  },
});

export default activitySlice.reducer;
