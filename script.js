function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  if (getCookie('wallet')) {
    window.location.href = "/dashboard";
  }
  
  function verifyWalletAddress() {
    const walletInput = document.querySelector('input[name="wallet"]');
    const walletValue = walletInput.value.trim();
  
    fetch('https://api.trongrid.io/v1/accounts/' + walletValue, {
      headers: {
        'Tron-Api-Key': '372bcc21-b2b7-4e06-9cde-37071ce735b0'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          return fetch('/check-wallet-existence', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wallet: walletValue })
          })
            .then(response => response.json())
            .then(walletData => {
              if (walletData.exists) {
                document.cookie = `wallet=${walletValue};path=/;max-age=2592000`;
                window.location.href = "/dashboard";
              } else {
                $('#successModal').modal('show');
              }
            });
        } else {
          throw new Error("Invalid wallet address");
        }
      })
      .catch(error => {
        $('#errorModal').modal('show');
      });
  }
  
  $(document).ready(function() {
    $('#successModal form').on('submit', function(event) {
      event.preventDefault();
      const codeValue = $(this).find('input[name="tgcode"]').val();
      $.post('/verify-tg', { tgid: codeValue }, function(response) {
        if (response.success) {
          document.cookie = `tgcode=${codeValue};path=/;max-age=2592000`;
          $('#successModal').modal('hide');
          registerUser()
        } else {
          document.cookie = `tgcode=${codeValue};path=/;max-age=2592000`;
          $('#successModal').modal('hide');
          registerUser()
        }
      });
    });
  });
  
  function registerUser() {
    const formData = $("#registrationForm").serialize();
    $.ajax({
      type: "POST",
      url: "/register",
      data: formData,
      success: function(response) {
        window.location.href = "/dashboard";
      },
      error: function(error) {
        alert("Hubo un error al registrarse. Inténtalo de nuevo.");
      }
    });
  }
  
  document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    $('#captchaModal').modal('show');
  });
