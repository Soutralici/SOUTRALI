(function(){var K=window.K;
K.rpcDo=function(fn,args,ok){return K.sb.rpc(fn,args).then(function(r){if(r.error)throw r.error;K.toast(ok);K.render()}).catch(function(e){K.toast(K.msg(e));K.render()})};
K.views.detail=function(){
var uid=K.S.user&&K.S.user.id;
return K.sb.from("missions").select("*").eq("id",K.S.id).maybeSingle().then(function(r){
if(r.error)throw r.error;var m=r.data;
if(!m){K.app('<button class="back" data-go="home">‹ Retour aux missions</button><div class="empty">Cette mission n’est plus disponible.</div>');return}
var mine=m.owner===uid,took=m.taker===uid,b="";
if(m.status==="ouverte"&&!mine)b+='<button class="btn" data-act="take">Prendre cette mission</button>';
if(m.status==="prise"&&took)b+='<button class="btn alt" data-act="release">Abandonner la mission</button>';
if(m.status==="prise"&&mine)b+='<button class="btn" data-act="done">Marquer comme terminée</button>';
if(mine&&(m.status==="ouverte"||m.status==="prise"))b+='<button class="btn alt" data-act="cancel">Annuler la mission</button>';
K.app('<button class="back" data-go="home">‹ Retour aux missions</button><br><span class="st '+m.status+'">'+K.SL[m.status]+'</span><h1>'+K.esc(m.title)+'</h1><p class="meta">'+K.esc(m.category)+' · '+K.esc(m.quartier)+' · '+K.ago(m.created_at)+' · publiée par '+K.esc(m.owner_name||"un membre")+'</p><div class="price" style="font-size:24px">'+K.fcfa(m.price)+'</div><p>'+K.esc(m.description)+'</p><div id="ct"></div><div class="note">Le paiement se règle directement avec l’autre personne, par Mobile Money ou en espèces, une fois la mission terminée.</div>'+b);
if(m.status==="prise"&&(mine||took))return K.sb.rpc("get_contact",{p_id:m.id}).then(function(c){
var x=c.data&&c.data[0],n=x?K.phone(x.contact_phone):"";
if(!n)return;
K.$("#ct").innerHTML='<div class="note"><b>'+K.esc(x.contact_name)+'</b> · '+K.esc(n)+'</div><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/225'+n+'">Écrire sur WhatsApp</a>'})})};
K.acts.take=function(){if(K.need())K.rpcDo("take_mission",{p_id:K.S.id},"Mission prise. Contacte le client.")};
K.acts.release=function(){K.rpcDo("release_mission",{p_id:K.S.id},"Mission remise en ligne")};
K.acts.done=function(){K.rpcDo("finish_mission",{p_id:K.S.id},"Mission terminée")};
K.acts.cancel=function(){if(confirm("Annuler cette mission ?"))K.rpcDo("cancel_mission",{p_id:K.S.id},"Mission annulée")};
})();
// FIN app2.js
