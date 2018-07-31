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
            }
        });
    });

});
