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
    orderForDetectOfFetchEffect: string;
    listOfArticle: Article;
    listOfPopularArticle: Array<any>;
    listOfRelatedWord: Array<string>;
    modalOfArticleIsOpen: Array<boolean>;
    modalOfPopularArticleIsOpen: Array<boolean>;
}

const initialState: ArticleAttributes = {
    keyword: '',
    page: 1,
    order: 'desc',
    orderIsActive: [true, false, false],
    orderForDetectOfFetchEffect: 'desc',
    listOfArticle: { meta: {}, data: [] },
    listOfPopularArticle: [],
    listOfRelatedWord: [],
    modalOfArticleIsOpen: [],
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

export const searchListOfRelatedWordAPICall = createAsyncThunk('articleSlice/searchListOfRelatedWordAPICall', async (paramsOfSearch: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('GET', '/related-word', paramsOfSearch);
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
        setOrderForDetectOfFetchEffect: (state, action: PayloadAction<string>) => {
            state.orderForDetectOfFetchEffect = action.payload;
        },
        setListOfArticle: (state, action: PayloadAction<Article>) => {
            state.listOfArticle = action.payload;
        },
        addListOfArticle: (state, action: PayloadAction<Article>) => {
            state.listOfArticle.meta = action.payload.meta;
            state.listOfArticle.data.push(...action.payload.data);
        },
        setListOfPopularArticle: (state, action: PayloadAction<Array<any>>) => {
            state.listOfPopularArticle = action.payload;
        },
        setListOfRelatedWord: (state, action: PayloadAction<Array<string>>) => {
            state.listOfRelatedWord = action.payload;
        },
        setModalOfArticleIsOpen: (state, action: PayloadAction<Array<boolean>>) => {
            state.modalOfArticleIsOpen = action.payload;
        },
        setModalOfPopularArticleIsOpen: (state, action: PayloadAction<Array<boolean>>) => {
            state.modalOfPopularArticleIsOpen = action.payload;
        },
        clearArticleState: (): ArticleAttributes => initialState,
    },
});

const { actions, reducer } = articleSlice;
export const { setKeyword, setPage, incrementPage, decrementPage, setOrder, setOrderIsActive, setOrderForDetectOfFetchEffect, setListOfArticle, addListOfArticle, setListOfPopularArticle, setListOfRelatedWord, setModalOfArticleIsOpen, setModalOfPopularArticleIsOpen, clearArticleState } = actions;
export default reducer;