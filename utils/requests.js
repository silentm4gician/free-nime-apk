const BASE_URL = 'https://mc2-api.vercel.app/api';

export async function getMainPage() {
  const response = await fetch(`${BASE_URL}/main`);

  const data = await response.json();

  return data;
}

export async function getAnimeInfo(animeURL) {
  const response = await fetch(`${BASE_URL}/anime?url=${animeURL}`);

  const data = await response.json();

  return data;
}

export async function getEpisodeURL(episodeURL) {
  const response = await fetch(`${BASE_URL}/watch?url=${episodeURL}`);

  const data = await response.json();

  return data;
}

export async function getResults(query) {
  const response = await fetch(`${BASE_URL}/search?q=${query}`);

  const data = await response.json();

  return data;
}
