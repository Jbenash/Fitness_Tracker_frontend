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

export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await activityService.deleteActivity(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingActivity = createAsyncThunk(
  'activities/update',
  async ({ id, data }: { id: string; data: Partial<ActivityRequest> }, { rejectWithValue }) => {
    try {
      const response = await activityService.updateActivity(id, data);
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
      })
      .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(updateExistingActivity.fulfilled, (state, action: PayloadAction<ActivityResponse>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default activitySlice.reducer;
