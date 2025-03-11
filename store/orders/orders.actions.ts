import { createAction } from '@reduxjs/toolkit';



export const setSelectedMonster = createAction<Monster | null>(
	'orders/setSelectedMonster',
  );
