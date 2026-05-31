'use strict';

// ── State ────────────────────────────────────────────────────────────────────
const LS = {
  mealLog:     'ft_mealLog',
  purchased:   'ft_purchased',
  purchaseWeek:'ft_purchaseWeek',
  customItems: 'ft_customItems',
};

let currentPage       = 'home';
let planViewWeek      = 0; // 0 or 1
let planViewDayInWeek = 0; // 0–6 (Mon–Sun)

// ── Date / Cycle Helpers ─────────────────────────────────────────────────────
function todayDayIndex() {
  // 14-day rotating cycle anchored to Mon 2026-01-05
  const anchor = new Date('2026-01-05T00:00:00');
  const today  = new Date(); today.setHours(0,0,0,0);
  const diff   = Math.floor((today - anchor) / 86400000);
  return ((diff % 14) + 14) % 14; // 0–13
}

function dateKey(offsetDays = 0) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function isoWeek() {
  const d   = new Date();
  const thu = new Date(d);
  thu.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
  const jan4 = new Date(thu.getFullYear(), 0, 4);
  const wk   = 1 + Math.round(((thu - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return `${thu.getFullYear()}-W${String(wk).padStart(2,'0')}`;
}

function dayPlanForOffset(offset) {
  return MEAL_PLAN[(todayDayIndex() + offset) % 14];
}

function fmtDate(d) {
  return `${ui('weekdays')[d.getDay()]}, ${ui('months')[d.getMonth()]} ${d.getDate()}`;
}
function fmtShort(d) {
  return `${ui('months')[d.getMonth()]} ${d.getDate()}`;
}

// ── LocalStorage ─────────────────────────────────────────────────────────────
function getMealLog()       { return JSON.parse(localStorage.getItem(LS.mealLog)    || '{}'); }
function saveMealLog(v)     { localStorage.setItem(LS.mealLog,    JSON.stringify(v)); }
function getCustomItems()   { return JSON.parse(localStorage.getItem(LS.customItems)|| '[]'); }
function saveCustomItems(v) { localStorage.setItem(LS.customItems, JSON.stringify(v)); }

function getPurchased() {
  if (localStorage.getItem(LS.purchaseWeek) !== isoWeek()) {
    localStorage.setItem(LS.purchaseWeek, isoWeek());
    localStorage.setItem(LS.purchased, '{}');
    return {};
  }
  return JSON.parse(localStorage.getItem(LS.purchased) || '{}');
}
function savePurchased(v) { localStorage.setItem(LS.purchased, JSON.stringify(v)); }

// ── Shopping List ─────────────────────────────────────────────────────────────
function buildShoppingList(days = 3) {
  const agg = {};
  for (let d = 0; d < days; d++) {
    const plan = dayPlanForOffset(d);
    ['breakfast','lunch','dinner'].forEach(mt => {
      const meal = plan[mt];
      if (meal.isLeftover) return; // no shopping for reheated meals
      meal.ingredients.forEach(ing => {
        const key = ing.name.en.toLowerCase().replace(/\s+/g,'-');
        if (agg[key] && agg[key].unit === ing.unit) {
          agg[key].amount += ing.amount;
        } else if (!agg[key]) {
          agg[key] = { ...ing, key };
        } else {
          const altKey = `${key}--${ing.unit}`;
          if (agg[altKey]) agg[altKey].amount += ing.amount;
          else agg[altKey] = { ...ing, key: altKey };
        }
      });
    });
  }
  getCustomItems().forEach(item => { agg[item.id] = { ...item, key: item.id }; });
  return Object.values(agg);
}

function groupByCategory(items) {
  const g = {};
  items.forEach(i => { const c = i.category||'pantry'; (g[c]=g[c]||[]).push(i); });
  return g;
}

// ── Header Sync ───────────────────────────────────────────────────────────────
function applyLangToHeader() {
  document.documentElement.lang = lang;
  document.querySelector('.brand-name').textContent = ui('brand');
  document.querySelectorAll('.nav-btn').forEach(b => b.textContent = ui('nav_'+b.dataset.page));
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.page === currentPage));
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  document.getElementById('app').innerHTML =
    currentPage === 'home'     ? renderHome()     :
    currentPage === 'plan'     ? renderPlan()     :
                                 renderShopping();
  applyLangToHeader();
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function renderHome() {
  const today     = new Date();
  const todayPlan = MEAL_PLAN[todayDayIndex()];
  const mealLog   = getMealLog();
  const todayLog  = mealLog[dateKey()] || {};
  const purchased = getPurchased();
  const shopList  = buildShoppingList(3);
  const unpurchased = shopList.filter(i => !purchased[i.key]);

  const todayKcal = todayPlan.breakfast.kcal + todayPlan.lunch.kcal + todayPlan.dinner.kcal;
  const eatenKcal = ['breakfast','lunch','dinner']
    .filter(m => todayLog[m]).reduce((s,m) => s + todayPlan[m].kcal, 0);

  const boyRatio  = NUTRITION.boy.tdee  / NUTRITION.combined;
  const girlRatio = NUTRITION.girl.tdee / NUTRITION.combined;
  const d2 = new Date(); d2.setDate(d2.getDate()+2);
  const ICONS = { breakfast:'breakfast_lbl', lunch:'lunch_lbl', dinner:'dinner_lbl' };

  return `
<div class="page">
  <div class="page-header">
    <div>
      <div class="date-label">${fmtDate(today)}</div>
      <h1 class="page-title">${ui('dashboard')}</h1>
    </div>
    <span class="pill pill--green">${todayKcal.toLocaleString()} ${ui('kcal_today')}</span>
  </div>

  ${unpurchased.length > 0 ? `
  <div class="card card--warn">
    <div class="alert-head">
      <span class="alert-icon">🛒</span>
      <div class="alert-text">
        <div class="alert-title">${ui('shopping_needed')}</div>
        <div class="alert-sub">${ui('next_3_days')} · ${ui('until')} ${fmtShort(d2)}</div>
      </div>
      <span class="pill pill--amber">${unpurchased.length} ${ui('items')}</span>
    </div>
    <div class="alert-list">
      ${unpurchased.slice(0,5).map(i=>`
        <div class="alert-row">
          <span>${CATEGORIES[i.category]?.icon||'📦'} ${t(i.name)}</span>
          <span class="badge">${i.amount} ${i.unit}</span>
        </div>`).join('')}
      ${unpurchased.length>5?`<p class="alert-more">+${unpurchased.length-5} ${ui('items')}…</p>`:''}
    </div>
    <button class="btn btn--primary" data-goto="shopping">${ui('view_shopping')}</button>
  </div>
  ` : `
  <div class="card card--ok">
    <span class="ok-icon">✅</span>
    <div><div class="ok-title">${ui('all_stocked')}</div><div class="ok-sub">${ui('all_stocked_sub')}</div></div>
  </div>`}

  <div class="card">
    <div class="card-title">${ui('today_meals')} · ${t(todayPlan.dayName)}</div>
    <div class="progress-row">
      <div class="bar"><div class="bar__fill" style="width:${todayKcal?Math.round(eatenKcal/todayKcal*100):0}%"></div></div>
      <span class="bar-label">${eatenKcal.toLocaleString()} / ${todayKcal.toLocaleString()} ${ui('kcal_eaten')}</span>
    </div>
    ${['breakfast','lunch','dinner'].map(mt => {
      const meal=todayPlan[mt], eaten=todayLog[mt];
      const iconEmoji = ui(ICONS[mt]).split(' ')[0];
      const iconLabel = ui(ICONS[mt]).split(' ').slice(1).join(' ');
      return `
      <div class="meal-row${eaten?' meal-row--eaten':''}${meal.isLeftover?' meal-row--leftover':''}">
        <div class="meal-left">
          <span class="meal-icon">${iconEmoji}</span>
          <div>
            <div class="meal-type">${iconLabel}${meal.isLeftover?` <span class="tag-leftover">${ui('leftover_tag')}</span>`:''}</div>
            <div class="meal-name">${t(meal.name)}</div>
          </div>
        </div>
        <div class="meal-right">
          <span class="meal-kcal">${meal.kcal.toLocaleString()} ${ui('kcal')}</span>
          <button class="eat-btn${eaten?' eat-btn--done':''}" data-date="${dateKey()}" data-meal="${mt}">
            ${eaten?ui('eaten'):ui('mark_eaten')}
          </button>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div class="card">
    <div class="card-title">${ui('daily_nutrition')}</div>
    <div class="activity-note">${ui('activity')}</div>
    <div class="nutr-grid">
      <div class="nutr-cell">
        <div class="nutr-label">${ui('combined')}</div>
        <div class="nutr-value">${todayKcal.toLocaleString()}</div>
        <div class="nutr-unit">${ui('kcal_day')}</div>
      </div>
      <div class="nutr-cell">
        <div class="nutr-label">${ui('boy')}</div>
        <div class="nutr-value">${Math.round(todayKcal*boyRatio).toLocaleString()}</div>
        <div class="nutr-unit">${ui('kcal')} · ${ui('tdee_label')} ${NUTRITION.boy.tdee.toLocaleString()}</div>
      </div>
      <div class="nutr-cell">
        <div class="nutr-label">${ui('girl')}</div>
        <div class="nutr-value">${Math.round(todayKcal*girlRatio).toLocaleString()}</div>
        <div class="nutr-unit">${ui('kcal')} · ${ui('tdee_label')} ${NUTRITION.girl.tdee.toLocaleString()}</div>
      </div>
    </div>
  </div>
</div>`;
}

// ── Meal Plan Page ────────────────────────────────────────────────────────────
function renderPlan() {
  const dayIdx  = planViewWeek * 7 + planViewDayInWeek;
  const plan    = MEAL_PLAN[dayIdx];
  const ICONS   = { breakfast:'breakfast_lbl', lunch:'lunch_lbl', dinner:'dinner_lbl' };
  const weekDays= MEAL_PLAN.slice(planViewWeek*7, planViewWeek*7+7);

  return `
<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">${ui('meal_plan')}</h1>
      <div class="date-label">${ui('raw_note')}</div>
    </div>
  </div>

  <div class="week-tabs">
    <button class="week-tab${planViewWeek===0?' week-tab--active':''}" data-week="0">${ui('week1')}</button>
    <button class="week-tab${planViewWeek===1?' week-tab--active':''}" data-week="1">${ui('week2')}</button>
  </div>

  <div class="day-tabs">
    ${weekDays.map((d,i)=>`
      <button class="day-tab${i===planViewDayInWeek?' day-tab--active':''}" data-day="${i}">
        ${t(d.shortName)}
      </button>`).join('')}
  </div>

  ${['breakfast','lunch','dinner'].map(mt => {
    const meal = plan[mt];
    const isLO = meal.isLeftover;
    const isBatch = meal.servings > 1;
    return `
    <div class="card${isLO?' card--leftover':''}">
      <div class="meal-card-head">
        <span class="meal-card-type">${ui(ICONS[mt])}</span>
        <div class="meal-card-badges">
          ${isLO ? `<span class="pill pill--gray">${ui('leftover_tag')}</span>` :
                   `<span class="pill pill--green">${meal.kcal.toLocaleString()} ${ui('kcal')}</span>`}
          ${isBatch ? `<span class="pill pill--purple">${ui('batch_tag')}</span>` : ''}
        </div>
      </div>
      <div class="meal-card-name">${t(meal.name)}</div>
      ${meal.note ? `<div class="batch-note">${t(meal.note)}</div>` : ''}
      ${isLO ? `<p class="leftover-note">${ui('leftover_note')}</p>` : `
      <table class="ing-table">
        <thead><tr><th>${ui('ingredient_raw')}</th><th>${ui('amount_col')}</th></tr></thead>
        <tbody>
          ${meal.ingredients.map(ing=>`
            <tr>
              <td>${CATEGORIES[ing.category]?.icon||'📦'} ${t(ing.name)}</td>
              <td class="ing-amount">${ing.amount} ${ing.unit}</td>
            </tr>`).join('')}
        </tbody>
      </table>`}
    </div>`;
  }).join('')}
</div>`;
}

// ── Shopping Page ─────────────────────────────────────────────────────────────
function renderShopping() {
  const shopList  = buildShoppingList(3);
  const purchased = getPurchased();
  const groups    = groupByCategory(shopList);
  const catOrder  = Object.keys(CATEGORIES).filter(c => groups[c]);
  const total = shopList.length;
  const done  = shopList.filter(i => purchased[i.key]).length;
  const pct   = total > 0 ? Math.round(done/total*100) : 0;
  const today = new Date();
  const d2    = new Date(); d2.setDate(d2.getDate()+2);

  return `
<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">${ui('shopping_list')}</h1>
      <div class="date-label">${fmtShort(today)} – ${fmtShort(d2)} · ${ui('next_3_days')}</div>
    </div>
  </div>
  <div class="card">
    <div class="progress-head">
      <span>${done} ${ui('of')} ${total} ${ui('items_purchased')}</span>
      <span class="pill pill--green">${pct}%</span>
    </div>
    <div class="bar bar--thick"><div class="bar__fill" style="width:${pct}%"></div></div>
    <div style="display:flex;justify-content:flex-end;margin-top:10px">
      <button class="btn btn--ghost" id="clear-purchased">${ui('clear_purchased')}</button>
    </div>
  </div>
  ${catOrder.map(cat => {
    const items=groups[cat], catInfo=CATEGORIES[cat];
    const catDone=items.filter(i=>purchased[i.key]).length;
    return `
    <div class="card">
      <div class="cat-head">
        <span>${catInfo.icon} ${ui(catInfo.labelKey)}</span>
        <span class="cat-count">${catDone}/${items.length}</span>
      </div>
      ${items.map(item=>`
        <label class="shop-item${purchased[item.key]?' shop-item--done':''}">
          <input type="checkbox" class="shop-cb" data-key="${item.key}"${purchased[item.key]?' checked':''}>
          <span class="shop-name">${t(item.name)}</span>
          <span class="shop-qty">${item.amount} ${item.unit}</span>
          ${item.isCustom?`<button class="icon-btn rm-custom" data-id="${item.id}" title="Remove">✕</button>`:''}
        </label>`).join('')}
    </div>`;
  }).join('')}
  <div class="card">
    <div class="card-title">${ui('add_custom')}</div>
    <div class="custom-form">
      <input id="custom-name"   type="text"   class="input"       placeholder="${ui('item_name')}">
      <input id="custom-amount" type="number" class="input input--sm" placeholder="${ui('qty_ph')}" min="0" step="any">
      <input id="custom-unit"   type="text"   class="input input--xs" value="g">
      <button class="btn btn--primary" id="add-custom">${ui('add_btn')}</button>
    </div>
  </div>
</div>`;
}

// ── Event Delegation ──────────────────────────────────────────────────────────
function initEvents() {
  document.querySelector('.lang-switcher').addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return; setLang(btn.dataset.lang); render();
  });

  document.querySelector('nav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    currentPage = btn.dataset.page;
    if (currentPage === 'plan') {
      const idx = todayDayIndex();
      planViewWeek = Math.floor(idx/7);
      planViewDayInWeek = idx%7;
    }
    render();
  });

  const app = document.getElementById('app');

  app.addEventListener('click', e => {
    const goto = e.target.closest('[data-goto]');
    if (goto) { currentPage=goto.dataset.goto; render(); return; }

    const eatBtn = e.target.closest('.eat-btn');
    if (eatBtn) {
      const {date,meal}=eatBtn.dataset;
      const log=getMealLog(); if(!log[date])log[date]={};
      log[date][meal]=!log[date][meal]; saveMealLog(log); render(); return;
    }

    const weekTab = e.target.closest('.week-tab');
    if (weekTab) { planViewWeek=+weekTab.dataset.week; render(); return; }

    const dayTab = e.target.closest('.day-tab');
    if (dayTab) { planViewDayInWeek=+dayTab.dataset.day; render(); return; }

    if (e.target.id==='clear-purchased') { savePurchased({}); render(); return; }

    if (e.target.id==='add-custom') {
      const name=document.getElementById('custom-name').value.trim();
      const amount=parseFloat(document.getElementById('custom-amount').value)||1;
      const unit=document.getElementById('custom-unit').value.trim()||'g';
      if (!name) return;
      const items=getCustomItems();
      items.push({id:`custom-${Date.now()}`,name:{en:name,uk:name},amount,unit,category:'pantry',isCustom:true});
      saveCustomItems(items); render(); return;
    }

    const rmBtn = e.target.closest('.rm-custom');
    if (rmBtn) {
      e.preventDefault();
      const id=rmBtn.dataset.id;
      saveCustomItems(getCustomItems().filter(i=>i.id!==id));
      const p=getPurchased(); delete p[id]; savePurchased(p); render();
    }
  });

  app.addEventListener('change', e => {
    const cb=e.target.closest('.shop-cb');
    if (!cb) return;
    const p=getPurchased(); p[cb.dataset.key]=cb.checked; savePurchased(p);
    cb.closest('.shop-item').classList.toggle('shop-item--done',cb.checked);
    const card=cb.closest('.card');
    const tot=card.querySelectorAll('.shop-cb').length;
    const dn=card.querySelectorAll('.shop-cb:checked').length;
    card.querySelector('.cat-count').textContent=`${dn}/${tot}`;
    updateProgressDisplay();
  });
}

function updateProgressDisplay() {
  const shopList=buildShoppingList(3), purchased=getPurchased();
  const total=shopList.length, done=shopList.filter(i=>purchased[i.key]).length;
  const pct=total>0?Math.round(done/total*100):0;
  const headSpan=document.querySelector('.progress-head span:not(.pill)');
  const fill=document.querySelector('.bar--thick .bar__fill');
  const pill=document.querySelector('.progress-head .pill');
  if(headSpan) headSpan.textContent=`${done} ${ui('of')} ${total} ${ui('items_purchased')}`;
  if(fill) fill.style.width=pct+'%';
  if(pill) pill.textContent=pct+'%';
}

document.addEventListener('DOMContentLoaded', () => {
  const idx=todayDayIndex();
  planViewWeek=Math.floor(idx/7);
  planViewDayInWeek=idx%7;
  render(); initEvents();
});
