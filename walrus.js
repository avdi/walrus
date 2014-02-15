$(function(){
  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  var source = new EventSource('/updates');
  source.addEventListener('message', function(e) {
    console.log(e.data);
  });
  if(!localStorage.username) {
    var username = prompt("What is your name?", "Anonymous");
    if(username) {
      localStorage.username = username;
    }
  }
  console.log("Username is: " + localStorage.username);
  $('#msg-form').submit(function(event){
    $form        = $(event.target);
    data         = $form.serializeObject();
    data["user"] = localStorage.username;
    json         = JSON.stringify(data);
    action       = $form.attr('action');
    $.post(action, json, function() {
      $form.get().reset();
    });
    event.preventDefault();
  });
});
