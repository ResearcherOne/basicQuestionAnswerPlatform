var foo_preset = {
  lines:   13
, length: 20
, width:  6
, radius:  17
, opacity:  0.15
};

$(document).ready(function(){
  $('#foo').spin(foo_preset);
  getObjects();
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getObjects() {
  var id = getUrlParameter('id');
  $.ajax({
    type: 'GET',
    url: "/questionAnswerPlatform/getlist/entries/", //port was 825
    dataType: 'json',
    success: function(data) {
      var htmlString = '<colgroup>  <col span="1" style="width: 20%;">  <col span="1" style="width: 50%;"> <col span="1" style="width: 15%;"> <col span="1" style="width: 15%;"> </colgroup> <tbody>';
      $.each(data.entryList, function(i, data){
        if(data.entryId == id){
          htmlString += '<tr>';
          htmlString += '<td colspan="3"><strong style="font-size:25px">'+data.question+'</strong></td>';
          htmlString += '<td><a class="button question_thumbs_up" id="'+data.entryId+'" style="margin-bottom:0px">&#128077; '+data.thumbsup+'</a></td>';
          //htmlString += '<td><a class="button thumbs_down" id="'+data.entryId+'" style="margin-bottom:0px">&#128078; '+data.thumbsdown+'</a></td>';
          htmlString += '</tr>';

          $.ajax({
            type: 'GET',
            url: "/questionAnswerPlatform/getlist/comments/"+id, //port was 825
            dataType: 'json',
            success: function(data) {
              function compare(a,b) {
                if (a.thumbsup > b.thumbsup)
                  return -1;
                if (a.thumbsup < b.thumbsup)
                  return 1;
                return 0;
              }
              data.commentList.sort(compare);

              $.each(data.commentList, function(i, data){
                htmlString += '<tr>';
                htmlString += '<td><strong>' + data.fullName + '</strong></td>';
                htmlString += '<td colspan="2">'+data.comment+'</td>';
                htmlString += '<td><a class="button comment_thumbs_up" id="'+data.commentId+"-"+id+'" style="margin-bottom:0px">&#128077; '+data.thumbsup+'</a></td>';
                htmlString += '</tr>';
              });
              htmlString += '<tr>';
              htmlString += '<td><input type="text" name="name" placeholder="Adınızı buraya girin" style="width: 100%; margin-bottom:0px"></td>';
              htmlString += '<td colspan="2"><input type="text" name="comment" placeholder="Cevabınızı buraya girin" style="width: 100%; margin-bottom:0px"></td>';
              htmlString += '<td><a class="button send_comment" id="'+id+'" style="margin-bottom:0px">GÖNDER</a></td>';
              htmlString += '</tr>';
              htmlString += '</tbody>';
              $('#comments').append(htmlString);
              $('#foo').spin(false);
            },
            error: function(xhr, status, error) {
              $('#foo').spin(false);
              alert("Bağlantı hatası, birkaç dakika sonra tekrar deneyin.");
            }
          });
        }
      });
    },
    error: function(xhr, status, error) {
      alert("Bağlantı hatası, birkaç dakika sonra tekrar deneyin.");
      $('#foo').spin(false);
    }
  });
}

$(document).on('click', '.send_comment', function(e){
  e.preventDefault();
  $('#foo').spin(foo_preset);
  var n = $(this).closest("tr").find("input[name='name']").val();
  var c = $(this).closest("tr").find("input[name='comment']").val();
  var id = this.id;
  var cook = getCookie("sc" + id);
  if(cook != ""){
    $('#foo').spin(false);
    alert("Bu soruya yakın zamanda yorum gönderdiniz!");
    return;
  }

  c = c.trim();
  n = n.trim();
  if(c == ""){
    $('#foo').spin(false);
    alert("Boş yorum gönderemezsiniz!");
    return;
  }
  if(n == ""){
    $('#foo').spin(false);
    alert("Boş isimle yorum gönderemezsiniz!");
    return;
  }

  $.post( "/questionAnswerPlatform/comment/", { fullName: n, comment: c, entryId: id }).always(
    function( data ) {
      $('#foo').spin(false);
      if(data.isSucceed){
        setCookieShort("sc"+id, "1", 30);

        location.reload();
      }
      else
        alert( data.description );
    });
});
$(document).on('click', '.question_thumbs_up', function(e){
  e.preventDefault();
  $('#foo').spin(foo_preset);
  var id = this.id;
  var elem = $(this);

  var cook = getCookie("q"+id);
  if(cook != ""){
    $('#foo').spin(false);
    alert("Bu soruya zaten oy verdiniz!");
    return;
  }

  $.post( "/questionAnswerPlatform/vote/question/", { entryId: id }).always(
    function( data ) {
      $('#foo').spin(false);
      if(data.isSucceed){
        setCookie("q"+id, "1", 365);
        var txt = elem.text();
        var tu = txt.substr(0,3);

        elem.text(tu + (parseInt(txt.substr(3)) + 1));
      }
      else
        alert( data.description );
    });
});
$(document).on('click', '.comment_thumbs_up', function(e){
  e.preventDefault();
  $('#foo').spin(foo_preset);
  var id = this.id.split("-")[0];
  var eid = this.id.split("-")[1];
  var elem = $(this);

  var cook = getCookie("c"+id);
  if(cook != ""){
    $('#foo').spin(false);
    alert("Bu cevaba zaten oy verdiniz!");
    return;
  }

  $.post( "/questionAnswerPlatform/vote/comment/", { entryId: eid, commentId: id }).always(
    function( data ) {
      $('#foo').spin(false);
      if(data.isSucceed){
        setCookie("c"+id, "1", 365);
        var txt = elem.text();
        var tu = txt.substr(0,3);

        elem.text(tu + (parseInt(txt.substr(3)) + 1));
      }
      else
        alert( data.description );
    });
});
//Dynamically added button.
/*$(document).on('click', '.thumbs_down', function(e){
  e.preventDefault();
  var id = this.id;
  var elem = $(this);

  $.post( "/questionAnswerPlatform/vote/thumbsdown/", { entryId: id }).always(
    function( data ) {
      if(data.isSucceed){
        var txt = elem.text();
        var td = txt.substr(0,3);

        elem.text(td + (parseInt(txt.substr(3)) + 1));
      }
      alert( data.description );
    });
});*/