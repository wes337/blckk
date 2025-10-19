import axios from "axios";

const SPOTIFY_ARTIST_ID = "4Zs1wgcjD3aYvaN1lFRMRt";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

async function getAlbums(token) {
  const albums = [];

  let url = `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums`;

  let params = {
    include_groups: "album,single,compilation",
    limit: 50,
  };

  while (url) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    albums.push(...response.data.items);

    url = response.data.next;
    params = null;
  }

  return albums;
}

async function getAlbumTracks(token, albumId) {
  const tracks = [];

  let url = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
  let params = { limit: 50 };

  while (url) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    tracks.push(...response.data.items);

    url = response.data.next;
    params = null;
  }

  return tracks;
}

async function fetchData() {
  try {
    const token = await getAccessToken();

    const albums = await getAlbums(token, SPOTIFY_ARTIST_ID);
    const albumsWithTracks = [];

    for (const album of albums) {
      const tracks = await getAlbumTracks(token, album.id);

      albumsWithTracks.push({
        id: album.id,
        name: album.name,
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
        type: album.album_type,
        images: album.images,
        tracks: tracks.map((t) => ({
          id: t.id,
          name: t.name,
          trackNumber: t.track_number,
          durationMS: t.duration_ms,
        })),
      });
    }

    return albumsWithTracks;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

export default fetchData;
