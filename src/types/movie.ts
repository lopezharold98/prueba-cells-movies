export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres?: Genre[];
}

export interface TMDBListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
