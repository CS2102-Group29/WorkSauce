function populateTask(place, task) {
    $.get(SERVER_URL + '/bids').done((data) => {
        const bids = data.data.filter(e => e.task_id === task.id);

        place.append(
            $('<div class="title">').html(
                '<i class="dropdown icon"></i>' + task.title
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
                        populateBid(task, bids)
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
                                        const selected = $('input[name=bidder_' + task.id + ']:checked', '#form_' + task.id).val();
                                        console.log(selected);
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
            $.get(SERVER_URL + '/users').done((data) => {
                // TODO
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
                    $('<td>').text(bid.bidder_email)
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

    $.get(SERVER_URL + '/tasks').done((data) => {
        for (task of data.data) {
            if (task.taskee_email === current_user) {
                populateTask($taskList, task);
            }
        }
    });

    $taskList.accordion();
});
