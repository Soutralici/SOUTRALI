(function(){var K=window.K;
var RL={arnaque:"Arnaque ou paiement à l’avance",dangereux:"Dangereux ou illégal",choquant:"Choquant ou insultant",autre:"Autre"};
var oa=K.views.auth;
K.views.auth=function(){oa();var b=K.$("#app .btn[data-act]");if(!b)return;
b.insertAdjacentHTML("beforebegin",K.S.mode==="signup"?'<label class="ck"><input id="a6" type="checkbox"><span>J’accepte les <a href="legal.html#conditions" target="_blank" rel="noopener">conditions d’utilisation</a> et la <a href="legal.html#confidentialite" target="_blank" rel="noopener">politique de confidentialité</a>.</span></label>':'<button class="lnk" data-act="forgot">Mot de passe oublié ?</button>')};
var os=K.acts.signup;
K.acts.signup=function(){var c=K.$("#a6");if(!c||!c.checked)return K.fe("Coche la case pour accepter les conditions.");os()};
K.acts.forgot=function(){var e=K.$("#a2").value.trim();
if(!/^\S+@\S+\.\S+$/.test(e))return K.fe("Écris d’abord ton adresse e-mail dans le champ ci-dessus.");
K.sb.auth.resetPasswordForEmail(e,{redirectTo:location.origin+"/"}).then(function(r){
if(r.error)return K.fe(K.msg(r.error));K.toast("Si ce compte existe, un e-mail vient d’être envoyé. Vérifie aussi tes spams.")}).catch(function(x){K.fe(K.msg(x))})};
K.views.reset=function(){
K.app('<h1>Nouveau mot de passe</h1><p class="sub">Choisis un mot de passe d’au moins 8 caractères.</p><div id="fe"></div><label for="r1">Nouveau mot de passe</label><input id="r1" type="password" autocomplete="new-password"><label for="r2">Confirme le mot de passe</label><input id="r2" type="password" autocomplete="new-password"><button class="btn" data-act="setpw">Enregistrer</button>')};
K.acts.setpw=function(){var a=K.$("#r1").value,b=K.$("#r2").value;
if(a.length<8)return K.fe("Le mot de passe doit avoir au moins 8 caractères.");
if(a!==b)return K.fe("Les deux mots de passe ne sont pas identiques.");
K.sb.auth.updateUser({password:a}).then(function(r){
if(r.error){if(/session/i.test(r.error.message||""))return K.fe("Le lien a expiré. Retourne à Connexion et demande un nouvel e-mail.");return K.fe(K.msg(r.error))}
try{history.replaceState(null,"",location.pathname)}catch(e){}
K.toast("Mot de passe changé.");K.loadMe().then(function(){K.go("home")})}).catch(function(x){K.fe(K.msg(x))})};
var ob=K.boot;
K.boot=function(){var rec=/type=recovery/.test(location.hash);ob();
if(K.sb)K.sb.auth.onAuthStateChange(function(ev){if(ev==="PASSWORD_RECOVERY"){K.S.view="reset";K.render()}});
if(rec)K.S.view="reset"};
var od=K.views.detail;
K.views.detail=function(){return Promise.resolve(od()).then(function(){
var a=K.$("#app");if(!a||!K.$("#app .price"))return;
a.insertAdjacentHTML("beforeend",'<div class="note">Conseils de sécurité : rencontre la personne dans un lieu public ou passant, ne paie jamais à l’avance pour obtenir une mission, et arrête tout si la demande te semble bizarre ou dangereuse.</div><h2>Un problème avec cette mission ?</h2><label for="rp">Motif</label><select id="rp">'+Object.keys(RL).map(function(k){return'<option value="'+k+'">'+RL[k]+'</option>'}).join("")+'</select><button class="btn alt" data-act="report">Signaler cette mission</button>')})};
K.acts.report=function(){if(!K.need())return;
K.sb.rpc("report_mission",{p_id:K.S.id,p_reason:K.$("#rp").value}).then(function(r){K.toast(r.error?K.msg(r.error):"Merci, ton signalement est envoyé.")}).catch(function(x){K.toast(K.msg(x))})};
var oad=K.views.admin;
K.views.admin=function(){return Promise.resolve(oad()).then(function(){
if(!K.S.me||K.S.me.role!=="admin")return;
return K.sb.rpc("admin_list_reports").then(function(r){
if(r.error)throw r.error;var l=r.data||[];
K.$("#app").insertAdjacentHTML("beforeend",'<h2>Signalements ('+l.length+')</h2>'+(l.length?l.map(function(s){return'<div class="row"><span>'+K.esc(s.title)+'<br><span class="meta">'+K.esc(RL[s.reason]||s.reason)+' · '+K.ago(s.created_at)+'</span></span><span><button class="chip" data-act="admcancel" data-id="'+s.mission_id+'">Retirer</button> <button class="chip" data-act="rphandle" data-id="'+s.id+'">Traité</button></span></div>'}).join(""):'<div class="empty">Aucun signalement.</div>'))})})};
K.acts.rphandle=function(el){K.rpcDo("admin_handle_report",{p_id:+el.dataset.id},"Signalement traité")};
})();
// FIN app6.js
