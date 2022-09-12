import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import doAxiosRequest from "../../../functions/doAxiosRequest";

interface UserAttributes {
    id: string;
    password: string;
    passwordCheck: string;
    email: string;
}

const initialState: UserAttributes = {
    id: '',
    password: '',
    passwordCheck: '',
    email: '',
};

export const signup = createAsyncThunk("userSlice/signup", async (paramsOfInsert: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('POST', '/accounts/signup', paramsOfInsert);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const signin = createAsyncThunk("userSlice/signin", async (paramsOfSearch: any, thunkAPI) => {
    try {
        const response: any = await doAxiosRequest('POST', '/accounts/signin', paramsOfSearch);
        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setId: (state, action: PayloadAction<string>): void => {
            state.id = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>): void => {
            state.password = action.payload;
        },
        setPasswordCheck: (state, action: PayloadAction<string>): void => {
            state.passwordCheck = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>): void => {
            state.email = action.payload;
        },
        clearState: (): UserAttributes => initialState,
    },
});

const { actions, reducer } = userSlice;
export const { setId, setPassword, setPasswordCheck, setEmail, clearState, } = actions;
export default reducer;