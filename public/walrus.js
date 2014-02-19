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
  

  if(!localStorage.username) {
    var username = prompt("What is your name?", "Anonymous");
    if(username) {
      localStorage.username = username;
    }
  }

  var replaceHistory = function(messages) {
    console.log(messages);
    messages.reverse();
    $('#history').empty();
    $.each(messages, function() {
      var $message = $('<div>',{"class": "message"})
        .append($('<span>', {"class": "user", text: this["user"]}))
        .append($('<span>', {"class": "text", text: this["text"]}));
      $('#history').append($message);
    });
  };

  $.get('/recent', function(data) {
    replaceHistory(data);
    var source = new EventSource('/updates');
    source.addEventListener('message', function(event) {
      console.log(event.data);
      replaceHistory(JSON.parse(event.data));
    });
  });

  console.log("Username is: " + localStorage.username);
  $('#msg-form').submit(function(event){
    $form        = $(event.target);
    data         = $form.serializeObject();
    data["user"] = localStorage.username;
    json         = JSON.stringify(data);
    action       = $form.attr('action');
    $.post(action, json, function(data) {
      $form.find("input[type=text]").val("");
      replaceHistory(data);
    });
    event.preventDefault();
  });
});
