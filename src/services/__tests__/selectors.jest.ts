import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import slice, {
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
} from '../slices';

import { mockStore } from '../mockData';

let store = configureStore({
  reducer: {
    stellarBurger: slice
  },
  preloadedState: {
    stellarBurger: mockStore
  }
});

describe('Test selectors', () => {
  test('Test selectLoading', () => {
    const loading = selectLoading(store.getState());
    expect(loading).toBe(false);
  });

  test('Test selectIngredients', () => {
    const ingredients = selectIngredients(store.getState());
    expect(ingredients).toEqual(mockStore.ingredients);
  });

  test('Test selectIsModalOpened', () => {
    const isModalOpened = selectIsModalOpened(store.getState());
    expect(isModalOpened).toBe(false);
  });

  test('Test selectConstructorItems', () => {
    const constructorItems = selectConstructorItems(store.getState());
    expect(constructorItems).toEqual(mockStore.constructorItems);
  });

  test('Test selectOrders', () => {
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(mockStore.orders);
  });

  test('Test selectTotalOrders', () => {
    const totalOrders = selectTotalOrders(store.getState());
    expect(totalOrders).toEqual(mockStore.totalOrders);
  });

  test('Test selectTodayOrders', () => {
    const ordersToday = selectTodayOrders(store.getState());
    expect(ordersToday).toEqual(mockStore.ordersToday);
  });

  test('Test selectIsAuthenticated', () => {
    const isAuthenticated = selectIsAuthenticated(store.getState());
    expect(isAuthenticated).toBe(true);
  });

  test('Test selectUser', () => {
    const user = selectUser(store.getState());
    expect(user).toEqual({
      name: 'slava',
      email: 'slava@demo.com'
    });
  });

  test('Test selectIsInit', () => {
    const isInit = selectIsInit(store.getState());
    expect(isInit).toBe(false);
  });

  test('Test selectOrderRequest', () => {
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toBe(false);
  });

  test('Test selectOrderModalData', () => {
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(mockStore.orderModalData);
  });

  test('Test selectUserOrders', () => {
    const userOrders = selectUserOrders(store.getState());
    expect(userOrders).toEqual(mockStore.userOrders);
  });

  test('Test selectErrorText', () => {
    const errorText = selectErrorText(store.getState());
    expect(errorText).toEqual(mockStore.errorText);
  });
});
