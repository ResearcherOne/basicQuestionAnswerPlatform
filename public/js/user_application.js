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

function getObjects() {
  $.ajax({
    type: 'GET',
    url: "/questionAnswerPlatform/getlist/entries/", //port was 825
    dataType: 'json',
    success: function(data) {
      var htmlString = '';
      $.each(data.entryList, function(i, data){
        htmlString += '<tr class="clickable-row" data-href="question.html?id='+data.entryId+'" style="cursor: pointer;">';
        htmlString += '<td colspan="3"><a><strong>' + data.question + '</strong></a></td>';
        //htmlString += '<td><a class="button thumbs_up" id="'+data.entryId+'" style="margin-bottom:0px">&#128077; '+data.thumbsup+'</a></td>';
        //htmlString += '<td><a class="button thumbs_down" id="'+data.entryId+'" style="margin-bottom:0px">&#128078; '+data.thumbsdown+'</a></td>';
        //htmlString += '<td>'+data.comments.length+' Answer'+(data.comments.length<=1?'':'s')+'</td>'
        htmlString += '</tr>';
      });
      htmlString += '</tbody>';
      $('#questions').append(htmlString);

      $(".clickable-row").click(function() {
          window.location = $(this).data("href");
      });
      $('#foo').spin(false);
    },
    error: function(xhr, status, error) {
      alert("Bağlantı hatası, birkaç dakika sonra tekrar deneyin.");
      $('#foo').spin(false);
    }
  });
}

//Dynamically added button.
$(document).on('click', '.save_question', function(e){
  $('#foo').spin(foo_preset);
  e.preventDefault();
  var q = $(this).closest("tr").find("input[name='question']").val();

  var cook = getCookie("sq");
  if(cook != ""){
    $('#foo').spin(false);
    alert("Yakın zamanda soru gönderdiniz, Lütfen biraz bekleyiniz!");
    return;
  }

  q = q.trim();
  if(q == ""){
    $('#foo').spin(false);
    alert("Boş soru gönderemezsiniz!");
    return;
  }

  $.post( "/questionAnswerPlatform/ask/", { question: q, whoAsked: "2pm" }).always(
    function( data ) {
      $('#foo').spin(false);
      if(data.isSucceed){
        setCookieShort("sq", "1", 30);

        location.reload();
      }
      else
        alert( data.description );
    });
});
