// admin.js — dynamic admin panel interactions
document.addEventListener('DOMContentLoaded', () => {
    const usersContainer = document.getElementById('usersContainer');
    const searchInput = document.getElementById('searchUser');
    const detailsModal = new bootstrap.Modal(document.getElementById('userModal'));
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    async function fetchUsers() {
        const res = await fetch('/api/users');
        const data = await res.json();
        return data.users || [];
    }

    function renderUsers(list) {
        usersContainer.innerHTML = '';
        if (!list.length) {
            usersContainer.innerHTML = '<div class="text-muted">No users found.</div>';
            return;
        }

        list.forEach(name => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-3';

            const card = document.createElement('div');
            card.className = 'card bg-dark text-light h-100';

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = name;

            const btnGroup = document.createElement('div');
            btnGroup.className = 'mt-auto d-flex gap-2';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm btn-outline-info flex-grow-1';
            viewBtn.textContent = 'View';
            viewBtn.onclick = () => openUser(name);

            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn btn-sm btn-outline-success';
            downloadBtn.textContent = 'Download Encoding';
            downloadBtn.href = `/api/users/${encodeURIComponent(name)}/encoding`;
            downloadBtn.setAttribute('download', `${name}.npy`);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-outline-danger';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deleteUser(name, card);

            btnGroup.appendChild(viewBtn);
            btnGroup.appendChild(downloadBtn);
            btnGroup.appendChild(delBtn);

            body.appendChild(title);
            body.appendChild(btnGroup);
            card.appendChild(body);
            col.appendChild(card);
            usersContainer.appendChild(col);
        });
    }

    async function openUser(name) {
        modalTitle.textContent = name;
        modalBody.innerHTML = '<div class="text-muted">Loading images…</div>';
        detailsModal.show();

        try {
            const res = await fetch(`/api/users/${encodeURIComponent(name)}/images`);
            const data = await res.json();
            const images = data.images || [];
            if (!images.length) {
                modalBody.innerHTML = '<div class="text-muted">No images available for this user.</div>';
                return;
            }
            const grid = document.createElement('div');
            grid.className = 'd-flex flex-wrap gap-2';
            images.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'rounded';
                img.style.width = '160px';
                img.style.height = '120px';
                img.style.objectFit = 'cover';
                grid.appendChild(img);
            });
            modalBody.innerHTML = '';
            modalBody.appendChild(grid);
        } catch (err) {
            modalBody.innerHTML = '<div class="text-danger">Failed to load images.</div>';
        }
    }

    async function deleteUser(name, cardEl) {
        if (!confirm(`Delete user '${name}' and all their data? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/users/${encodeURIComponent(name)}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.status === 'ok') {
                // remove card
                cardEl.remove();
                showToast(`Deleted ${name}`);
            } else {
                showToast(`Delete failed: ${data.message || 'unknown'}`);
            }
        } catch (err) {
            showToast('Delete failed — see console');
            console.error(err);
        }
    }

    function showToast(msg) {
        const toastEl = document.getElementById('adminToast');
        const body = document.getElementById('adminToastBody');
        if (body) body.textContent = msg;
        if (toastEl) {
            const t = new bootstrap.Toast(toastEl);
            t.show();
        } else alert(msg);
    }

    // search handling
    searchInput.addEventListener('input', async (e) => {
        const q = e.target.value.toLowerCase().trim();
        const users = await fetchUsers();
        const filtered = users.filter(u => u.toLowerCase().includes(q));
        renderUsers(filtered);
    });

    // initial render
    (async () => {
        const users = await fetchUsers();
        renderUsers(users);
    })();
});
