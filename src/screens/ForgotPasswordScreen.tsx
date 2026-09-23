import React,{useState} from 'react';
import {Alert,Pressable,Text} from 'react-native';
import {authApi} from '../api/client';
import {Button,Card,Field,H,P,Screen} from '../components/UI';

export default function ForgotPasswordScreen({navigation}:any){
  const[email,setEmail]=useState('');
  const[busy,setBusy]=useState(false);
  const submit=async()=>{
    const value=email.trim().toLowerCase();
    if(!/^\S+@\S+\.\S+$/.test(value))return Alert.alert('Valid email required','Enter the email address associated with your Integres account.');
    try{
      setBusy(true);
      await authApi.forgotPassword(value);
      Alert.alert('Check your email','If the account exists, Integres has sent password-recovery instructions.');
    }catch(error:any){
      Alert.alert('Recovery unavailable',error?.message||'Password recovery could not be completed.');
    }finally{setBusy(false)}
  };
  return <Screen>
    <Pressable onPress={()=>navigation.goBack()} disabled={busy}><Text style={{color:'#1D4ED8',fontWeight:'800'}}>‹ Back to sign in</Text></Pressable>
    <H>Forgot Password</H>
    <P>Enter the email address associated with your Integres Blacklist account. If the account exists, the authentication service will send recovery instructions.</P>
    <Card>
      <Field placeholder="Email address" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail}/>
      <Button title={busy?'Sending…':'Send reset instructions'} onPress={submit} disabled={busy}/>
    </Card>
    <Card><Text style={{fontWeight:'900'}}>Security note</Text><P>For privacy, the recovery response does not reveal whether a particular email is registered.</P></Card>
  </Screen>
}
