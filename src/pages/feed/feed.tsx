import { FC, useEffect } from 'react';
import { fetchFeed, fetchIngredients, selectOrders } from '@slices';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { FeedUI } from '../../components/ui/pages/feed';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchFeed())]);
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
