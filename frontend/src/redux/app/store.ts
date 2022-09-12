import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import articleReducer from '../features/article/articleSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        article: articleReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;