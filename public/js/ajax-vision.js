$(document).ready(function () {
    $('#uploadForm').submit(function (event) {
        event.preventDefault();

        var formData = new FormData();
        formData.append('image', $('#imageInput')[0].files[0]);

        $('.container').append('<div class="load">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">' +
            '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">' +
            '<path stroke-dasharray="2 4" stroke-dashoffset="6" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3">' +
            '<animate attributeName="stroke-dashoffset" dur="0.3s" repeatCount="indefinite" values="6;0"/></path>' +
            '<path stroke-dasharray="30" stroke-dashoffset="30" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21">' +
            '<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.05s" dur="0.15s" values="30;0"/></path>' +
            '<path stroke-dasharray="10" stroke-dashoffset="10" d="M12 16v-7.5">' +
            '<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.1s" values="10;0"/></path>' +
            '<path stroke-dasharray="6" stroke-dashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5">' +
            '<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.1s" values="6;0"/></path>' +
            '</g></svg>' +
            '</div>');

        // Send AJAX request to /upload endpoint
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response)
                $('#responseContainer').html(escapeAndReplaceNewLines(response.response)); // Display formatted response
                $('.load').remove()
            },
            error: function (xhr, status, error) {
                alert('Error uploading file: ' + error);
                $('.load').remove()
            }
        });
    });

    function escapeAndReplaceNewLines(message) {
        // Replace newline characters with <br> tags
        let htmlWithBreaks = message.replace(/\n/g, "<br>");

        // Replace **...** with <strong>...</strong>
        htmlWithBreaks = htmlWithBreaks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        const div = document.createElement('div');
        div.innerHTML = htmlWithBreaks;
        return div.innerHTML;
    }
});