import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../src/utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TIngredient,
  TOrder,
  TUser,
  TConstructorItems,
  TConstructorIngredient
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialState = {
  ingredients: TIngredient[];
  loading: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  user: TUser;
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  userOrders: TOrder[] | null;
  isAuthenticated: boolean;
  isInit: boolean;
  isModalOpened: boolean;
  errorText: string;
};

export const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  orderModalData: null,
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  orderRequest: false,
  user: {
    name: '',
    email: ''
  },
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  isAuthenticated: false,
  isInit: false,
  isModalOpened: false,
  errorText: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);

export const fetchLoginUser = createAsyncThunk('user/login', loginUserApi);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);

export const fetchFeed = createAsyncThunk('user/feed', getFeedsApi);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

export const fetchUpdateUser = createAsyncThunk('user/update', updateUserApi);

export const fetchLogout = createAsyncThunk('user/logout', logoutApi);

export const fetchUserOrders = createAsyncThunk('user/orders', getOrdersApi);

const slice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
      }
    },
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    },
    init(state) {
      state.isInit = true;
    },
    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    },
    deleteIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    },
    removeUserOrders(state) {
      state.userOrders = null;
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  },
  selectors: {
    selectLoading: (state) => state.loading,
    selectIngredients: (state) => state.ingredients,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectUser: (state) => state.user,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectUserOrders: (state) => state.userOrders,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      });
  }
});

export const {
  selectLoading,
  selectIngredients,
  selectIsModalOpened,
  selectConstructorItems,
  selectOrders,
  selectTotalOrders,
  selectTodayOrders,
  selectIsAuthenticated,
  selectIsInit,
  selectUser,
  selectOrderRequest,
  selectOrderModalData,
  selectUserOrders,
  selectErrorText
} = slice.selectors;

export const {
  addIngredient,
  openModal,
  closeModal,
  init,
  moveIngredientUp,
  moveIngredientDown,
  deleteIngredient,
  closeOrderRequest,
  removeUserOrders,
  setErrorText,
  removeErrorText
} = slice.actions;

export default slice.reducer;
