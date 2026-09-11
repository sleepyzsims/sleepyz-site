const state={age:'all',item:'all',type:'all',hair:'all'};
const labels={
  age:{all:'All',adult:'Adult',child:'Child',toddler:'Toddler',infant:'Infant'},
  item:{all:'All',hair:'Hair',clothes:'Clothes',shoes:'Shoes',accessory:'Accessory'},
  type:{all:'All',conversion:'Conversion',new:'New Mesh',recolor:'Recolor'},
  hair:{all:'All',straight:'Straight','curly/wavy':'Curly/Wavy',updo:'Updo','braids/twists':'Braids/Twists'}
};
function norm(v){return String(v??'').toLowerCase().trim()}
function asArray(v){
  if(Array.isArray(v)) return v;
  if(v===undefined||v===null||v==='') return [];
  return [v];
}
function makeFilterRow(key,container){
  const row=document.createElement('div');
  row.className='filter-row';
  const label=document.createElement('div');
  label.className='filter-label';
  label.textContent=key==='hair'?'Hair Type':key[0].toUpperCase()+key.slice(1);
  row.append(label);
  Object.entries(labels[key]).forEach(([value,text])=>{
    const b=document.createElement('button');
    b.className='filter-btn'+(state[key]===value?' selected':'');
    b.textContent=text;
    b.onclick=()=>{state[key]=value;render();};
    row.append(b)
  });
  container.append(row)
}
function displayLabel(group,value){
  const key=norm(value);
  return labels[group]?.[key] || value;
}
function card(item){
  const c=document.createElement('article');
  c.className='card';
  const img=document.createElement('img');
  img.className='thumb'; img.loading='lazy'; img.src=item.image||''; img.alt=item.name||''; c.append(img);
  const h=document.createElement('div'); h.className='card-title'; h.textContent=item.name||'Untitled'; c.append(h);
  if(item.subtitle){const s=document.createElement('div');s.className='subtitle';s.textContent=item.subtitle;c.append(s)}
  if(item.description){const d=document.createElement('div');d.className='description';d.textContent=item.description;c.append(d)}
  const tags=document.createElement('div'); tags.className='meta';
  asArray(item.ages).filter(Boolean).forEach(x=>{const t=document.createElement('span');t.className='tag';t.textContent=displayLabel('age',x);tags.append(t)});
  if(item.item){const t=document.createElement('span');t.className='tag';t.textContent=displayLabel('item',item.item);tags.append(t)}
  asArray(item.types).filter(Boolean).forEach(x=>{const t=document.createElement('span');t.className='tag';t.textContent=displayLabel('type',x);tags.append(t)});
  asArray(item.hair_type).filter(Boolean).forEach(x=>{const t=document.createElement('span');t.className='tag';t.textContent=displayLabel('hair',x);tags.append(t)});
  c.append(tags);
  const cr=document.createElement('div');cr.className='credit';
  if(item.creator){cr.textContent='Original Creator: ';if(item.creator_url){const a=document.createElement('a');a.href=item.creator_url;a.target='_blank';a.rel='noopener';a.textContent=item.creator;cr.append(a)}else cr.append(document.createTextNode(item.creator));}
  c.append(cr);
  if(item.download){const a=document.createElement('a');a.className='download';a.href=item.download;a.target='_blank';a.rel='noopener';a.textContent='Download';c.append(a)}
  return c
}
async function load(){const r=await fetch('/content/cc.json?'+Date.now());const data=await r.json();window.catalog=data.items||[];render()}
function render(){
  const root=document.querySelector('#catalog');if(!root)return;
  const f=window.catalog||[];
  const shown=f.filter(x=>
    (state.age==='all'||asArray(x.ages).map(norm).includes(norm(state.age)))&&
    (state.item==='all'||norm(x.item)===norm(state.item))&&
    (state.type==='all'||asArray(x.types).map(norm).includes(norm(state.type)))&&
    (state.hair==='all'||asArray(x.hair_type).map(norm).includes(norm(state.hair)))
  );
  root.innerHTML='';
  if(!shown.length){root.innerHTML='<div class="empty">No CC matches those filters.</div>';return}
  shown.forEach(x=>root.append(card(x)))
}
function initFilters(){const box=document.querySelector('#filters');if(!box)return;['age','item','type','hair'].forEach(k=>makeFilterRow(k,box))}
async function loadResources(){const root=document.querySelector('#resources');if(!root)return;const r=await fetch('/content/resources.json?'+Date.now());const data=await r.json();root.innerHTML='';(data.items||[]).forEach(x=>{const a=document.createElement('article');a.className='resource';if(x.image){const im=document.createElement('img');im.src=x.image;im.alt='';a.append(im)}const h=document.createElement('h2');h.textContent=x.name;a.append(h);if(x.description){const p=document.createElement('p');p.textContent=x.description;a.append(p)}if(x.link){const l=document.createElement('a');l.href=x.link;l.target='_blank';l.rel='noopener';l.textContent='Visit';a.append(l)}root.append(a)});if(!data.items?.length)root.innerHTML='<div class="empty">Resources will be added here.</div>'}
document.addEventListener('DOMContentLoaded',()=>{initFilters();load();loadResources()});
