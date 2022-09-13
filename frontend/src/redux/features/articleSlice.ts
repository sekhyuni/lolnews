import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import doAxiosRequest from "../../functions/doAxiosRequest";

interface Article {
    meta: any;
    data: any;
}

interface ArticleAttributes {
    keyword: string;
    page: number;
    order: string;
    orderIsActive: Array<boolean>;
    listOfArticle: Article;
    modalOfArticleIsOpen: Array<boolean>;
    listOfPopularArticle: Array<any>;
    modalOfPopularArticleIsOpen: Array<boolean>;
}

const initialState: ArticleAttributes = {
    keyword: '',
    page: 1,
    order: 'desc',
    orderIsActive: [true, false, false],
    listOfArticle: { meta: {}, data: [] },
    modalOfArticleIsOpen: [],
    listOfPopularArticle: [],
    modalOfPopularArticleIsOpen: [],
};

export const searchListOfArticleAPICall = createAsyncThunk('articleSlice/searchListOfArticleAPICall', async (paramsOfSearch: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('GET', '/search/keyword', paramsOfSearch);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const searchListOfPopularArticleAPICall = createAsyncThunk('articleSlice/searchListOfPopularArticleAPICall', async (_, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('GET', '/article');
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const insertArticleIdAPICall = createAsyncThunk('articleSlice/insertArticleIdAPICall', async (paramsOfInsert: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('POST', '/article', paramsOfInsert);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const insertForRecommendArticleIdAPICall = createAsyncThunk('articleSlice/insertForRecommendArticleIdAPICall', async (paramsOfInsert: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('POST', '/article/recommend', paramsOfInsert);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        setKeyword: (state, action: PayloadAction<string>) => {
            state.keyword = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        incrementPage: (state) => {
            state.page++;
        },
        decrementPage: (state) => {
            state.page--;
        },
        setOrder: (state, action: PayloadAction<string>) => {
            state.order = action.payload;
        },
        setOrderIsActive: (state, action: PayloadAction<Array<boolean>>) => {
            state.orderIsActive = action.payload;
        },
        setListOfArticle: (state, action: PayloadAction<Article>) => {
            state.listOfArticle = action.payload;
        },
        setListOfPopularArticle: (state, action: PayloadAction<Array<any>>) => {
            state.listOfPopularArticle = action.payload;
        },
        setModalOfArticleIsOpen: (state, action: PayloadAction<Array<boolean>>) => {
            state.modalOfArticleIsOpen = action.payload;
        },
        setModalOfPopularArticleIsOpen: (state, action: PayloadAction<Array<boolean>>) => {
            state.modalOfArticleIsOpen = action.payload;
        },
        clearState: (): ArticleAttributes => initialState,
    },
});

const { actions, reducer } = articleSlice;
export const { setKeyword, setPage, incrementPage, decrementPage, setOrder, setOrderIsActive, setListOfArticle, setListOfPopularArticle, setModalOfArticleIsOpen, setModalOfPopularArticleIsOpen, clearState } = actions;
export default reducer;