import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import doAxiosRequest from "../../functions/doAxiosRequest";

interface WordAttributes {
    listOfPopularWord: Array<string>;
}

const initialState: WordAttributes = {
    listOfPopularWord: [],
};

export const searchListOfPopularWordAPICall = createAsyncThunk('wordSlice/searchListOfPopularWordAPICall', async (_, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('GET', '/word');
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const insertWordAPICall = createAsyncThunk('articleSlice/insertWordAPICall', async (paramsOfInsert: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('POST', '/word', paramsOfInsert);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {
        setListOfPopularWord: (state, action: PayloadAction<Array<string>>) => {
            state.listOfPopularWord = action.payload;
        },
        clearState: (): WordAttributes => initialState,
    },
});

const { actions, reducer } = wordSlice;
export const { setListOfPopularWord, clearState } = actions;
export default reducer;