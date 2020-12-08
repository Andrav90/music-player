import React from 'react';

const LibrarySong = ({songs, setSongs, song, setCurrentSong, id, audioRef, isPlaying}) => {
    const songSelectHandler = async () => {
        // const selectedSong = songs.filter((state) => state.id === id);
        // setCurrentSong(selectedSong[0]);
        await setCurrentSong(song);
        // audioRef.current.play();
        const newSongs = songs.map((song) => {
            if(song.id === id) {
                return {...song, active: true}
            } else {
                return {...song, active: false}
            }
        });

        setSongs(newSongs);
        if (isPlaying) audioRef.current.play();
    }

    return (
        <div className={`library-song ${song.active ? 'selected' : ''}`} onClick={songSelectHandler}>
            <img src={song.cover} alt="video-thumbnail" />
            <div className="song-description">
                <h3>{song.name}</h3>
                <h4>{song.artist}</h4>
            </div>
        </div>
    );
};

export default LibrarySong;