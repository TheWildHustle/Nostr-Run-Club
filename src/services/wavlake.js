const WAVLAKE_API_BASE_URL = 'https://wavlake.com/api';

export const fetchFeaturedPlaylist = async () => {
  // Using a curated running playlist as featured
  const FEATURED_PLAYLIST_ID = '8f4cd4a2-1be6-45f7-8d9b-fcf1fc2e4b9f';
  return fetchPlaylistById(FEATURED_PLAYLIST_ID);
};

export const fetchPlaylistById = async (playlistId) => {
  const response = await fetch(
    `${WAVLAKE_API_BASE_URL}/v1/content/playlist/${playlistId}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.statusText}`);
  }
  const data = await response.json();
  return { id: playlistId, ...data };
};

export const fetchTrendingByGenre = async (genre) => {
  const response = await fetch(
    `${WAVLAKE_API_BASE_URL}/v1/content/rankings?sort=sats&days=7&genre=${genre}&limit=40`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch ${genre} playlist: ${response.statusText}`);
  }
  return response.json();
};

export const fetchTop40 = async () => {
  const response = await fetch(
    `${WAVLAKE_API_BASE_URL}/v1/content/rankings?sort=sats&days=7&limit=40`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch Top 40: ${response.statusText}`);
  }
  const tracks = await response.json();
  return {
    id: 'top-40',
    title: 'Top 40',
    tracks,
  };
};

export const fetchTrendingRock = async () => {
  const tracks = await fetchTrendingByGenre('rock');
  return {
    id: 'trending-rock',
    title: 'Rock',
    tracks,
  };
};

export const fetchTrendingHipHop = async () => {
  const tracks = await fetchTrendingByGenre('hip-hop');
  return {
    id: 'trending-hiphop',
    title: 'Hip-Hop',
    tracks,
  };
};

export const fetchTrackLnurl = async (trackId) => {
  const response = await fetch(
    `${WAVLAKE_API_BASE_URL}/v1/lnurl?contentId=${trackId}&appId=nostrrunclub`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch track LNURL: ${response.statusText}`);
  }
  const data = await response.json();
  return data.lnurl;
}; 