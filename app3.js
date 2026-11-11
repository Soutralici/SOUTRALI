(function(){var K=window.K;
K.views.new=function(){
if(!K.need())return;
K.app('<h1>Publier une mission</h1><p class="sub">Décris ce dont tu as besoin. Un jeune de ton quartier pourra la prendre.</p><div id="fe"></div>'+
'<label for="f1">Titre</label><input id="f1" maxlength="60" placeholder="Ex. Livrer un colis à Cocody">'+
'<label for="f2">Description</label><textarea id="f2" maxlength="300" placeholder="Que faut-il faire, où et avant quelle heure ?"></textarea>'+
'<label for="f3">Catégorie</label><select id="f3">'+K.opts(K.CATS)+'</select>'+
'<label for="f4">Quartier</label><select id="f4">'+K.opts(K.QUA,(K.S.me&&K.S.me.quartier)||"Abobo")+'</select>'+
'<label for="f5">Prix proposé (FCFA)</label><input id="f5" type="number" inputmode="numeric" min="500" max="500000" step="100" placeholder="Ex. 3000">'+
'<button class="btn" data-act="publish">Publier la mission</button>')};
K.acts.publish=function(){
var t=K.$("#f1").value.trim(),d=K.$("#f2").value.trim(),p=parseInt(K.$("#f5").value,10),e="";
if(t.length<4)e="Écris un titre d’au moins 4 lettres.";else if(d.length<10)e="Décris la mission en au moins 10 lettres.";else if(!(p>=500&&p<=500000))e="Le prix doit être entre 500 et 500 000 FCFA.";
if(e)return K.fe(e);
K.sb.rpc("create_mission",{p_title:t,p_desc:d,p_cat:K.$("#f3").value,p_q:K.$("#f4").value,p_price:p}).then(function(r){
if(r.error)return K.fe(K.msg(r.error));K.toast("Mission publiée");K.go("detail",r.data)}).catch(function(x){K.fe(K.msg(x))})};
K.views.mine=function(){
if(!K.need())return;
var u=K.S.user.id;
return K.sb.from("missions").select("*").or("owner.eq."+u+",taker.eq."+u).order("created_at",{ascending:false}).limit(100).then(function(r){
if(r.error)throw r.error;
var a=r.data.filter(function(m){return m.owner===u}),b=r.data.filter(function(m){return m.taker===u}),e='<div class="empty">Rien ici pour le moment.</div>',me=K.S.me||{};
K.app('<h1>Mes missions</h1><div class="note">'+K.esc(me.name||"")+' · '+K.esc(me.quartier||"")+(me.blocked?' · Compte bloqué':'')+'</div><h2>Publiées par moi</h2>'+(a.length?a.map(K.card).join(""):e)+'<h2>Que j’ai prises</h2>'+(b.length?b.map(K.card).join(""):e)+(me.role==="admin"?'<button class="btn alt" data-go="admin">Administration</button>':'')+'<button class="btn alt" data-act="logout">Se déconnecter</button>')})};
})();
// FIN app3.js
