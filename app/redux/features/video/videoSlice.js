const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Initial state
const initialState = {
  loading: false,
  videos: [],
  error: "",
};

// Asynchronous thunk to fetch all videos
const fetchVideos = createAsyncThunk("video/fetchVideos", async () => {
  const res = await fetch("http://localhost:9000/videos");
  const videos = await res.json();
  return videos;
});

// Asynchronous thunk to fetch related videos based on tags
const fetchRelatedVideos = createAsyncThunk(
  "video/fetchRelatedVideos",
  async (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error("Tags must be a non-empty array");
    }

    const queryString = tags
      .map((tag) => `tags_like=${encodeURIComponent(tag)}`)
      .join("&");
    const res = await fetch(`http://localhost:9000/videos?${queryString}`);
    const relatedVideos = await res.json();

    return relatedVideos;
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchVideos.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(fetchVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.videos = action.payload;
      console.log("Fetched Videos:", action.payload);
    });

    builder.addCase(fetchVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.videos = [];
    });

    builder.addCase(fetchRelatedVideos.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(fetchRelatedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";

      // Sorting related videos by views in descending order
      const sortedVideos = action.payload
        .map((video) => ({
          ...video,
          views: parseInt(video.views.replace("k", "000").replace(",", ""), 10),
        }))
        .sort((a, b) => b.views - a.views);

      console.log("Sorted Related Videos:", sortedVideos);
      state.videos = sortedVideos;
    });

    builder.addCase(fetchRelatedVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.videos = [];
    });
  },
});

module.exports = {
  videoReducer: videoSlice.reducer,
  fetchVideos,
  fetchRelatedVideos,
};
