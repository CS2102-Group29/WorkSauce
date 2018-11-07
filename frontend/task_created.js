function populateTask(place, task) {
    $.get(SERVER_URL + '/bids?task_id=' + task.id).done((data) => {
        const expiry_date = moment(task.expiry_date)
        place.append(
            $('<div class="title">').append(
                $('<div class="ui grid">').append(
                    $('<div class="ten wide column target">').html(
                        '<i class="dropdown icon"></i>' + task.title
                    )
                ).append(
                    $('<div class="three wide column">').append(
                        $('<button class="ui small blue button">').text('Edit').prop(
                            'disabled', moment().isAfter(expiry_date)).click(() => {
                                $.get(SERVER_URL + '/tasks/' + task.id).done((res) => {
                                    const task_displayed = res.data;
                                    $('#modal_create_task').modal('show');
                                    $('#title').val(task_displayed.title);
                                    $('#date').val(task_displayed.date.replace(/T(.*)/, ""));
                                    $('#time').val(task_displayed.time);
                                    $('#end_time').val(task_displayed.end_time);
                                    $('#loc').val(task_displayed.location);
                                    $('#exp_date').val(task_displayed.expiry_date.replace(/T(.*)/,""));
                                    $('#desc').val(task_displayed.description);
                                    $('#task_id').val(task.id);

                                    $('#modal_create_task .header').html('Edit Task');
                                })
                            })
                    )
                ).append(
                    $('<div class="three wide column">').append(
                        $('<button class="ui small red button">').text('Delete')
                        .prop('disabled', moment().isAfter(expiry_date))
                        .click(() => {
                            $.post(SERVER_URL + '/tasks/delete/' + task.id).done((res) => {
                                location.reload();
                            })
                        })
                    )
                )
            )
        );
        place.append(
            $('<div class="content">').append(
                $('<form>')
                .attr('id', 'form_' + task.id)
                .on('submit', e => e.preventDefault())
                .append(
                    $('<table class="ui compact celled definition table">').append(
                        $('<thead>').append(
                            $('<tr>').append(
                                $('<th>')
                            ).append(
                                $('<th>').text('Name')
                            ).append(
                                $('<th>').text('E-mail address')
                            ).append(
                                $('<th>').text('Bid')
                            )
                        )
                    ).append(
                        populateBid(task, data.data)
                    ).append(
                        $('<tfoot class="full-width">').append(
                            $('<tr>').append(
                                $('<th>')
                            ).append(
                                $('<th colspan="4">').append(
                                    $('<button>')
                                    .prop('disabled', true)
                                    .attr('id', 'button_' + task.id)
                                    .addClass('ui')
                                    .addClass('right')
                                    .addClass('floated')
                                    .addClass('small')
                                    .addClass('green')
                                    .addClass('labeled')
                                    .addClass('icon')
                                    .addClass('button')
                                    .html('<i class="check icon"></i> Accept')
                                    .click(() => {
                                        const bidder_email = $('input[name=bidder_' + task.id + ']:checked', '#form_' + task.id).val();

                                        $.get(SERVER_URL + `/bids/accept/${task.id}/${bidder_email}`).done((data) => {
                                            $('#button_' + task.id).prop('disabled', true);
                                            $('input[name=bidder_' + task.id + ']').prop('disabled', true);
                                        });
                                    })
                                )
                            )
                        )
                    )
                )
            )
        );
    });
}

function populateBid(task, bids) {
    const tbody = $('<tbody>')

    if (bids.length === 0) {
        tbody.append(
            $('<tr>').append(
                $('<td>')
            ).append(
                $('<td class="center aligned" colspan="3">').text('No Bidders')
            )
        );
    } else {
        for (bid of bids) {
            const tdUser = $('<td>');
            $.get(SERVER_URL + '/users/' + bid.bidder_email).done((data) => {
                tdUser.text(data.data.name);
            });

            tbody.append(
                $('<tr>').append(
                    $('<td class="collapsing">').append(
                        $('<div class="ui fitted toggle checkbox">').append(
                            $('<input type="radio">')
                            .attr('name', 'bidder_' + task.id)
                            .prop('checked', bid.status === 'success')
                            .prop('disabled', bid.status !== 'ongoing')
                            .val(bid.bidder_email)
                            .click(() => {
                                $('#button_' + task.id).prop('disabled', false)
                            })
                        ).append(
                            $('<label>')
                        )
                    )
                ).append(
                    tdUser
                ).append(
                    $('<td>').text(bid.bidder_email)
                ).append(
                    $('<td>').text(bid.bid)
                )
            );
        };
    }

    return tbody;
}

$(() => {
    const $taskList = $('#task_list');

    $.get(SERVER_URL + '/tasks?email=' + current_user).done((data) => {
        for (task of data.data) {
            populateTask($taskList, task);
        }
    });

    $taskList.accordion({
        selector: {
            trigger: '.title .target'
        }
    });
});
