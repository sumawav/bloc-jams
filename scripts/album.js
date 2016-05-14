var createSongRow = function(songNumber, songName, songLength) {
  var template =
  '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {
    var clickedSong = parseInt( $(this).attr("data-song-number") );

    if (clickedSong === currentlyPlayingSongNumber) {
      // pausing a currently playing song
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      // currentlyPlayingSongNumber = null;
      // currentSongFromAlbum = null;
      setSong(null);
    } else if (clickedSong !== currentlyPlayingSongNumber) {
      // playing a new song
      $(this).html(pauseButtonTemplate);
      // removing icon from previously playing song
      var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
      $songNumberCell.html(currentlyPlayingSongNumber);

      setSong(clickedSong);
      updatePlayerBarSong();
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

var nextSong = function() {
  var len = currentAlbum.songs.length;
  var index = trackIndex(currentAlbum, currentSongFromAlbum);
  var previousSongNumber = index + 1;

  // increment song index and loop around if need be
  index = ++index % len;
  setSong(index + 1);
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
  var artist = currentSongFromAlbum.artist;
  var title = currentSongFromAlbum.title;
  $(".currently-playing .song-name").text(title);
  $(".currently-playing .artist-song-mobile").text(artist + " - " + title);
  $(".currently-playing .artist-name").text(artist);
  $(".main-controls .play-pause").html(playerBarPauseButton);
}; // updatePLayerBarSong

var setSong = function(songNumber) {
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}; //songNumber

var getSongNumberCell = function(number) {
  var $cell = $('.song-item-number[data-song-number="' + number + '"]');
  return $cell;
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
