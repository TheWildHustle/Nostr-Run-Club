import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export function PlaylistSection({ title, playlists }) {
  const navigate = useNavigate();

  if (!playlists || playlists.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate(`/music/playlist/${playlist.id}`)}
          >
            <div className="aspect-square relative">
              <div className="grid grid-cols-2 h-full">
                {playlist.tracks.slice(0, 4).map((track) => (
                  <img
                    key={track.id}
                    src={track.artworkUrl || track.albumArtUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{playlist.title}</h3>
              <p className="text-gray-600">{playlist.tracks.length} tracks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PlaylistSection.propTypes = {
  title: PropTypes.string.isRequired,
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tracks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          artworkUrl: PropTypes.string,
          albumArtUrl: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
}; 