function start() {
  $.getJSON('api', function(data) {
    _.each(data, function(itm) {
      $('body table').append('<tr><td>' + itm['name'] + '</td><td>' + itm['grade'] + '</td></tr>');
    });
  });
};

$(document).ready(start);
