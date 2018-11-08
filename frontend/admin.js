if (is_admin) {
    $('#modal_profile').append(
        $('<div class="actions">').append(
            $('<button class="ui blue button">').text('Edit').click(() => {
                $('#profile_buttons').show();
            })
        ).append(
            $('<button class="ui red button">').text('Delete').click(() => {
                const email = $('#profile_email').text();
                $.get(SERVER_URL + '/users/delete/' + email).done((r) => {
                    displayTasks();
                    $('#modal_profile').modal('hide');
                });
            })
        )
    );

    $('#modal_task_desc').append(
        $('<div class="actions">').append(
            $('<button class="ui blue button">').text('Edit').click(() => {
                const task_id = $('#task_id').val();
                const $modal = $('#modal_create_task')

                $.get(SERVER_URL + '/tasks/' + task_id).done((r) => {
                    $modal.find('input[name=title]').val(r.data.title);
                    $modal.find('input[name=date]').val(r.data.date.replace(/T(.*)/, ""));
                    $modal.find('input[name=time]').val(r.data.time);
                    $modal.find('input[name=end_time]').val(r.data.end_time);
                    $modal.find('input[name=location]').val(r.data.location);
                    $modal.find('input[name=expiry_date]').val(r.data.expiry_date.replace(/T(.*)/, ""));
                    $modal.find('input[name=description]').val(r.data.description);
                    $modal.find('input[name=task_id]').val(task_id);
                    $modal.find('input[name=taskee_email]').val(r.data.taskee_email);
                    $modal.modal('show');
                });
            })
        ).append(
            $('<button class="ui red button">').text('Delete').click(() => {
                const id = $('#task_id').val();
                $.post(SERVER_URL + '/tasks/delete/' + id).done((r) => {
                    displayTasks();
                    $('#modal_task_desc').modal('hide');
                });
            })
        )
    );
}
