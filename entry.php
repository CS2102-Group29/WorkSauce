<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>Task Sourcing</title>
  <link rel="shortcut icon" href="assets/images/logo.png">
  <link href="./semantic.min.css" rel="stylesheet" type="text/css">
  <script src="./jquery.min.js"></script>
  <script src="./semantic.min.js"></script>
</head>

<?php
  $session = !$_GET['session'] ? 'login' : $_GET['session']; 
?>

<style type="text/css">
  body {
    background-color: #DADADA;
  }
  body > .grid {
    height: 100%;
  }
  .image {
    margin-top: -100px;
  }
  .column {
    max-width: 450px;
  }
</style>
<script>

  $(document)
    .ready(function() {
      $('.ui.form')
        .form({
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
            alert('<?php echo ucfirst($session) ?> success!');
          }
        })
      ;
    })
  ;
</script>
<body>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui teal image header">
        <img src="assets/images/logo.png" class="image">
          <div class="content">
            <?php 
              if($session == 'login') {
                echo 'Log-in to your account';
              } else if($session = 'signup') {
                echo 'Create a new account';
              }
            ?>
          </div>
      </h2>
      <form class="ui large form">
        <div class="ui stacked segment">
          <?php
            if($session == 'signup') {
              echo '
                <div class="field">
                  <div class="ui left icon input">
                    <i class="user icon"></i>
                      <input type="text" name="name" placeholder="Full name">
                  </div>
                </div>
                <div class="field">
                  <div class="ui left icon input">
                    <i class="phone icon"></i>
                      <input type="text" name="mobile" placeholder="Mobile phone">
                  </div>
                </div>
              ';
            }
          ?>
          <div class="field">
            <div class="ui left icon input">
              <i class="envelope icon"></i>
              <input type="text" name="email" placeholder="E-mail address">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" placeholder="Password">
            </div>
          </div>

          <div class="ui fluid large teal submit button"><?php echo ucfirst($session) ?></div>

        </div>
              
        <div class="ui error message"></div>
              
      </form>
      
      <?php
        if($session == 'login') {
          echo '
            <div class="ui message">
              New to us? <a href="entry.php?session=signup">Signup</a>
            </div>
          ';
        } else if($session == 'signup') {
          echo '
            <div class="ui message">
              Already have an account? <a href="entry.php?session=login">Login</a>
            </div>
          ';
        }
      ?>
    </div>
  </div>
</body>

</html>

