import * as SecureStore from 'expo-secure-store';

const BASE=(process.env.EXPO_PUBLIC_API_BASE_URL||'https://integres-backend-production.up.railway.app/api/v1/mobile').replace(/\/$/,'');
const TOKEN='integres_auth_token';

export const tokenStore={
  get:()=>SecureStore.getItemAsync(TOKEN),
  set:(v:string)=>SecureStore.setItemAsync(TOKEN,v),
  clear:()=>SecureStore.deleteItemAsync(TOKEN),
};

export async function api(path:string,init:RequestInit={}){
  const token=await tokenStore.get();
  const headers=new Headers(init.headers||{});
  if(!(init.body instanceof FormData))headers.set('Content-Type','application/json');
  headers.set('Accept','application/json');
  if(token)headers.set('Authorization',`Bearer ${token}`);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch(`${BASE}${path}`,{...init,headers,signal:controller.signal});
    const payload=await response.json().catch(()=>({}));
    if(response.status===401){await tokenStore.clear();throw new Error(payload?.message||'Your session has expired. Please sign in again.');}
    if(!response.ok)throw new Error(payload?.message||`Request failed (${response.status})`);
    return payload?.data??payload;
  }catch(error:any){
    if(error?.name==='AbortError')throw new Error('The request timed out. Check your connection and try again.');
    if(error instanceof TypeError)throw new Error('Network error. Check your connection and try again.');
    throw error;
  }finally{clearTimeout(timeout);}
}

export const authApi={
  login:(email:string,password:string)=>api('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  register:(p:any)=>api('/auth/register',{method:'POST',body:JSON.stringify(p)}),
  google:(idToken:string)=>api('/auth/google',{method:'POST',body:JSON.stringify({idToken})}),
  profile:()=>api('/auth/profile'),
};

export const riskApi={
  terms:()=>api('/blacklist/terms/current'),
  check:(query:string)=>api('/blacklist/check',{method:'POST',body:JSON.stringify({query})}),
  record:(id:string)=>api(`/blacklist/${encodeURIComponent(id)}`),
  fee:(p:any)=>api('/blacklist/fees/preview',{method:'POST',body:JSON.stringify(p)}),
  submit:(f:FormData)=>api('/blacklist/submit',{method:'POST',body:f}),
  dispute:(id:string,f:FormData)=>api(`/blacklist/${encodeURIComponent(id)}/dispute`,{method:'POST',body:f}),
  removalPreview:(id:string)=>api(`/blacklist/${encodeURIComponent(id)}/removal/preview`,{method:'POST'}),
  removalRequest:(id:string,p:any)=>api(`/blacklist/${encodeURIComponent(id)}/removal/request`,{method:'POST',body:JSON.stringify(p)}),
  myReports:()=>api('/blacklist/my-reports'),
};
