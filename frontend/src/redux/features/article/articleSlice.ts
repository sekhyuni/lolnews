import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import doAxiosRequest from "../../../functions/doAxiosRequest";

interface ArticleAttributes {
}

const initialState: ArticleAttributes = {
};

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        clearState: (): ArticleAttributes => initialState,
    },
});

const { actions, reducer } = articleSlice;
export const { clearState, } = actions;
export default reducer;