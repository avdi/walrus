$(function(){
  var source = new EventSource('/updates');
  source.addEventListener('message', function(e) {
    console.log(e.data);
  });
});
