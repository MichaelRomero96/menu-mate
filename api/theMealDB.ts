interface CountriesResponse {
  meals: MealsCountry[];
}

interface MealsResponse {
  meals: Meal[];
}

export interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface MealsCountry {
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

  public static async getMealsCountries(): Promise<MealsCountry[]> {
    const url = `${this.baseURL}/list.php?a=list`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await res.json() as CountriesResponse;
    return data.meals;
  }

  public static async getMealsByCountry(
    country: string,
  ): Promise<Meal[]> {
    const url = `${this.baseURL}/${this.filterBy('area', country)}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch meals');
    }

    const data = await res.json() as MealsResponse;
    return data.meals;
  }
}

export default MealDBApi;
