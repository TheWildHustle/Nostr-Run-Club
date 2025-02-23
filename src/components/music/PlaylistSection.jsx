import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export function PlaylistSection({ title, playlists }) {
  const navigate = useNavigate();

  if (!playlists || playlists.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex flex-col items-center cursor-pointer min-w-[100px]"
            onClick={() => navigate(`/music/playlist/${playlist.id}`)}
          >
            <div className="relative w-[100px] h-[100px] mb-2">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 bg-gray-800 rounded-lg overflow-hidden">
                {playlist.tracks.slice(0, 4).map((track) => (
                  <div key={track.id} className="relative w-full h-full">
                    <img
                      src={track.artworkUrl || track.albumArtUrl}
                      alt={track.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            <span className="text-sm font-medium text-white text-center">{title}</span>
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