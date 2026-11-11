(function(){
var K=window.K={views:{},acts:{}};
K.CATS=["Livraison","Courses","Déménagement","Montage et réparation","Nettoyage","Autre"];
K.QUA=["Abobo","Adjamé","Attécoubé","Cocody","Koumassi","Marcory","Plateau","Port-Bouët","Treichville","Yopougon"];
K.SL={ouverte:"Ouverte",prise:"Prise",terminee:"Terminée",annulee:"Annulée"};
K.S={view:"home",id:null,cat:"Toutes",q:"Tous",mode:"login",user:null,me:null,tries:0,lock:0};
K.$=function(s){return document.querySelector(s)};
K.esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
K.fcfa=function(n){return Number(n).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g," ")+" FCFA"};
K.ago=function(iso){var m=Math.round((Date.now()-new Date(iso).getTime())/60000);if(m<2)return"à l’instant";if(m<60)return"il y a "+m+" min";var h=Math.round(m/60);if(h<24)return"il y a "+h+" h";return"il y a "+Math.round(h/24)+" j"};
K.phone=function(s){return String(s||"").replace(/\D/g,"").replace(/^225/,"")};
K.toast=function(t){var e=K.$("#toast");e.textContent=t;e.hidden=false;clearTimeout(K.th);K.th=setTimeout(function(){e.hidden=true},3200)};
K.msg=function(e){var m=e&&e.message?e.message:"";if(/Invalid login/i.test(m))return"E-mail ou mot de passe incorrect.";if(/already registered/i.test(m))return"Cet e-mail a déjà un compte. Connecte-toi.";if(/rate limit/i.test(m))return"Trop d’essais. Attends quelques minutes.";if(/Failed to fetch|NetworkError/i.test(m))return"Pas de connexion. Vérifie ton réseau.";return m||"Une erreur est survenue. Réessaie."};
K.app=function(h){K.$("#app").innerHTML=h};
K.fe=function(t){var e=K.$("#fe");if(e)e.innerHTML='<p class="err" role="alert">'+K.esc(t)+'</p>';else K.toast(t)};
K.opts=function(a,sel){return a.map(function(x){return'<option'+(x===sel?" selected":"")+'>'+K.esc(x)+'</option>'}).join("")};
K.card=function(m){return'<button class="card" data-open="'+m.id+'"><span class="st '+m.status+'">'+K.SL[m.status]+'</span><b>'+K.esc(m.title)+'</b><span class="meta">'+K.esc(m.category)+' · '+K.esc(m.quartier)+' · '+K.ago(m.created_at)+'</span><div class="price">'+K.fcfa(m.price)+'</div></button>'};
function ic(p){return'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
K.IC={home:ic('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),new:ic('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),mine:ic('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>')};
K.bar=function(){var v=K.S.view,a=v==="detail"?"home":(v==="admin"?"mine":v);
K.$("#bar").innerHTML=[["home","Missions"],["new","Publier"],["mine","Mes missions"]].map(function(x){return'<button data-go="'+x[0]+'"'+(a===x[0]?' aria-current="page"':"")+'>'+K.IC[x[0]]+x[1]+'</button>'}).join("");
K.$("#acc").textContent=K.S.user?"Déconnexion":"Connexion"};
K.go=function(v,id){K.S.view=v;if(id!=null)K.S.id=id;K.render()};
K.need=function(){if(K.S.user)return true;K.S.mode="login";K.toast("Connecte-toi pour continuer.");K.go("auth");return false};
K.render=function(){var f=K.views[K.S.view]||K.views.home;K.bar();
Promise.resolve().then(f).then(function(){window.scrollTo(0,0);var h=K.$("#app h1");if(h){h.setAttribute("tabindex","-1");h.focus({preventScroll:true})}}).catch(function(e){K.app('<div class="empty">'+K.esc(K.msg(e))+'</div>')})};
K.loadMe=function(){if(!K.S.user){K.S.me=null;return Promise.resolve()}
return K.sb.from("profiles").select("name,phone,quartier,role,blocked").eq("user_id",K.S.user.id).maybeSingle().then(function(r){K.S.me=r.data||null})};
K.boot=function(){var c=window.SOU||{};
if(!c.URL||!c.KEY||c.URL.indexOf("COLLE")>-1||c.KEY.indexOf("COLLE")>-1){K.app('<div class="empty">Configuration manquante : ouvre config.js et colle l’adresse et la clé publique de ton projet Supabase.</div>');return}
K.sb=window.supabase.createClient(c.URL,c.KEY);
K.sb.auth.onAuthStateChange(function(ev,s){K.S.user=s?s.user:null});
K.sb.auth.getSession().then(function(r){K.S.user=r.data.session?r.data.session.user:null;return K.loadMe()}).then(function(){K.render()}).catch(function(e){K.app('<div class="empty">'+K.esc(K.msg(e))+'</div>')})};
K.views.home=function(){
return K.sb.from("missions").select("*").eq("status","ouverte").order("created_at",{ascending:false}).limit(100).then(function(r){
if(r.error)throw r.error;
var l=r.data.filter(function(m){return(K.S.cat==="Toutes"||m.category===K.S.cat)&&(K.S.q==="Tous"||m.quartier===K.S.q)});
var chips=["Toutes"].concat(K.CATS).map(function(c){return'<button class="chip" data-cat="'+K.esc(c)+'" aria-pressed="'+(K.S.cat===c)+'">'+K.esc(c)+'</button>'}).join("");
K.app('<h1>Trouve une mission près de toi</h1><p class="sub">Choisis une mission, contacte le client, fais le travail et fais-toi payer.</p>'+(K.S.user?'':'<div class="note">Connecte-toi pour prendre une mission ou en publier une.</div>')+'<div class="chips" role="group" aria-label="Catégories">'+chips+'</div><label for="fq" style="margin-top:0">Quartier</label><select id="fq">'+K.opts(["Tous"].concat(K.QUA),K.S.q)+'</select><h2>'+l.length+' mission'+(l.length>1?"s":"")+' ouverte'+(l.length>1?"s":"")+'</h2>'+(l.length?l.map(K.card).join(""):'<div class="empty">Aucune mission pour ce choix. Change de catégorie ou de quartier, ou publie la tienne.</div>'))})};
K.views.auth=function(){var s=K.S.mode==="signup";
K.app('<h1>'+(s?"Créer mon compte":"Connexion")+'</h1><p class="sub">'+(s?"Un compte te permet de publier et de prendre des missions.":"Connecte-toi pour publier ou prendre une mission.")+'</p><div id="fe"></div>'+
(s?'<label for="a1">Prénom</label><input id="a1" maxlength="40" autocomplete="given-name">':'')+
'<label for="a2">Adresse e-mail</label><input id="a2" type="email" inputmode="email" autocomplete="email">'+
(s?'<label for="a3">Numéro WhatsApp</label><input id="a3" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ex. 0700000000"><p class="meta">Visible seulement par la personne avec qui tu partages une mission prise.</p><label for="a4">Quartier</label><select id="a4">'+K.opts(K.QUA,"Abobo")+'</select>':'')+
'<label for="a5">Mot de passe</label><input id="a5" type="password" autocomplete="'+(s?"new-password":"current-password")+'">'+(s?'<p class="meta">Au moins 8 caractères.</p>':'')+
'<button class="btn" data-act="'+(s?"signup":"login")+'">'+(s?"Créer mon compte":"Se connecter")+'</button><button class="btn alt" data-act="mode">'+(s?"J’ai déjà un compte":"Je n’ai pas de compte")+'</button>')};
K.acts.mode=function(){K.S.mode=K.S.mode==="signup"?"login":"signup";K.render()};
K.acts.hdr=function(){if(K.S.user)K.acts.logout();else{K.S.mode="login";K.go("auth")}};
K.acts.logout=function(){K.sb.auth.signOut().then(function(){K.S.user=null;K.S.me=null;K.toast("Tu es déconnecté.");K.go("home")})};
K.acts.login=function(){
if(Date.now()<K.S.lock)return K.fe("Trop d’essais. Réessaie dans une minute.");
var e=K.$("#a2").value.trim(),p=K.$("#a5").value;
if(!e||!p)return K.fe("Écris ton e-mail et ton mot de passe.");
K.sb.auth.signInWithPassword({email:e,password:p}).then(function(r){
if(r.error){K.S.tries++;if(K.S.tries>=5){K.S.lock=Date.now()+60000;K.S.tries=0}return K.fe(K.msg(r.error))}
K.S.tries=0;K.S.user=r.data.user;return K.loadMe().then(function(){K.toast("Bienvenue !");K.go("home")})}).catch(function(x){K.fe(K.msg(x))})};
K.acts.signup=function(){
var n=K.$("#a1").value.trim(),e=K.$("#a2").value.trim(),t=K.phone(K.$("#a3").value),q=K.$("#a4").value,p=K.$("#a5").value;
if(n.length<2)return K.fe("Écris ton prénom.");
if(!/^\S+@\S+\.\S+$/.test(e))return K.fe("Écris une adresse e-mail valide.");
if(!/^\d{10}$/.test(t))return K.fe("Le numéro WhatsApp doit avoir 10 chiffres.");
if(p.length<8)return K.fe("Le mot de passe doit avoir au moins 8 caractères.");
K.sb.auth.signUp({email:e,password:p,options:{data:{name:n,phone:t,quartier:q}}}).then(function(r){
if(r.error)return K.fe(K.msg(r.error));
if(!r.data.session){K.S.mode="login";K.toast("Compte créé. Connecte-toi.");return K.go("auth")}
K.S.user=r.data.user;return K.loadMe().then(function(){K.toast("Compte créé. Bienvenue !");K.go("home")})}).catch(function(x){K.fe(K.msg(x))})};
document.addEventListener("click",function(ev){var el=ev.target.closest("[data-go],[data-open],[data-cat],[data-act]");if(!el)return;var d=el.dataset;
if(d.go){if(d.go==="auth")K.S.mode="login";return K.go(d.go)}
if(d.open)return K.go("detail",+d.open);
if(d.cat){K.S.cat=d.cat;return K.render()}
if(d.act&&K.acts[d.act])K.acts[d.act](el)});
document.addEventListener("change",function(ev){if(ev.target.id==="fq"){K.S.q=ev.target.value;K.render()}});
})();
// FIN app.js
