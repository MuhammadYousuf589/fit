// app.js — Frontend-only demo app
// This file simulates backend logic using functions that operate on localStorage.
// It implements a fake authentication system and CRUD for per-user items.
// NOTE: GitHub Pages is a static hosting service and does NOT run server-side code.
//       For that reason this demo keeps everything client-side in localStorage.

(function(){
  'use strict';

  /* ------------------------ Utilities ------------------------ */
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
  function delay(ms=200){ return new Promise(r=>setTimeout(r, ms)); }

  function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function load(key, fallback){ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }

  /* ------------------------ Simulated backend ------------------------ */
  // All server-side operations are simulated here. These functions pretend
  // to call a backend by operating on localStorage and (optionally) adding a
  // small artificial delay. In a real app these would be network requests.

  const SIM_KEY_USERS = 'demo_users_v1';

  function getUsers(){ return load(SIM_KEY_USERS, []); }
  function saveUsers(users){ save(SIM_KEY_USERS, users); }

  async function createUser({name,email,password}){
    await delay(250); // simulate network latency
    const users = getUsers();
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){
      throw new Error('Email already registered');
    }
    const user = { id: uid(), name:name||'', email: email.toLowerCase(), password: password };
    users.push(user); saveUsers(users);
    return { ...user };
  }

  async function authenticate(email,password){
    await delay(200);
    const users = getUsers();
    const user = users.find(u=>u.email.toLowerCase()===email.toLowerCase());
    if(!user || user.password !== password) throw new Error('Invalid email or password');
    return { ...user };
  }

  // Per-user items (simple CRUD). Stored under key `items_{userId}`.
  function itemsKey(userId){ return `demo_items_v1_${userId}`; }

  async function getItems(userId){ await delay(120); return load(itemsKey(userId), []); }
  async function createItem(userId, {title,description}){
    await delay(140);
    const list = load(itemsKey(userId), []);
    const item = { id: uid(), title: title||'Untitled', description: description||'', createdAt: new Date().toISOString() };
    list.unshift(item); save(itemsKey(userId), list); return item;
  }
  async function updateItem(userId, itemId, patch){ await delay(120);
    const list = load(itemsKey(userId), []);
    const idx = list.findIndex(i=>i.id===itemId); if(idx===-1) throw new Error('Item not found');
    list[idx] = Object.assign({}, list[idx], patch); save(itemsKey(userId), list); return list[idx];
  }
  async function deleteItem(userId, itemId){ await delay(100);
    let list = load(itemsKey(userId), []);
    list = list.filter(i=>i.id!==itemId); save(itemsKey(userId), list); return true;
  }

  /* ------------------------ Session helpers ------------------------ */
  const SESSION_KEY = 'demo_current_user';
  function setCurrentUser(user){ save(SESSION_KEY, { id: user.id, email: user.email, name: user.name }); }
  function getCurrentUser(){ return load(SESSION_KEY, null); }
  function clearCurrentUser(){ localStorage.removeItem(SESSION_KEY); }

  /* ------------------------ Page logic ------------------------ */
  document.addEventListener('DOMContentLoaded', ()=>{
    const page = document.body.id;
    if(page === 'page-login') initLoginPage();
    if(page === 'page-dashboard') initDashboardPage();
  });

  /* ------------------------ Login / Signup page ------------------------ */
  function initLoginPage(){
    // If already logged in, redirect to dashboard
    if(getCurrentUser()){ window.location.href = 'dashboard.html'; return; }

    const tLogin = document.getElementById('tab-login');
    const tSignup = document.getElementById('tab-signup');
    const fLogin = document.getElementById('form-login');
    const fSignup = document.getElementById('form-signup');

    tLogin.addEventListener('click', ()=>{ tLogin.classList.add('active'); tSignup.classList.remove('active'); fLogin.classList.remove('hidden'); fSignup.classList.add('hidden'); });
    tSignup.addEventListener('click', ()=>{ tSignup.classList.add('active'); tLogin.classList.remove('active'); fSignup.classList.remove('hidden'); fLogin.classList.add('hidden'); });

    fSignup.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      try{
        const user = await createUser({name,email,password});
        setCurrentUser(user);
        // After signup, redirect to dashboard
        window.location.href = 'dashboard.html';
      }catch(err){ alert(err.message); }
    });

    fLogin.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      try{
        const user = await authenticate(email,password);
        setCurrentUser(user);
        window.location.href = 'dashboard.html';
      }catch(err){ alert(err.message); }
    });
  }

  /* ------------------------ Dashboard page ------------------------ */
  function initDashboardPage(){
    const user = getCurrentUser(); if(!user){ window.location.href = 'index.html'; return; }

    const profileInfo = document.getElementById('profile-info');
    const btnEditProfile = document.getElementById('btn-edit-profile');
    const formProfile = document.getElementById('form-profile');
    const inputName = document.getElementById('profile-name');
    const inputEmail = document.getElementById('profile-email');
    const cancelProfile = document.getElementById('cancel-profile');

    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', ()=>{ clearCurrentUser(); window.location.href = 'index.html'; });

    // Show profile
    renderProfile(user);

    btnEditProfile.addEventListener('click', ()=>{
      formProfile.classList.remove('hidden');
      inputName.value = user.name || '';
      inputEmail.value = user.email || '';
    });

    cancelProfile.addEventListener('click', ()=>{ formProfile.classList.add('hidden'); });

    formProfile.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = inputName.value.trim();
      const email = inputEmail.value.trim().toLowerCase();
      // Update in users list (simulated backend)
      const users = getUsers();
      const idx = users.findIndex(u=>u.id===user.id);
      if(idx!==-1){ users[idx].name = name; users[idx].email = email; saveUsers(users); }
      // update session
      setCurrentUser({ id: user.id, name, email });
      // re-render
      renderProfile({ id: user.id, name, email });
      formProfile.classList.add('hidden');
    });

    // Items CRUD
    const formItem = document.getElementById('form-item');
    const inputTitle = document.getElementById('item-title');
    const inputDesc = document.getElementById('item-desc');
    const itemList = document.getElementById('item-list');

    formItem.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const title = inputTitle.value.trim();
      const desc = inputDesc.value.trim();
      if(!title) return; // title required
      try{
        await createItem(user.id, {title, description: desc});
        inputTitle.value = ''; inputDesc.value = '';
        await refreshItems();
      }catch(err){ alert(err.message); }
    });

    async function refreshItems(){
      const items = await getItems(user.id);
      renderItems(items);
    }

    function renderProfile(userObj){
      profileInfo.innerHTML = `<strong>${escapeHtml(userObj.name||'—')}</strong><div class="muted">${escapeHtml(userObj.email||'—')}</div>`;
    }

    function renderItems(items){
      itemList.innerHTML = '';
      if(!items || items.length===0){ itemList.innerHTML = '<li class="muted">No items yet — add one above.</li>'; return; }
      for(const it of items){
        const li = document.createElement('li');
        const meta = document.createElement('div'); meta.className='meta';
        meta.innerHTML = `<strong>${escapeHtml(it.title)}</strong><div class="muted">${escapeHtml(it.description)}</div>`;

        const btns = document.createElement('div');

        const editBtn = document.createElement('button'); editBtn.className='icon-btn'; editBtn.title='Edit'; editBtn.innerText='✏️';
        const delBtn = document.createElement('button'); delBtn.className='icon-btn'; delBtn.title='Delete'; delBtn.innerText='🗑️';

        editBtn.addEventListener('click', ()=>{ openEditDialog(it); });
        delBtn.addEventListener('click', async ()=>{
          if(!confirm('Delete this item?')) return;
          await deleteItem(user.id, it.id); await refreshItems();
        });

        btns.appendChild(editBtn); btns.appendChild(delBtn);
        li.appendChild(meta); li.appendChild(btns);
        itemList.appendChild(li);
      }
    }

    function openEditDialog(item){
      // Use a simple prompt-based edit to keep UI minimal and dependency-free
      const newTitle = prompt('Edit title', item.title); if(newTitle===null) return; // cancel
      const newDesc = prompt('Edit description', item.description); if(newDesc===null) return;
      updateItem(user.id, item.id, { title: newTitle.trim(), description: newDesc.trim() }).then(()=>refreshItems());
    }

    // initial load
    refreshItems();
  }

  /* ------------------------ Small helpers ------------------------ */
  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  // Development helpers: expose a couple functions in console
  window.__demo = { getUsers, createUser, authenticate, getItems };

})();
