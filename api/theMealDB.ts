interface CountriesResponse {
  meals: Country[];
}

interface MealsResponse {
  meals: Meal[];
}

interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

interface Country {
  strArea: string;
}

type Filters = 'area';

class MealDBApi {
  private static baseURL = 'www.themealdb.com/api/json/v1/1';
  private static filters = {
    area: 'a',
  };

  private static filterBy(filter: Filters, value: string) {
    return `filter.php?${this.filters[filter]}=${value}`;
  }

  public static async getCountries(): Promise<CountriesResponse> {
    const url = `${this.baseURL}/list.php?a=list`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await res.json();
    return data as CountriesResponse;
  }

  public static async getMealsByCountry(
    country: string,
  ): Promise<MealsResponse> {
    const url = `${this.baseURL}/${this.filterBy('area', country)}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch meals');
    }

    const data = await res.json();
    return data;
  }
}

export default MealDBApi;
