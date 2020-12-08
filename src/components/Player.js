import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

const Player = ({audioRef, currentSong, isPlaying, setIsPlaying, songInfo, setSongInfo, songs, setSongs, setCurrentSong}) => {
    //  // useEffect(() => {
    //  //   const newSongs = songs.map((song) => {
    //  //       if(song.id === currentSong.id) {
    //  //           return {...song, active: true}
    //  //       } else {
    //  //           return {...song, active: false}
    //  //        }
    //  //   });
    //  //   setSongs(newSongs);
    //  // },[currentSong]);
    // // it will run everytime our currentSong gets updated

    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((song) => {
            if(song.id === nextPrev.id) {
                return {...song, active: true}
            } else {
                return {...song, active: false}
            }
        });
        setSongs(newSongs);
    };

    const playSongHandler = () => {
        if(isPlaying) {
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const getTime = (time) => {
        return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
    };

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo, currentTime: e.target.value});
    };

    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        if(direction === 'skip-forward') {
           await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
            // the current index keeps growing but when it matches songs.length, it goes back to 0
            activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
        }
        // if(direction === 'skip-back'){
        //     if((currentIndex - 1) % songs.length === -1){
        //         // if index = -1 then setCurrentSong to the last one
        //         setCurrentSong(songs[songs.length -1]);
        //         return;
        //         // we're adding "return" here because if we don't, the next line is gonna run and crash the app
        //         // but it's the same thing as an if else statement (see below)
        //     }
        //     setCurrentSong(songs[(currentIndex - 1 % songs.length)]);
        //     // this only applies to songs in the middle of the list, not first, nor last position
        // }
        if(direction === 'skip-back'){
            if((currentIndex - 1) % songs.length === -1){
                await setCurrentSong(songs[songs.length -1]);
                activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
                if (isPlaying) audioRef.current.play();
            } else {
                await setCurrentSong(songs[(currentIndex - 1 % songs.length)]);
                activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
            }
        }
        if (isPlaying) audioRef.current.play();
    };
  
    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`
    };

    return (
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div className="track" style={{background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`}}>
                    <input
                        min={0}
                        max={songInfo.duration || 0}
                        value={songInfo.currentTime}
                        onChange={dragHandler}
                        type="range"
                    />
                    <div className="animate-track" style={trackAnim}></div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon 
                    className="skip-back"
                    onClick={() => skipTrackHandler('skip-back')}
                    icon={faAngleLeft}
                    size="2x" 
                />
                <FontAwesomeIcon
                    className="play"
                    onClick={playSongHandler}
                    icon={isPlaying ? faPause : faPlay}
                    size="2x" 
                />
                <FontAwesomeIcon
                    className="skip-forward"
                    onClick={() => skipTrackHandler('skip-forward')}
                    icon={faAngleRight} 
                    size="2x"
                />
            </div>
        </div>
    );
};

export default Player;