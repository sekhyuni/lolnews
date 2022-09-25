import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import articleReducer from '../features/articleSlice';
import wordReducer from '../features/wordSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        article: articleReducer,
        word: wordReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;