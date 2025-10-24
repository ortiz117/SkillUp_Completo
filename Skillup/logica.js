   // Data
        const certifications = [
            { id: 1, name: 'Desarrollo Web Avanzado', career: 'tics', description: 'HTML, CSS, JavaScript y frameworks modernos', duration: '40 horas' },
            { id: 2, name: 'Bases de Datos SQL', career: 'tics', description: 'Diseño y gestión de bases de datos relacionales', duration: '30 horas' },
            { id: 3, name: 'Redes y Seguridad', career: 'tics', description: 'Protocolos, arquitecturas y ciberseguridad', duration: '35 horas' },
            { id: 4, name: 'Gestión de Calidad', career: 'industrial', description: 'Normas ISO y control de calidad', duration: '25 horas' },
            { id: 5, name: 'Logística y Cadena de Suministro', career: 'industrial', description: 'Optimización de procesos logísticos', duration: '30 horas' },
            { id: 6, name: 'Marketing Digital', career: 'gestion', description: 'Estrategias digitales y redes sociales', duration: '25 horas' },
            { id: 7, name: 'Contabilidad Financiera', career: 'gestion', description: 'Principios contables y estados financieros', duration: '35 horas' },
            { id: 8, name: 'Agricultura Sostenible', career: 'agronomia', description: 'Técnicas de cultivo sustentable', duration: '40 horas' },
        ];

        const tutors = [
            { id: 1, name: 'Dr. Juan Pérez', career: 'tics', subjects: ['programacion', 'calculo'], rating: 4.8, sessions: 45 },
            { id: 2, name: 'Ing. María González', career: 'industrial', subjects: ['estadistica', 'calculo'], rating: 4.9, sessions: 62 },
            { id: 3, name: 'Lic. Carlos Ramírez', career: 'gestion', subjects: ['contabilidad'], rating: 4.7, sessions: 38 },
            { id: 4, name: 'Ing. Ana López', career: 'tics', subjects: ['programacion'], rating: 4.9, sessions: 51 },
            { id: 5, name: 'Dr. Roberto Sánchez', career: 'agronomia', subjects: ['quimica'], rating: 4.6, sessions: 29 },
        ];

        let currentUser = null;
        let selectedTutor = null;
        let userSessions = [];
        let userCertifications = [];

        // Navigation
        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            if (sectionId === 'certifications') {
                renderCertifications();
            } else if (sectionId === 'tutors') {
                renderTutors();
            } else if (sectionId === 'sessions') {
                renderSessions();
            }
        }

        // Modal
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // --- FUNCIÓN LOGIN CORREGIDA ---
async function login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Usamos el servicio para llamar a la API
        const data = await apiService.login(email, password); 

        // Guardamos el token en el almacenamiento local del navegador
        localStorage.setItem('authToken', data.token);
        currentUser = data.user; // Guardamos los datos del usuario

        updateUserInterface();
        closeModal('loginModal');
        showAlert('success', `Bienvenido de nuevo, ${currentUser.name}`);

    } catch (error) {
        // Si el login falla, el apiService lanzará un error que atrapamos aquí
        showAlert('error', error.message);
    }
}

async function register(e) {
    e.preventDefault();

    // ¡CAMBIO! Ajustamos los nombres de las claves para que coincidan con el backend
    const userData = {
        nombre: document.getElementById('registerName').value, // 'name' cambia a 'nombre'
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        rol: document.getElementById('registerType').value      // 'type' cambia a 'rol'
        // El campo 'career' no existe en la tabla 'usuarios', por ahora no lo enviamos.
        // Más adelante, lo guardarás en una tabla separada.
    };

    try {
        const registeredUser = await apiService.register(userData); 
        
        closeModal('registerModal');
        showAlert('success', `Registro exitoso para ${registeredUser.nombre}. ¡Ahora inicia sesión!`);
        showModal('loginModal');

    } catch (error) {
        showAlert('error', error.message);
    }
}

