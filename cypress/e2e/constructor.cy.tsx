const API_URL = Cypress.env('BURGER_API_URL');

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  // ingredients
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/ingredients`
      },
      ingredients
    ).as('getIngredients');
  });

  // feed
  cy.fixture('orders.json').then((orders) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/orders/all`
      },
      orders
    ).as('getOrders');
  });

  // auth
  cy.fixture('user.json').then((user) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/auth/user`
      },
      user
    ).as('getUser');
  });

  cy.visit('/');
  cy.wait('@getIngredients', { timeout: 10000 });
});

afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe('Проверка работоспособности приложения', () => {
  const noBunSelector1 = `[data-cy=no_buns_top]`;
  const noBunSelector2 = `[data-cy=no_buns_bottom]`;
  const noIngredientsSelector = `[data-cy=no_ingredients_text]`;
  const bunSelector = `[data-cy=bun]`;
  const ingredientSelector = `[data-cy=ingredient]`;

  it('сервис должен быть доступен по адресу localhost:4000', () => {});

  it('есть возможность добавлять булку и ингридиенты', () => {
    cy.get(noBunSelector1).as('noBunTopText');
    cy.get(noBunSelector2).as('noBunBottomText');
    cy.get(noIngredientsSelector).as('noIngredientsText');
    cy.get(bunSelector + ` button`).as('bun');
    cy.get(ingredientSelector + ` button`).as('ingredient');

    // Проверяем пустоту перед добавлением
    cy.get('@noBunTopText').contains('Выберите булки');
    cy.get('@noBunBottomText').contains('Выберите булки');
    cy.get('@noIngredientsText').contains('Выберите начинку');

    cy.get('@bun').eq(1).click();
    cy.get('@ingredient').eq(3).click();

    cy.get(`[data-cy=constructor_section]`).contains('булка');
    cy.get(`[data-cy=ingredient_element]`).should('have.length.greaterThan', 0);
  });

  it('проверка открытия и закрытия модального окна ингридиента', () => {
    const ingredient = cy.get(bunSelector).eq(0);
    ingredient.click();
    cy.get(`[data-cy=ingredient_modal]`, { timeout: 10000 }).should(
      'be.visible'
    );
    cy.get(`[data-cy=close_modal_btn]`).click();
    cy.get(`[data-cy=ingredient_modal]`).should('not.exist');
  });

  it('проверка нового заказа', () => {
    const bun = cy.get(bunSelector + ` button`);
    const ingredient = cy.get(ingredientSelector + ` button`);
    bun.eq(1).click();
    //ingredient.click({ multiple: true });
    ingredient.eq(5).click();

    cy.get(`[data-cy=new_order_total] button`).click();

    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept(
        {
          method: 'POST',
          url: `${API_URL}/orders`
        },
        newOrder
      ).as('newOrder');

      cy.get(`[data-cy=new_order_number]`).contains(newOrder.order.number);
      cy.get(`[data-cy=close_modal_btn]`).click();

      // Проверяем пустоту после закрытия модалки
      cy.get(noBunSelector1).as('noBunTopText');
      cy.get(noBunSelector2).as('noBunBottomText');
      cy.get(noIngredientsSelector).as('noIngredientsText');

      cy.get('@noBunTopText').contains('Выберите булки');
      cy.get('@noBunBottomText').contains('Выберите булки');
      cy.get('@noIngredientsText').contains('Выберите начинку');
    });
  });
});
