import * as SecureStore from 'expo-secure-store';
const BASE=(process.env.EXPO_PUBLIC_API_BASE_URL||'https://integres-backend-production.up.railway.app/api/v1/mobile').replace(/\/$/,'');
const TOKEN='integres_auth_token';
export const tokenStore={get:()=>SecureStore.getItemAsync(TOKEN),set:(v:string)=>SecureStore.setItemAsync(TOKEN,v),clear:()=>SecureStore.deleteItemAsync(TOKEN)};
export async function api(path:string,init:RequestInit={}){
  const token=await tokenStore.get(); const h=new Headers(init.headers||{}); if(!(init.body instanceof FormData))h.set('Content-Type','application/json'); if(token)h.set('Authorization',`Bearer ${token}`);
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),15000);
  try{const r=await fetch(`${BASE}${path}`,{...init,headers:h,signal:c.signal}); const j=await r.json().catch(()=>({})); if(!r.ok)throw new Error(j?.message||`Request failed (${r.status})`); return j?.data??j;}finally{clearTimeout(t)}
}
export const authApi={login:(email:string,password:string)=>api('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),register:(p:any)=>api('/auth/register',{method:'POST',body:JSON.stringify(p)}),profile:()=>api('/auth/profile')};
export const riskApi={terms:()=>api('/blacklist/terms/current'),check:(query:string)=>api('/blacklist/check',{method:'POST',body:JSON.stringify({query})}),record:(id:string)=>api(`/blacklist/${id}`),fee:(p:any)=>api('/blacklist/fees/preview',{method:'POST',body:JSON.stringify(p)}),submit:(f:FormData)=>api('/blacklist/submit',{method:'POST',body:f}),dispute:(id:string,f:FormData)=>api(`/blacklist/${id}/dispute`,{method:'POST',body:f}),removalPreview:(id:string)=>api(`/blacklist/${id}/removal/preview`,{method:'POST'}),removalRequest:(id:string,p:any)=>api(`/blacklist/${id}/removal/request`,{method:'POST',body:JSON.stringify(p)}),myReports:()=>api('/blacklist/my-reports')};
