import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import doAxiosRequest from "../../functions/doAxiosRequest";

interface Wordcloud {
    text: string;
    value: number;
}

interface WordcloudAttributes {
    listOfWordcloud: Array<Wordcloud>;
}

const initialState: WordcloudAttributes = {
    listOfWordcloud: [],
};

export const searchListOfWordcloudAPICall = createAsyncThunk('wordcloudSlice/searchListOfWordcloudAPICall', async (paramsOfSearch: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('GET', '/wordcloud', paramsOfSearch, true);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

const wordcloudSlice = createSlice({
    name: 'wordcloud',
    initialState,
    reducers: {
        setListOfWordcloud: (state, action: PayloadAction<any>) => {
            state.listOfWordcloud = Object.entries(action.payload).map((entry: any) => ({ text: entry[0], value: entry[1] }));
        },
        clearWordcloudState: (): WordcloudAttributes => initialState,
    },
});

const { actions, reducer } = wordcloudSlice;
export const { setListOfWordcloud, clearWordcloudState } = actions;
export default reducer;