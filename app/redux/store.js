const { configureStore } = require("@reduxjs/toolkit");
const { videoReducer } = require("../redux/features/video/videoSlice"); // Import the default reducer
const { createLogger } = require("redux-logger");

const logger = createLogger();

const store = configureStore({
  reducer: {
    video: videoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

module.exports = store;
