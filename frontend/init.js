const SERVER_URL = 'http://localhost:4000';
let current_user = sessionStorage.getItem('current_user');
let is_admin = sessionStorage.getItem('is_admin');

if (!/\/(login|signup).html$/.test(location.href)) {
    if (current_user === null) {
        location.href ='login.html';
    }

    if (!/\/index.html$/.test(location.href)) {
        $(() => {
            $('#menu').load('menu.html', () => {
                $('#a_profile').click(() => {
                    $.get(SERVER_URL + '/users/' + current_user).done((r) => {
                        const user = r.data;

                        $('#profile_img').attr('src', user.image);
                        $('#profile_name').text(user.name);
                        $('#profile_email').text(user.email);
                        $('#profile_phone').text(user.mobile);
                    });

                    $('#profile_buttons').show();
                    $('#modal_profile').modal('show');
                });

                $('#a_create_task').click(() => {
                    $('#modal_create_task').modal('show');
                });

                $('#a_logout').click(() => {
                    sessionStorage.clear();
                    location.reload();
                });
            });

            $('#modals').load('modals.html', () => {
                $('#profile_update_form').form({
                    fields: {
                      name: {
                          identifier  : 'name',
                          rules: [
                            {
                              type   : 'empty',
                              prompt : 'Please enter your full name'
                            }
                          ]
                      },
                      mobile: {
                        identifier  : 'mobile',
                        rules: [
                          {
                            type   : 'empty',
                            prompt : 'Please enter your mobile number'
                          },
                          {
                            type   : 'minLength[7]',
                            prompt : 'Please enter a valid mobile number'
                          },
                          {
                            type   : 'integer',
                            prompt : 'Your mobile number must only contain numbers'
                          }
                        ]
                      },
                      email: {
                        identifier  : 'email',
                        rules: [
                          {
                            type   : 'empty',
                            prompt : 'Please enter your e-mail'
                          },
                          {
                            type   : 'email',
                            prompt : 'Please enter a valid e-mail'
                          }
                        ]
                      },
                      password: {
                        identifier  : 'password',
                        rules: [
                          {
                            type   : 'empty',
                            prompt : 'Please enter your password'
                          },
                          {
                            type   : 'length[6]',
                            prompt : 'Your password must be at least 6 characters'
                          }
                        ]
                      }
                    }, onSuccess: function(event, fields) {
                      event.preventDefault();
                      $.post(`${SERVER_URL}/users/updateinfo/${current_user}`, fields).done((res) => {
                        if(res.success) {
                            $('#profile_update_form').show();
                            $('#profile_info').show();
                            $('#profile_buttons').show();
                            $('#profile_update_form').hide();
                            $('#profile_name').show();
                            $('#cancel_update_btn').hide();
                            $('#modal_profile>.header').text('User Profile');

                            sessionStorage.setItem('current_user', fields.email);
                            current_user = fields.email;

                            $.get(SERVER_URL + '/users/' + current_user).done((r) => {
                                const user = r.data;

                                $('#profile_img').attr('src', user.image);
                                $('#profile_name').text(user.name);
                                $('#profile_email').text(user.email);
                                $('#profile_phone').text(user.mobile);
                            });
                        } else {
                            alert(res.msg);
                        }
                      });
                    }
                  })
                ;
                $('#profile_update_form').hide();
                $('#cancel_update_btn').hide();

                $('#editInfoBtn').click(() => {
                    $.get(`${SERVER_URL}/users/${current_user}`).done((res) => {
                        if(res.success) {
                            $('#profile_update_form input[name="name"]').val(res.data.name);
                            $('#profile_update_form input[name="email"]').val(res.data.email);
                            $('#profile_update_form input[name="mobile"]').val(res.data.mobile);
                            $('#profile_update_form input[name="password"]').val(res.data.password);

                            $('#profile_update_form').hide();
                            $('#profile_info').hide();
                            $('#profile_buttons').hide();
                            $('#profile_update_form').show();
                            $('#profile_name').hide();
                            $('#cancel_update_btn').show();
                            $('#modal_profile>.header').text('Edit Profile');
                        } else {
                            alert(res.msg);
                        }
                    });
                });

                $('#cancel_update_btn').click(() => {
                    $('#profile_update_form').show();
                    $('#profile_info').show();
                    $('#profile_buttons').show();
                    $('#profile_update_form').hide();
                    $('#profile_name').show();
                    $('#cancel_update_btn').hide();
                    $('#modal_profile>.header').text('User Profile');
                });

                $('#uploadImgBtn').click(() => {
                    $('#uploadImg').click()
                });

                $('#uploadImg').on('change', () => {
                    console.log('test');
                    const file = document.querySelector('input[type=file]').files[0];
                    const reader = new FileReader();
                    const preview = $('#profile_img');
                    reader.addEventListener('load', () => {
                        preview.attr('src', reader.result);
                        const imageObj = {image: reader.result};
                        $.post(SERVER_URL + '/users/updateimg/' + current_user, imageObj).done((res) => {
                            if (res.success) {
                                // Do nothing
                            } else {
                                console.log(res.msg);
                            }
                        });
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                });

                $('#form_create_task').on('submit', (e) => {
                    e.preventDefault();
                    const data = $('#form_create_task').serialize() + '&taskee_email=' + current_user;

                    $.post(SERVER_URL + '/tasks/new', data).done((r) => {
                        if (r.success) {
                            $('#form_create_task')[0].reset();
                            $('#form_create_task').removeClass("error");
                            $('#modal_create_task').modal('hide');
                            location.reload();
                        } else {
                            $('#form_create_task').addClass("error");
                            $('#form_err_msg').text("Please ensure expiry date is not after task date.");
                        }
                    });
                });
            });
        });
    }
}
