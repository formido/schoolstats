function start() {
  $.getJSON('api', function(data) {
    _.each(data['grades'], function(itm) {
      $('body table').append('<tr><td>' + itm['name'] + '</td><td>' + itm['grade'] + '</td></tr>');
    });
    $('#date').html(new Date(data["date"] * 1000));
  });
};

$(document).ready(start);
