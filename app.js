const state = {
  user: null,
  page: 'auth',
  friends: ['bob', 'carol'],
  users: ['alice', 'bob', 'carol', 'daniel', 'emma', 'frank'],
  dm: {
    bob: [
      { from: 'bob', text: 'Hey, ready for the assignment?' },
      { from: 'me', text: 'Yep, let us split the work.' }
    ]
  },
  groups: [
    { id: 'g1', name: 'INFO2222 Team 7', members: ['alice', 'bob', 'carol', 'daniel'], messages: [{ from: 'carol', text: 'Draft slides uploaded!' }] }
  ],
  meeting: {
    slots: ['Mon 10:00', 'Mon 11:00', 'Tue 14:00', 'Tue 15:00', 'Wed 09:00', 'Wed 10:00'],
    availability: {
      alice: ['Mon 10:00', 'Tue 14:00', 'Wed 10:00'],
      bob: ['Mon 11:00', 'Tue 14:00', 'Wed 10:00'],
      carol: ['Tue 14:00', 'Tue 15:00', 'Wed 10:00'],
      daniel: ['Mon 10:00', 'Tue 14:00', 'Wed 10:00']
    }
  }
};

const menuItems = [
  ['friends', 'Friend Search & Add'],
  ['dm', 'Direct Messaging'],
  ['group', 'Group Chat'],
  ['voice', 'Voice Chat Mock'],
  ['docs', 'Collaborative Docs Mock'],
  ['meeting', 'Meeting Planner']
];

const authBadge = document.getElementById('authBadge');
const content = document.getElementById('content');
const menu = document.getElementById('menu');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.onclick = () => {
  state.user = null;
  state.page = 'auth';
  render();
};

function render() {
  authBadge.textContent = state.user ? `Logged in: ${state.user}` : 'Guest';
  menu.innerHTML = '';

  if (!state.user) {
    const tpl = document.getElementById('authTpl').content.cloneNode(true);
    content.innerHTML = '';
    content.appendChild(tpl);

    const tabs = content.querySelectorAll('[data-auth]');
    let mode = 'login';
    const regOnly = content.querySelector('.register-only');

    tabs.forEach(btn => btn.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.auth;
      regOnly.classList.toggle('hidden', mode !== 'register');
    });

    content.querySelector('#authForm').onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.user = fd.get('username') || 'student';
      if (!state.users.includes(state.user)) state.users.push(state.user);
      state.page = 'friends';
      render();
    };
    return;
  }

  menuItems.forEach(([key, label]) => {
    const btn = document.createElement('button');
    btn.className = `btn ${state.page === key ? 'active' : ''}`;
    btn.textContent = label;
    btn.onclick = () => { state.page = key; render(); };
    menu.appendChild(btn);
  });

  const views = {
    friends: renderFriends,
    dm: renderDM,
    group: renderGroup,
    voice: renderVoice,
    docs: renderDocs,
    meeting: renderMeeting
  };
  views[state.page]?.();
}

