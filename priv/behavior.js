function start() {
  $.getJSON('api', function(data) {
    skewer.log(data['color']);
  });
};

$(document).ready(start);