// --- FUNCIÓN LOGOUT CORREGIDA ---
function logout() {
    currentUser = null;
    localStorage.removeItem('authToken'); // ¡Muy importante borrar el token!

    // Limpiamos los datos locales del usuario
    userSessions = [];
    userCertifications = [];

    updateUserInterface();
    showSection('home');
    showAlert('success', 'Sesión cerrada correctamente');
}

        // Certifications
        function renderCertifications() {
            const grid = document.getElementById('certificationsGrid');
            const filter = document.getElementById('careerFilter').value;
            
            const filtered = filter ? certifications.filter(c => c.career === filter) : certifications;
            
            grid.innerHTML = filtered.map(cert => `
                <div class="card">
                    <span class="badge badge-primary">${cert.duration}</span>
                    <h3>${cert.name}</h3>
                    <p>${cert.description}</p>
                    <button class="btn btn-primary" onclick="enrollCertification(${cert.id})">
                        Inscribirse
                    </button>
                </div>
            `).join('');
        }

        function filterCertifications() {
            renderCertifications();
        }

        function enrollCertification(id) {
            if (!currentUser) {
                showAlert('error', 'Debes iniciar sesión para inscribirte');
                showModal('loginModal');
                return;
            }

            const cert = certifications.find(c => c.id === id);
            userCertifications.push({
                ...cert,
                date: new Date().toLocaleDateString(),
                status: 'En Progreso',
                score: '-'
            });

            showAlert('success', `Inscrito exitosamente en: ${cert.name}`);
        }

        // Tutors
        function renderTutors() {
            const grid = document.getElementById('tutorsGrid');
            const filter = document.getElementById('subjectFilter').value;
            
            const filtered = filter ? tutors.filter(t => t.subjects.includes(filter)) : tutors;
            
            grid.innerHTML = filtered.map(tutor => `
                <div class="card tutor-card">
                    <div class="tutor-header">
                        <div class="tutor-avatar">${tutor.name.charAt(0)}</div>
                        <div class="tutor-info">
                            <h4>${tutor.name}</h4>
                            <p>${getCareersName(tutor.career)}</p>
                        </div>
                    </div>
                    <div class="rating">⭐ ${tutor.rating} (${tutor.sessions} sesiones)</div>
                    <div style="margin: 1rem 0;">
                        ${tutor.subjects.map(s => `<span class="badge badge-success">${getSubjectName(s)}</span>`).join('')}
                    </div>
                    <button class="btn btn-primary" onclick="selectTutor(${tutor.id})">
                        Solicitar Asesoría
                    </button>
                </div>
            `).join('');
        }

        function filterTutors() {
            renderTutors();
        }

        function selectTutor(id) {
            if (!currentUser) {
                showAlert('error', 'Debes iniciar sesión para solicitar asesorías');
                showModal('loginModal');
                return;
            }

            selectedTutor = tutors.find(t => t.id === id);
            showModal('sessionModal');
        }

        function requestSession(e) {
            e.preventDefault();
            
            const session = {
                tutor: selectedTutor.name,
                subject: selectedTutor.subjects[0],
                date: document.getElementById('sessionDate').value,
                time: document.getElementById('sessionTime').value,
                mode: document.getElementById('sessionMode').value,
                description: document.getElementById('sessionDescription').value,
                status: 'Programada'
            };

            userSessions.push(session);
            
            const alert = document.getElementById('sessionAlert');
            alert.innerHTML = '<div class="alert alert-success">Solicitud enviada correctamente. El tutor confirmará pronto.</div>';
            
            setTimeout(() => {
                closeModal('sessionModal');
                alert.innerHTML = '';
                e.target.reset();
            }, 2000);
        }

        // Sessions
        function renderSessions() {
            const certsTable = document.getElementById('certificationsTable');
            const sessionsTable = document.getElementById('sessionsTable');

            if (userCertifications.length > 0) {
                certsTable.innerHTML = userCertifications.map(cert => `
                    <tr>
                        <td>${cert.name}</td>
                        <td>${cert.date}</td>
                        <td>${cert.score}</td>
                        <td><span class="badge badge-warning">${cert.status}</span></td>
                    </tr>
                `).join('');
            } else {
                certsTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay certificaciones aún</td></tr>';
            }

            if (userSessions.length > 0) {
                sessionsTable.innerHTML = userSessions.map((session, index) => `
                    <tr>
                        <td>${session.tutor}</td>
                        <td>${getSubjectName(session.subject)}</td>
                        <td>${session.date} ${session.time}</td>
                        <td><span class="badge badge-primary">${session.mode}</span></td>
                        <td>
                            <button class="btn btn-secondary" style="padding: 0.25rem 0.75rem;" onclick="rateSession(${index})">
                                Calificar
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                sessionsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay sesiones programadas</td></tr>';
            }
        }

        function rateSession(index) {
            const rating = prompt('Califica la sesión (1-5 estrellas):');
            if (rating && rating >= 1 && rating <= 5) {
                showAlert('success', 'Gracias por tu calificación');
            }
        }

        // Utilities
        function getCareersName(career) {
            const names = {
                'tics': 'Ing. en TICs',
                'industrial': 'Ing. Industrial',
                'gestion': 'Gestión Empresarial',
                'agronomia': 'Ing. en Agronomía'
            };
            return names[career] || career;
        }

        function getSubjectName(subject) {
            const names = {
                'programacion': 'Programación',
                'calculo': 'Cálculo',
                'estadistica': 'Estadística',
                'contabilidad': 'Contabilidad',
                'quimica': 'Química'
            };
            return names[subject] || subject;
        }

        function showAlert(type, message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'error'}`;
            alertDiv.textContent = message;
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '80px';
            alertDiv.style.right = '20px';
            alertDiv.style.zIndex = '1001';
            alertDiv.style.minWidth = '300px';
            
            document.body.appendChild(alertDiv);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Initialize
        renderCertifications();
        renderTutors();