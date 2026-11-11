(function(){var K=window.K;
K.views.admin=function(){
if(!K.S.me||K.S.me.role!=="admin"){K.app('<div class="empty">Accès réservé à l’administrateur.</div>');return}
return Promise.all([K.sb.from("missions").select("*").order("created_at",{ascending:false}).limit(200),K.sb.rpc("admin_list_users")]).then(function(a){
if(a[0].error)throw a[0].error;if(a[1].error)throw a[1].error;
var c={};a[0].data.forEach(function(m){c[m.status]=(c[m.status]||0)+1});
var ms=a[0].data.map(function(m){return'<div class="row"><span>'+K.esc(m.title)+'<br><span class="meta">'+K.SL[m.status]+' · '+K.esc(m.quartier)+' · '+K.esc(m.owner_name)+'</span></span>'+((m.status==="ouverte"||m.status==="prise")?'<button class="chip" data-act="admcancel" data-id="'+m.id+'">Retirer</button>':"")+'</div>'}).join("");
var us=a[1].data.map(function(u){return'<div class="row"><span>'+K.esc(u.name)+' · '+K.esc(u.quartier)+'<br><span class="meta">'+K.esc(u.phone)+(u.role==="admin"?" · admin":"")+(u.blocked?" · bloqué":"")+'</span></span>'+(u.role==="admin"?"":'<button class="chip" data-act="admblock" data-id="'+u.user_id+'" data-b="'+(u.blocked?"0":"1")+'">'+(u.blocked?"Débloquer":"Bloquer")+'</button>')+'</div>'}).join("");
K.app('<button class="back" data-go="mine">‹ Retour</button><h1>Administration</h1><div class="note">Ouvertes : '+(c.ouverte||0)+' · Prises : '+(c.prise||0)+' · Terminées : '+(c.terminee||0)+' · Annulées : '+(c.annulee||0)+'</div><h2>Missions</h2>'+ms+'<h2>Comptes</h2>'+us)})};
K.acts.admcancel=function(el){if(confirm("Retirer cette mission ?"))K.rpcDo("cancel_mission",{p_id:+el.dataset.id},"Mission retirée")};
K.acts.admblock=function(el){var b=el.dataset.b==="1";if(confirm(b?"Bloquer ce compte ?":"Débloquer ce compte ?"))K.rpcDo("admin_set_blocked",{p_user:el.dataset.id,p_blocked:b},b?"Compte bloqué":"Compte débloqué")};
if(!window.KLATE)K.boot();
})();
// FIN app4.js
