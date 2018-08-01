$(function () {
    $('#grid').on('click', '#like', function () {
        var $id = JSON.parse($('.data').attr('data-test-value'))._id;
        $(this).toggleClass('liked');
        $(this).toggleClass('not-liked');
        $.ajax({
            context: this,
            type: 'POST',
            url: '../posts/' + $id + '/like',
            datatype: 'json',
            error: function () {
                alert('error');
            },
            success: function (response) {
                $(this).parent().find('#likeCount span').html(JSON.parse(response).total);
            }
        });
    });

});
