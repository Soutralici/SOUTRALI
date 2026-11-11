(function(){var K=window.K;
function cur(){var t=document.documentElement.getAttribute("data-theme");if(t)return t;return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
function svg(p){return'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
var SUN=svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
var MOON=svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
K.themeIcon=function(){var b=K.$("#th");if(!b)return;var d=cur()==="dark";b.innerHTML=d?SUN:MOON;b.setAttribute("aria-label",d?"Passer au mode clair":"Passer au mode sombre")};
K.acts.theme=function(){var n=cur()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("sou_theme",n)}catch(e){}K.themeIcon()};
K.themeIcon();
function count(){var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".tile b[data-n]").forEach(function(e){var n=+e.dataset.n,t0=null;if(rm||n<2)return;
function f(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/800,1);e.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString("fr-FR");if(p<1)requestAnimationFrame(f)}
requestAnimationFrame(f)})}
function dash(){
var u=K.S.user,name=(K.S.me&&K.S.me.name)||"";
var p1=K.sb.from("missions").select("price").eq("status","ouverte").limit(1000).then(function(r){var l=r.data||[];return{n:l.length,s:l.reduce(function(a,m){return a+m.price},0)}});
var p2=u?K.sb.from("missions").select("id",{count:"exact",head:true}).in("status",["ouverte","prise"]).or("owner.eq."+u.id+",taker.eq."+u.id).then(function(r){return r.count||0}):Promise.resolve(0);
return Promise.all([p1,p2]).then(function(a){
var t='<div class="tiles"><div class="tile"><b data-n="'+a[0].n+'">'+a[0].n+'</b><span>missions ouvertes</span></div><div class="tile"><b data-n="'+a[0].s+'">'+a[0].s.toLocaleString("fr-FR")+'</b><span>FCFA à gagner</span></div>'+(u?'<div class="tile"><b data-n="'+a[1]+'">'+a[1]+'</b><span>mes missions en cours</span></div>':'')+'</div>';
if(u)return'<section class="dash" aria-label="Tableau de bord"><p class="dh">Bonjour, '+K.esc(name||"toi")+'</p>'+t+'<div class="qa"><button class="btn" data-go="new">Publier une mission</button><button class="btn alt" data-go="mine">Mes missions</button></div></section>';
return'<section class="dash" aria-label="Bienvenue"><p class="dh">Bienvenue sur Soutrali</p><p class="ds">Trouve un petit boulot ou fais faire une tâche près de chez toi.</p>'+t+'<div class="qa"><button class="btn" data-act="gosignup">Créer mon compte</button><button class="btn alt" data-go="how">Comment ça marche</button></div></section>'})}
var oh=K.views.home;
K.views.home=function(){return Promise.resolve(oh()).then(dash).then(function(h){var a=K.$("#app");if(!a||K.S.view!=="home")return;a.insertAdjacentHTML("afterbegin",h);count()})};
K.acts.gosignup=function(){K.S.mode="signup";K.go("auth")};
K.views.how=function(){
K.app('<h1>Comment ça marche</h1><p class="sub">Soutrali met en relation des personnes qui ont une tâche à faire et des jeunes qui cherchent un petit boulot.</p><h2>Tu as une tâche à faire</h2><ol class="steps"><li>Publie la mission avec un titre clair, ton quartier et le prix que tu proposes.</li><li>Un jeune la prend. Vous vous écrivez sur WhatsApp.</li><li>Tu le paies quand le travail est fait, puis tu marques la mission comme terminée.</li></ol><h2>Tu cherches un petit boulot</h2><ol class="steps"><li>Choisis une mission près de toi.</li><li>Prends-la, puis écris au client sur WhatsApp pour fixer les détails.</li><li>Fais le travail et fais-toi payer.</li></ol><div class="note">Le paiement se règle directement entre vous, par Mobile Money ou en espèces. Soutrali ne touche pas à l’argent.</div><button class="btn" data-go="home">Voir les missions</button>')};
})();
// FIN app5.js
