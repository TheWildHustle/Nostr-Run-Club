import axios from 'axios';

const BASE_URL = import.meta.env.VITE_WAVLAKE_DOT_COM_API_BASE_URL || 'https://wavlake.com/api';
const CATALOG_API_URL = import.meta.env.VITE_WAVLAKE_CATALOG_API_BASE_URL || 'https://catalog.wavlake.com';

export const PLAYLIST = "playlist";
export const TRENDING_ROCK_PLAYLIST_ID = "trending-rock";
export const TRENDING_HIPHOP_PLAYLIST_ID = "trending-hiphop";
export const TOP_40 = "top-40";
export const LIKED = "liked";

class WavlakeApi {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  async getPlaylist(playlistId) {
    switch (playlistId) {
      case TOP_40:
        return this.getTop40Playlist();
      case TRENDING_ROCK_PLAYLIST_ID:
        return this.getTrendingRock();
      case TRENDING_HIPHOP_PLAYLIST_ID:
        return this.getTrendingHipHop();
      default:
        return this.getPlaylistById(playlistId);
    }
  }

  async getPlaylistById(playlistId) {
    try {
      const response = await fetch(`${BASE_URL}/v1/content/playlist/${playlistId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }
      const data = await response.json();
      return { id: playlistId, ...data };
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  }

  async getTrendingPlaylistByGenre(genre) {
    try {
      const response = await fetch(
        `${BASE_URL}/v1/content/rankings?sort=sats&days=7&genre=${genre}&limit=40`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ${genre} playlist: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${genre} playlist:`, error);
      throw error;
    }
  }

  async getTrendingRock() {
    const playlist = await this.getTrendingPlaylistByGenre('rock');
    return {
      id: TRENDING_ROCK_PLAYLIST_ID,
      title: 'Rock',
      tracks: playlist
    };
  }

  async getTrendingHipHop() {
    const playlist = await this.getTrendingPlaylistByGenre('hip-hop');
    return {
      id: TRENDING_HIPHOP_PLAYLIST_ID,
      title: 'Hip-Hop',
      tracks: playlist
    };
  }

  async getTop40Playlist() {
    try {
      const response = await fetch(
        `${BASE_URL}/v1/content/rankings?sort=sats&days=7&limit=40`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Top 40: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        id: TOP_40,
        title: 'Top 40',
        tracks: data
      };
    } catch (error) {
      console.error('Error fetching Top 40:', error);
      throw error;
    }
  }

  async getLibraryPlaylists(pubkey) {
    if (!pubkey) return [];
    try {
      const response = await fetch(`${CATALOG_API_URL}/v1/playlists/user/${pubkey}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching library playlists:', error);
      return [];
    }
  }

  async getLikedPlaylist(token) {
    if (!token) return null;
    try {
      const response = await axios.get(`${CATALOG_API_URL}/library/tracks`, {
        headers: {
          Authorization: token
        }
      });
      const tracks = response.data.data.tracks;
      return {
        id: LIKED,
        title: 'Liked',
        tracks: tracks.map(this._formatTrack),
        isPrivate: true
      };
    } catch (error) {
      console.error('Error fetching liked tracks:', error);
      return null;
    }
  }

  async getStreamUrl(trackId) {
    try {
      const response = await fetch(`${BASE_URL}/v1/content/track/${trackId}/stream`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stream URL: ${response.statusText}`);
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      throw error;
    }
  }

  async getTrackBackgroundImage(trackId) {
    try {
      const response = await fetch(`${CATALOG_API_URL}/v1/tracks/${trackId}`);
      const data = await response.json();
      return data.data.avatarUrl;
    } catch (error) {
      console.error('Error fetching track background image:', error);
      return null;
    }
  }

  async getTrackLnurl(trackId) {
    try {
      const response = await fetch(
        `${BASE_URL}/v1/lnurl?contentId=${trackId}&appId=nostrapp`
      );
      const data = await response.json();
      return data.lnurl;
    } catch (error) {
      console.error('Error fetching track LNURL:', error);
      return null;
    }
  }

  _formatTrack(track) {
    if (!track) return null;
    return {
      id: track.id,
      title: track.title,
      artist: track.artist_name || track.artist,
      artworkUrl: track.artwork_url || track.artwork,
      albumArtUrl: track.artwork_url || track.artwork,
      duration: track.duration
    };
  }
}

export const wavlakeApi = new WavlakeApi(); 
