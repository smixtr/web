var timer = 2500;
var errTimer = 15000;

var getKeyo = function() {
  var ls = localStorage.getItem('keyo');
  var ss = sessionStorage.getItem('keyo');
  return ls || ss;
};

var modem = function(type, url, sucess, error, data) {
  $.ajax({
    async: true,
    cache: false,
    type: type || 'GET',
    url: url,
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + getKeyo());
    },
    data: data,
    success: sucess,
    error: error
  });
};

var templateLoader = {
  load: function(views, callback) {
    async.mapSeries(views, function(view, callbacki) {
      if (window[view] === undefined) {
        $.getScript('js/views/' + view.replace('View', '').toLowerCase() + '.js', function() {
          if (window[view].prototype.template === undefined) {
            $.get('templates/' + view + '.html', function(data) {
              window[view].prototype.template = _.template(data);
              callbacki();
            }, 'html');
          } else {
            callbacki();
          }
        });
      } else {
        callbacki();
      }
    }, function(error, data) {
      callback();
    });
  }
};