function renderFriends() {
  content.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <h2>Find users</h2>
        <input id="searchUser" placeholder="Search username..." />
        <div id="searchResults" class="list" style="margin-top:10px"></div>
      </div>
      <div class="card">
        <h2>My friends</h2>
        <div class="list" id="friendList"></div>
      </div>
    </div>
  `;

  const friendList = content.querySelector('#friendList');
  const renderFriendList = () => {
    friendList.innerHTML = state.friends.map(f => `<div class="item"><span>@${f}</span><span class="pill">Friend</span></div>`).join('') || '<p class="small">No friends yet.</p>';
  };
  renderFriendList();

  const results = content.querySelector('#searchResults');
  content.querySelector('#searchUser').oninput = e => {
    const q = e.target.value.toLowerCase();
    const matches = state.users.filter(u => u !== state.user && u.includes(q));
    results.innerHTML = matches.map(u => `
      <div class="item">
        <span>@${u}</span>
        <button class="btn" data-add="${u}">${state.friends.includes(u) ? 'Added' : 'Add Friend'}</button>
      </div>
    `).join('');

    results.querySelectorAll('[data-add]').forEach(btn => btn.onclick = () => {
      const u = btn.dataset.add;
      if (!state.friends.includes(u)) state.friends.push(u);
      renderFriends();
    });
  };
}

function renderDM() {
  const peer = state.friends[0] || 'bob';
  const msgs = state.dm[peer] || [];
  content.innerHTML = `
    <div class="card">
      <h2>Direct Messages</h2>
      <p class="small">Only available between mutual friends (prototype rule).</p>
      <label>Chat with
        <select id="peerSel">${state.friends.map(f => `<option>${f}</option>`).join('')}</select>
      </label>
      <div class="chat-window" id="dmWindow">
        ${msgs.map(m => `<div class="msg ${m.from === 'me' ? 'me' : ''}"><b>${m.from}:</b> ${m.text}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="dmInput" placeholder="Type a message" />
        <button class="btn primary" id="sendDm">Send</button>
      </div>
    </div>
  `;

  const sel = content.querySelector('#peerSel');
  sel.value = peer;
  sel.onchange = () => renderDMWith(sel.value);
  content.querySelector('#sendDm').onclick = () => {
    const target = sel.value;
    const txt = content.querySelector('#dmInput').value.trim();
    if (!txt) return;
    state.dm[target] = state.dm[target] || [];
    state.dm[target].push({ from: 'me', text: txt });
    content.querySelector('#dmInput').value = '';
    renderDMWith(target);
  };
}

function renderDMWith(target) {
  state.page = 'dm';
  const msgs = state.dm[target] || [];
  content.innerHTML = `
    <div class="card">
      <h2>Direct Messages with @${target}</h2>
      <div class="chat-window">${msgs.map(m => `<div class="msg ${m.from === 'me' ? 'me' : ''}"><b>${m.from}:</b> ${m.text}</div>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="dmInput" placeholder="Type a message" />
        <button class="btn primary" id="sendDm">Send</button>
      </div>
    </div>
  `;
  content.querySelector('#sendDm').onclick = () => {
    const txt = content.querySelector('#dmInput').value.trim();
    if (!txt) return;
    state.dm[target] = state.dm[target] || [];
    state.dm[target].push({ from: 'me', text: txt });
    renderDMWith(target);
  };
}

function renderGroup() {
  const g = state.groups[0];
  content.innerHTML = `
    <div class="card">
      <h2>${g.name}</h2>
      <p class="small">Group members (friendship not required): ${g.members.map(m => '@' + m).join(', ')}</p>
      <div class="chat-window" id="gWindow">
        ${g.messages.map(m => `<div class="msg ${m.from === 'me' ? 'me' : ''}"><b>${m.from}:</b> ${m.text}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="gInput" placeholder="Message the group" />
        <button class="btn primary" id="sendG">Send</button>
      </div>
    </div>
  `;
  content.querySelector('#sendG').onclick = () => {
    const txt = content.querySelector('#gInput').value.trim();
    if (!txt) return;
    g.messages.push({ from: 'me', text: txt });
    renderGroup();
  };
}

function renderVoice() {
  content.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <h2>Direct Voice Chat (Mock)</h2>
        <p class="small">No real audio implementation in Phase 1.</p>
        <button class="btn primary" onclick="alert('Mock: Starting direct call...')">Start Direct Call</button>
      </div>
      <div class="card">
        <h2>Group Voice Room (Mock)</h2>
        <div class="list">
          <div class="item"><span>@alice</span><span class="pill">Connected</span></div>
          <div class="item"><span>@bob</span><span class="pill">Connected</span></div>
          <div class="item"><span>@carol</span><span class="pill">Muted</span></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn primary" onclick="alert('Mock: Joined voice room')">Join Room</button>
          <button class="btn" onclick="alert('Mock: Toggled mute')">Mute/Unmute</button>
          <button class="btn" onclick="alert('Mock: Left room')">Leave</button>
        </div>
      </div>
    </div>
  `;
}

function renderDocs() {
  content.innerHTML = `
    <div class="card">
      <h2>Collaborative Workspace (Mock)</h2>
      <p class="small">Share and co-edit text / spreadsheet / slides (simulated realtime).</p>
      <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end">
        <label>Document Type
          <select id="docType">
            <option>Text Document</option>
            <option>Spreadsheet</option>
            <option>Slides</option>
          </select>
        </label>
        <button class="btn">Invite Collaborators</button>
      </div>
      <textarea class="doc-area" id="docArea">Team notes:\n- Problem statement\n- UI wireframe\n- Demo script</textarea>
      <p class="small">Simulated collaborators: @bob typing..., @carol online</p>
    </div>
  `;

  const docArea = content.querySelector('#docArea');
  setTimeout(() => {
    if (!docArea) return;
    docArea.value += '\n[Auto-sync] @bob: Added API integration ideas.';
  }, 2500);
}

function renderMeeting() {
  const { slots, availability } = state.meeting;
  const allUsers = Object.keys(availability);

  content.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <h2>Leader: Create Meeting Request</h2>
        <label>Preferred time window<input value="Mon-Wed, 09:00-16:00" /></label>
        <label>Duration
          <select><option>30 minutes</option><option selected>60 minutes</option><option>90 minutes</option></select>
        </label>
        <button class="btn primary" id="loadAvail">Load member availability</button>
      </div>
      <div class="card">
        <h2>Members Select Available Slots</h2>
        <p class="small">Ticked slots represent all selected availabilities (mock data).</p>
        <div class="slot-grid" id="slotGrid"></div>
        <div id="bestSlot" style="margin-top:10px"></div>
      </div>
    </div>
  `;

  const grid = content.querySelector('#slotGrid');
  slots.forEach(slot => {
    const count = allUsers.filter(u => availability[u].includes(slot)).length;
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerHTML = `${slot}<br/><span class='small'>${count}/${allUsers.length} available</span>`;
    if (count === Math.max(...slots.map(s => allUsers.filter(u => availability[u].includes(s)).length))) div.classList.add('suggested');
    div.onclick = () => div.classList.toggle('selected');
    grid.appendChild(div);
  });

  content.querySelector('#loadAvail').onclick = () => {
    const tally = slots.map(s => [s, allUsers.filter(u => availability[u].includes(s)).length]);
    const best = tally.sort((a, b) => b[1] - a[1])[0];
    content.querySelector('#bestSlot').innerHTML = `<div class='pill'>Suggested meeting time: <b>${best[0]}</b> (${best[1]}/${allUsers.length} members)</div>`;
  };
}

render();
