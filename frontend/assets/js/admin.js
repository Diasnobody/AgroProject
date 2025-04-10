//frontend/assets/js/admin.js
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Ошибка авторизации. Пожалуйста, войдите заново.");
        window.location.href = "index.html";
        return;
    }

    // Проверка роли пользователя
    fetch("http://localhost:3700/api/auth/check-admin", {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Доступ запрещен.");
            return response.json();
        })
        .then((data) => {
            if (data.role !== "admin") {
                alert("Доступ запрещен. Требуются права администратора.");
                window.location.href = "index.html";
            } else {
                initializePage();
            }
        })
        .catch(() => {
            alert("Ошибка проверки роли. Пожалуйста, войдите заново.");
            window.location.href = "index.html";
        });

    function initializePage() {
        const createCourseBtn = document.getElementById('createCourseBtn');
        if (createCourseBtn) {
            createCourseBtn.addEventListener('click', () => {
                console.log("Кнопка 'Добавить новый курс' нажата");
                window.location.href = 'editor.html';
            });
        } else {
            console.error("Элемент с ID 'createCourseBtn' не найден");
        }

        const tabCourses = document.getElementById('tabCourses');
        const tabUsers = document.getElementById('tabUsers');
        const coursesTab = document.getElementById('coursesTab');
        const usersTab = document.getElementById('usersTab');

        if (tabCourses && tabUsers) {
            console.log("Скрипт загружен и работает");
            tabCourses.addEventListener('click', () => {
                coursesTab.style.display = 'block';
                usersTab.style.display = 'none';
                loadCourses();
            });

            tabUsers.addEventListener('click', () => {
                coursesTab.style.display = 'none';
                usersTab.style.display = 'block';
                loadUsers();
            });
        }

        loadCourses();
        loadUsers();
    }

    async function loadCourses() {
        const res = await fetch("http://localhost:3700/api/admin/courses", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const coursesListDiv = document.getElementById("coursesList");
        coursesListDiv.innerHTML = data.courses
            .map(
                (course) => `
            <div class="course-item">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button onclick="editCourse('${course._id}')">Редактировать</button>
                <button onclick="deleteCourse('${course._id}')">Удалить</button>
            </div>
        `
            )
            .join("");
    }

    async function loadUsers() {
        const res = await fetch("http://localhost:3700/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const usersListDiv = document.getElementById("usersList");
        usersListDiv.innerHTML = data.users
            .map(
                (user) => `
            <div class="user-item">
                <p>Логин: ${user.username}</p>
                <p>Роль: ${user.role}</p>
                <button onclick="editUser('${user._id}')">Редактировать</button>
                <button onclick="deleteUser('${user._id}')">Удалить</button>
            </div>
        `
            )
            .join("");
    }

    async function editCourse(courseId) {
        console.log("Редактирование курса, ID:", courseId);
        const token = localStorage.getItem('token') || '';

        try {
            console.log("Отправка запроса с токеном:", token);
            const res = await fetch(`http://localhost:3700/api/admin/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.course) {
                document.getElementById('editCourseId').value = data.course._id;
                document.getElementById('editCourseTitle').value = data.course.title;
                document.getElementById('editCourseDescription').value = data.course.description;

                console.log("Данные курса загружены:", data.course);
                document.getElementById('editCourseSection').style.display = 'block';

                setTimeout(() => {
                    const textarea = document.getElementById('editCourseContent');
                    if (!textarea) {
                        console.error("Ошибка: textarea editCourseContent не найдена!");
                        return;
                    }

                    console.log("Textarea найдена, инициализируем TinyMCE...");

                    if (tinymce.get('editCourseContent')) {
                        tinymce.get('editCourseContent').remove();
                    }

                    tinymce.init({
                        selector: '#editCourseContent',
                        height: 400,
                        plugins: 'advlist autolink lists link image charmap print preview anchor',
                        toolbar: 'undo redo | formatselect | bold italic backcolor | image media file | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        setup: function(editor) {
                            editor.on('init', function() {
                                editor.setContent(data.course.content || '');
                                console.log("TinyMCE загружен и заполнен контентом!");
                            });
                        }
                    });

                }, 100);
            } else {
                console.error("Ошибка: курс не найден", data);
            }
        } catch (error) {
            console.error("Ошибка при загрузке курса:", error);
        }
    }

    async function editUser(userId) {
        console.log("Редактирование пользователя, ID:", userId);
        const token = localStorage.getItem('token') || '';

        try {
            console.log("Отправка запроса на сервер с токеном:", token);
            const res = await fetch(`http://localhost:3700/api/admin/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (data.user) {
                document.getElementById('editUserId').value = data.user._id;
                document.getElementById('editUsername').value = data.user.username;
                document.getElementById('editRole').value = data.user.role;

                console.log("Данные пользователя загружены:", data.user);
                document.getElementById('editUserSection').style.display = 'block';
            } else {
                console.error("Ошибка: пользователь не найден", data);
            }
        } catch (error) {
            console.error("Ошибка при загрузке пользователя:", error);
        }
    }
});

// Удаление курса
async function deleteCourse(courseId) {
    console.log("Удаление курса с ID:", courseId);

    if (!confirm("Вы уверены, что хотите удалить этот курс?")) {
        return;
    }

    try {
        const res = await fetch(`http://localhost:3700/api/admin/courses/${courseId}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (res.ok) {
            alert("Курс успешно удален");
            loadCourses();
        } else {
            alert("Ошибка удаления: " + data.error);
        }
    } catch (error) {
        console.error("Ошибка при удалении курса:", error);
    }
}

// Удаление пользователя
async function deleteUser(userId) {
    console.log("Удаление пользователя с ID:", userId);

    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
        return;
    }

    try {
        const res = await fetch(`http://localhost:3700/api/admin/users/${userId}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (res.ok) {
            alert("Пользователь успешно удален");
            loadUsers();
        } else {
            alert("Ошибка удаления: " + data.error);
        }
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
    }
}
