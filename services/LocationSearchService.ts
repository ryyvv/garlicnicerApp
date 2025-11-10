export interface SearchResult {
  city: string;
  province: string;
  region: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export class LocationSearchService {
  private static readonly API_URL = 'https://api.geonames.org/searchJSON';
  private static readonly USERNAME = 'demo'; // Replace with actual username

  static async searchByFields(query: string, fields: string[]): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.API_URL}?q=${encodeURIComponent(query)}&country=PH&maxRows=10&username=${this.USERNAME}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      return data.geonames?.map((item: any) => ({
        city: item.name,
        province: item.adminName1 || '',
        region: item.adminName2 || '',
        coords: {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lng)
        }
      })) || [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }
}