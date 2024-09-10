const store = require("../app/redux/store");
const {
  fetchVideos,
  fetchRelatedVideos,
} = require("../app/redux/features/video/videoSlice");

store.subscribe(() => {
  console.log(store.getState);
});

store.dispatch(fetchVideos());
store.dispatch(fetchRelatedVideos(["javascript", "react"]));
