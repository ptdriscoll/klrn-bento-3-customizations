(function(exports) {

  //applies filters to YouTube videos being loaded, based on playlist ID
  exports.youtubePlaylistFilters = function(textString, playlistId) {    
    var newString;
    
    //Ready Set Grow testimonials
    if (playlistId === 'PLO5rIpyd-O4G4C6Qw66Ft1YfK7MQZBYuP') {
      newString = textString.replace('Ready Set Grow Testimonial | ', '');
      return newString;
    }     
    
    //Play & Learn testimonials
    if (playlistId === 'PLO5rIpyd-O4HxXSkCYvw-lN8Yo314u5Pu') {
      newString = textString.replace('Play & Learn Testimonial | ', '');
      return newString;
    }     
    
    //On the Record
    if (playlistId === 'PLO5rIpyd-O4ERCTOKJmeKBRz-gYTYJYpH') {
      newString = textString.replace(/On [tT]he Record\s+\|\s+The Conversation Continues\s+\|\s+/, '');
      return newString;
    }      
    
    //News Updates
    if (playlistId === 'PLO5rIpyd-O4EA5mYUxl1WbOaOl1kU08RB') {
      newString = textString.replace(/,\s20[12][0-9]/, '');
      return newString;
    }   

    //TAMIU Student Reporting Lab
    if (playlistId === 'PLO5rIpyd-O4HysEnkRay0jUiQcL5eqvR3') {
      newString = textString.replace(/TAMIU Student Reporting Lab\s+\|\s+/, '');
      return newString;
    }     
    
    //Healthy Kids English
    if (playlistId === 'PLO5rIpyd-O4FdYCi4DtZmkeIbp5Yn7Jp_') {
      newString = textString.replace('Healthy Kids Project | ', '');
      return newString;
    }
    
    //Healthy Kids Espanol
    if (playlistId === 'PLO5rIpyd-O4GCnwfyIkdoLGs86KDqTcT_') {
      newString = textString.replace('El Proyecto Niños Sanos | ', '');
      return newString;
    }   

    return textString;    
  }
}(klrn));