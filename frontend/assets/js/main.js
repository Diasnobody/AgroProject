// frontend/assets/js/main.js
console.log("Сохранённый токен:", localStorage.getItem('token'));

// Регистрация
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      role: formData.get('isAdmin') ? 'admin' : 'user'
    };
    
    const res = await fetch('http://localhost:3700/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    alert(result.message || result.error);
  });
  
  // Вход
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password')
    };
    
    const res = await fetch('http://localhost:3700/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if(result.token) {
      // Сохраняем токен и в зависимости от роли перенаправляем на нужную страницу
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', result.userId);
      if(result.role === 'admin') {
        window.location.href = 'indexosn.html';
      } else {
        window.location.href = 'indexosn.html'; // Можно создать страницу для обычного пользователя
      }
    } else {
      alert(result.message || result.error);
    }
  });
  