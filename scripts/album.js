var createSongRow = function(songNumber, songName, songLength) {
  var template =
  '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {

    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

      currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();

      $('.volume .fill').width(currentVolume + '%');
      $('.volume .thumb').css({left: currentVolume + '%'});

      $(this).html(pauseButtonTemplate);
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
      if ( currentSoundFile.isPaused() ) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }

  };

  var onHover = function() {
    var songItemNumber = $(this).find('.song-item-number');
    var songNumber = parseInt( songItemNumber.attr("data-song-number") );
    if (songNumber !== currentlyPlayingSongNumber){
      songItemNumber.html(playButtonTemplate);
    }
  };

  var offHover = function() {
    var songItemNumber = $(this).find('.song-item-number');
    var songNumber = parseInt( songItemNumber.attr("data-song-number") );
    if (songNumber !== currentlyPlayingSongNumber){
      songItemNumber.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; ++i) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
}; //setCurrentAlbum

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event){
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar( filterTimeCode(this.getTime()) );
    });
  }
}; // updateSeekBarWHileSongPlays

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
}; //updateSeekPercentage

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    updateSeekPercentage($(this), seekBarFillRatio);

    var parentClass = $(this).parent().attr("class");
    if (parentClass === "seek-control") {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else if (parentClass === "control-group volume") {
      setVolume(seekBarFillRatio * 100);
    }
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
      updateSeekPercentage($seekBar, seekBarFillRatio);

      var parentClass = $(this).parent().attr("class");
      if (parentClass === "seek-control") {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else if (parentClass === "control-group volume") {
        setVolume(seekBarFillRatio * 100);
      }
    });

    $(document).bind('mouseup.thimb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });

}; // setupSeekBars

var nextSong = function() {
  var len = currentAlbum.songs.length;
  var index = trackIndex(currentAlbum, currentSongFromAlbum);
  var previousSongNumber = index + 1;

  // increment song index and loop around if need be
  index = ++index % len;
  setSong(index + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var $previousSongNumberCell = getSongNumberCell(previousSongNumber);
  $previousSongNumberCell.html(previousSongNumber);
  var $currentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  $currentSongNumberCell.html(pauseButtonTemplate);
}; //nextSong

var previousSong = function() {
  var len = currentAlbum.songs.length;
  var index = trackIndex(currentAlbum, currentSongFromAlbum);
  var previousSongNumber = index + 1;

  // decrement song index and loop around if need be
  --index;
  if (index < 0) {
    index = len - 1;
  }
  setSong(index + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var $previousSongNumberCell = getSongNumberCell(previousSongNumber);
  $previousSongNumberCell.html(previousSongNumber);
  var $currentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  $currentSongNumberCell.html(pauseButtonTemplate);
}; //previousSong

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}

var updatePlayerBarSong = function() {
  var artist = currentAlbum.artist;
  var title = currentSongFromAlbum.title;

  $(".currently-playing .song-name").text(title);
  $(".currently-playing .artist-song-mobile").text(artist + " - " + title);
  $(".currently-playing .artist-name").text(artist);
  $(".main-controls .play-pause").html(playerBarPauseButton);
  setTotalTimeInPlayerBar( filterTimeCode(currentSongFromAlbum.duration) );
}; // updatePLayerBarSong

var setSong = function(songNumber) {
  if(currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3'],
    preload: true
  });
  setVolume(currentVolume);
}; //songNumber

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
  var $cell = $('.song-item-number[data-song-number="' + number + '"]');
  return $cell;
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  $(".current-time").text(currentTime);
}; //setCurrentTimeInPlayerBar

var setTotalTimeInPlayerBar = function(totalTime) {
  $(".total-time").text(totalTime);
}; //setTotalTimeInPlayerBar

var filterTimeCode = function(timeInSeconds) {
  var totalSeconds = Math.floor(parseFloat(timeInSeconds, 10));
  var minutes = Math.floor(totalSeconds / 60);
  var leftoverSeconds = Math.floor(totalSeconds % 60);
  if (leftoverSeconds < 10) {
    leftoverSeconds = "0" + leftoverSeconds;
  }
  return minutes + ":" + leftoverSeconds;
}; //filerTimeCode

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
