import MealDBApi from '../../api/theMealDB';

describe('MealDBApi', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('getCountries should return a list of countries', async () => {
    const mockResponse = {
      meals: [{ strArea: 'Italian' }, { strArea: 'Mexican' }],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await MealDBApi.getMealsCountries();
    expect(fetch).toHaveBeenCalledWith('www.themealdb.com/api/json/v1/1/list.php?a=list');
    expect(result).toEqual(mockResponse);
  });

  test('getCountries should throw an error if fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false } as Response);

    await expect(MealDBApi.getMealsCountries()).rejects.toThrow('Failed to fetch countries');
  });
});
