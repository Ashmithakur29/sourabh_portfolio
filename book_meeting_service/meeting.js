(function(){
  const meta = window.SERVICE_META || {title:"Service", durationMins:30, priceNow:499, priceOld:null};

  // ---- Date buttons (next 5 days)
  const dateRow = document.getElementById('dateRow');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const today = new Date();
  for(let i=0;i<5;i++){
    const d = new Date(today); d.setDate(today.getDate()+i);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'date-btn';
    btn.setAttribute('role','radio');
    btn.setAttribute('aria-checked','false');
    btn.dataset.iso = d.toISOString();
    btn.innerHTML = `<div>${days[d.getDay()]}</div><strong>${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}</strong>`;
    btn.addEventListener('click', () => selectDate(btn));
    dateRow.appendChild(btn);
    if(i===0) selectDate(btn);
  }

  function selectDate(btn){
    document.querySelectorAll('.date-btn').forEach(b => {
      b.classList.toggle('is-selected', b===btn);
      b.setAttribute('aria-checked', b===btn ? 'true' : 'false');
    });
  }

  // ---- Time slots
  const timeGrid = document.getElementById('timeGrid');
  const slots = ['09:30 AM','02:00 PM','06:30 PM','07:30 PM','09:30 PM'];
  slots.forEach(t=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='time-btn';
    b.setAttribute('role','radio');
    b.setAttribute('aria-checked','false');
    b.textContent=t;
    b.addEventListener('click',()=>selectTime(b));
    timeGrid.appendChild(b);
  });
  function selectTime(btn){
    document.querySelectorAll('.time-btn').forEach(b=>{
      b.classList.toggle('is-selected', b===btn);
      b.setAttribute('aria-checked', b===btn ? 'true' : 'false');
    });
  }

  // ---- Continue → show checkout
  const continueBtn = document.getElementById('continueBtn');
  const scheduleCard = document.getElementById('schedule-card');
  const checkoutCard = document.getElementById('checkout-card');
  continueBtn.addEventListener('click', ()=>{
    // basic guard: require date & time
    const pickedDate = document.querySelector('.date-btn.is-selected');
    const pickedTime = document.querySelector('.time-btn.is-selected');
    if(!pickedDate || !pickedTime){
      alert('Please pick a date and time.');
      return;
    }
    // populate summary
    document.getElementById('summaryTitle').textContent = `1 × ${meta.title}`;
    document.getElementById('summaryPrice').textContent = `₹${meta.priceNow}`;
    document.getElementById('summaryTotal').textContent = `₹${meta.priceNow + 10}`;
    scheduleCard.classList.add('hidden');
    checkoutCard.classList.remove('hidden');
    checkoutCard.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // ---- Fake submit (you can wire to backend / payment later)
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Booking confirmed! (demo)');
  });

})();
