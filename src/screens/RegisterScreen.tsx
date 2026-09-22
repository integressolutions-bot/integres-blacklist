import React,{useState} from 'react';
import {Alert,ScrollView} from 'react-native';
import {Button,Card,Field,H,P,Screen} from '../components/UI';
import {useAuth} from '../context/AuthContext';
export default function RegisterScreen(){
 const{register}=useAuth(); const[n,setN]=useState(''),[e,setE]=useState(''),[p,setP]=useState(''),[busy,setBusy]=useState(false);
 const go=async()=>{const name=n.trim(),email=e.trim().toLowerCase(); if(name.length<2)return Alert.alert('Name required','Enter your full name.'); if(!/^\S+@\S+\.\S+$/.test(email))return Alert.alert('Valid email required','Enter a valid email address.'); if(p.length<8)return Alert.alert('Password too short','Use at least 8 characters.'); try{setBusy(true);await register({fullName:name,email,password:p});}catch(x:any){Alert.alert('Registration failed',x?.message||'Unable to create the account.');}finally{setBusy(false);}};
 return <ScrollView><Screen><H>Create account</H><P>Accounts created here are standard users. Elevated access should only be granted administratively.</P><Card><Field placeholder="Full name" value={n} onChangeText={setN}/><Field placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={e} onChangeText={setE}/><Field placeholder="Password (8+ characters)" secureTextEntry value={p} onChangeText={setP}/><Button title={busy?'Creating account…':'Register'} disabled={busy} onPress={go}/></Card></Screen></ScrollView>;
}
