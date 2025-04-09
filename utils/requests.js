const BASE_URL = 'https://freenime-api.vercel.app/api/v2/hianime';
const PROXY_URL = 'https://anime-proxy-theta.vercel.app/proxy-video'; //proxy server URL

export async function getHomePage() {
  const resp = await fetch(`${BASE_URL}/home`);

  const data = await resp.json();

  return data;
}

// /api/v2/hianime/anime/animeID
export async function getAnimeDetails(animeID) {
  const resp = await fetch(`${BASE_URL}/anime/${animeID}`);

  const data = await resp.json();

  return data;
}

// /api/v2/hianime/anime/{animeId}/episodes
export async function getEpisodes(animeID) {
  const resp = await fetch(`${BASE_URL}/anime/${animeID}/episodes`);

  const data = await resp.json();

  return data;
}

// /api/v2/hianime/episode/servers?animeEpisodeId={id}
export async function getServers(episodeID) {
  const resp = await fetch(`${BASE_URL}/episode/servers?animeEpisodeId=${episodeID}`);

  const data = await resp.json();

  return data;
}

// /api/v2/hianime/episode/sources?animeEpisodeId={id}
// export async function getLinks(episodeID) {
//   const targetUrl = `${BASE_URL}/episode/sources?animeEpisodeId=${episodeID}`;

//   console.log("Fetching episode data from:", targetUrl);

//   try {
//     // Fetch episode data (no proxy needed here)
//     const resp = await fetch(targetUrl);
//     if (!resp.ok) {
//       throw new Error(`HTTP error! Status: ${resp.status}`);
//     }

//     const data = await resp.json();
//     console.log("Episode data fetched successfully:", data);

//     // Proxy the video URL
//     if (data.data?.sources?.[0]?.url) {
//       const videoUrl = data.data.sources[0].url;
//       const proxiedVideoUrl = `${PROXY_URL}?url=${videoUrl}`;
//       console.log("Proxied video URL:", proxiedVideoUrl);
//       data.data.sources[0].url = proxiedVideoUrl; // Replace the original URL with the proxied URL
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching episode links:", error.message);
//     throw new Error(`Failed to fetch episode links: ${error.message}`);
//   }
// }

export async function getLinks(episodeID) {
  const resp = await fetch(`${BASE_URL}/episode/sources?animeEpisodeId=${episodeID}&server=hd-2`);

  const data = await resp.json();

  return data;
}

// basic example
// api/v2/hianime/search?q={query}&page={page}

//advanced example

// /api/v2/hianime/search?q={query}&page={page}&genres={genres}&type={type}&sort={sort}&season={season}&language={sub_or_dub}&status={status}&rated={rating}&start_date={yyyy-mm-dd}&end_date={yyyy-mm-dd}&score={score}
export async function getResults(query, page) {
  const resp = await fetch(`${BASE_URL}/search?q=${query}&page=${page}`);

  const data = await resp.json();

  return data;
}

// MY API
export async function getMainPage() {
  const response = await fetch(`https://mc2-api.vercel.app/api/main`);

  const data = await response.json();

  return data;
}

export async function getAnimeInfo(animeURL) {
  const response = await fetch(`https://mc2-api.vercel.app/api/anime?url=${animeURL}`);

  const data = await response.json();

  return data;
}

export async function getEpisodeURL(episodeURL) {
  const response = await fetch(`https://mc2-api.vercel.app/api/watch?url=${episodeURL}`);

  const data = await response.json();

  return data;
}
