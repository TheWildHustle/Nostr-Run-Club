import PropTypes from 'prop-types';

export function PlaylistGrid({ playlist }) {
  const { tracks = [], title, trackCount } = playlist;

  return (
    <div className="flex items-center text-white border border-pink-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap w-[100px] h-[100px] min-w-[100px]">
        {tracks.slice(0, 4).map((track) => (
          <img
            key={track.id}
            src={track.artworkUrl || track.albumArtUrl}
            alt={`${track.title} art`}
            className="w-1/2 h-1/2"
          />
        ))}
      </div>
      <div className="flex flex-col p-4">
        <p className="font-bold mb-1">{title}</p>
        <p className="text-sm text-gray-300">{trackCount} tracks</p>
      </div>
    </div>
  );
}

PlaylistGrid.propTypes = {
  playlist: PropTypes.shape({
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
  }).isRequired,
}; 