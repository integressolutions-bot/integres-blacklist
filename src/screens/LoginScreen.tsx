import React,{useState} from 'react';
import {Alert,Image,Pressable,Text,View} from 'react-native';
import {GoogleSignin,statusCodes} from '@react-native-google-signin/google-signin';
import {Button,Card,Field,H,P,Screen} from '../components/UI';
import {useAuth} from '../context/AuthContext';

const GOOGLE_WEB_CLIENT_ID=process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID||'';
if(GOOGLE_WEB_CLIENT_ID)GoogleSignin.configure({webClientId:GOOGLE_WEB_CLIENT_ID,offlineAccess:false});

export default function LoginScreen({navigation}:any){
  const{login,loginWithGoogle}=useAuth();
  const[e,setE]=useState('');
  const[p,setP]=useState('');
  const[showPassword,setShowPassword]=useState(false);
  const[busy,setBusy]=useState<'email'|'google'|null>(null);

  const go=async()=>{
    const email=e.trim().toLowerCase();
    if(!email||!p)return Alert.alert('Missing information','Enter your email and password.');
    try{setBusy('email');await login(email,p)}catch(x:any){Alert.alert('Sign in failed',x?.message||'Unable to sign in.')}finally{setBusy(null)}
  };

  const google=async()=>{
    try{
      setBusy('google');
      if(!GOOGLE_WEB_CLIENT_ID)throw new Error('Google Sign-In is not configured for this build. Use email sign-in or configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.');
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog:true});
      const response:any=await GoogleSignin.signIn();
      const idToken=response?.data?.idToken??response?.idToken;
      if(!idToken)throw new Error('Google did not return an ID token.');
      await loginWithGoogle(idToken);
    }catch(x:any){
      if(x?.code===statusCodes.SIGN_IN_CANCELLED)return;
      if(x?.code===statusCodes.IN_PROGRESS)return Alert.alert('Google Sign-In','Google Sign-In is already in progress.');
      if(x?.code===statusCodes.PLAY_SERVICES_NOT_AVAILABLE)return Alert.alert('Google Play Services','Google Play Services is unavailable or needs to be updated.');
      Alert.alert('Google Sign-In failed',x?.message||'Unable to sign in with Google.');
    }finally{setBusy(null)}
  };

  return <Screen>
    <View style={{alignItems:'center',marginTop:10,marginBottom:8}}>
      <Image source={require('../../assets/integres-blacklist-logo.png')} style={{width:190,height:190}} resizeMode="contain"/>
    </View>
    <H>Integres Blacklist</H>
    <P>Check. Report. Respond. Resolve. Sign in to submit reports, track status, dispute records and manage resolution requests.</P>

    <Card>
      <Button title={busy==='google'?'Connecting to Google…':'Continue with Google'} onPress={google} disabled={!!busy}/>
      <View style={{flexDirection:'row',alignItems:'center',gap:10}}><View style={{flex:1,height:1,backgroundColor:'#E4E7EC'}}/><Text style={{fontSize:12,color:'#667085'}}>or use email</Text><View style={{flex:1,height:1,backgroundColor:'#E4E7EC'}}/></View>
      <Field autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="Email" value={e} onChangeText={setE}/>
      <View style={{position:'relative'}}>
        <Field secureTextEntry={!showPassword} placeholder="Password" value={p} onChangeText={setP} style={{paddingRight:70}}/>
        <Pressable onPress={()=>setShowPassword(v=>!v)} disabled={!!busy} style={{position:'absolute',right:12,top:0,bottom:0,justifyContent:'center'}}>
          <Text style={{color:'#1D4ED8',fontWeight:'800'}}>{showPassword?'Hide':'Show'}</Text>
        </Pressable>
      </View>
      <View style={{alignItems:'flex-end'}}><Pressable onPress={()=>navigation.navigate('ForgotPassword')} disabled={!!busy}><Text style={{color:'#1D4ED8',fontWeight:'800'}}>Forgot Password?</Text></Pressable></View>
      <Button title={busy==='email'?'Signing in…':'Sign in with email'} onPress={go} disabled={!!busy}/>
      <Button title="Create account" kind="secondary" onPress={()=>navigation.navigate('Register')} disabled={!!busy}/>
      <Button title="Run free Blacklist check" kind="secondary" onPress={()=>navigation.navigate('Check')} disabled={!!busy}/>
      <Button title="Blacklist rules & safeguards" kind="secondary" onPress={()=>navigation.navigate('Terms')} disabled={!!busy}/>
    </Card>
    <Text style={{fontSize:12,color:'#667085'}}>Reports are reviewed before public eligibility. User allegations are not automatically treated as proven facts.</Text>
  </Screen>
}
