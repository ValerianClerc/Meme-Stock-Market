$(function () {
    $('#like').on('click', function () {
        var $id = JSON.parse($('.data').attr('data-test-value'))._id;
        $(this).toggleClass('liked');
        $(this).toggleClass('not-liked');
        $.ajax({
            type: 'POST',
            url: '../posts/' + $id + '/like',
            error: function () {
                alert('error');
            },
            success: function () {
                console.log(parseInt($('#likeCount span').text()));
                var likes = parseInt($('#likeCount span').text(), 10);
                console.log(likes);
                if ($('#like').hasClass('liked')) {
                    likes++;
                } else {
                    likes--;
                }
                $('#main #likeCount span').text(likes);
            }
        });
    });

});
