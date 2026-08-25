import React,{useState} from 'react';
import {Alert,Image,Text,View} from 'react-native';
import {GoogleSignin,statusCodes} from '@react-native-google-signin/google-signin';
import {Button,Card,Field,H,P,Screen} from '../components/UI';
import {useAuth} from '../context/AuthContext';

GoogleSignin.configure({
  webClientId:'463399358521-3sti9q753ao4bpsfrar7v43ulg1mb7pj.apps.googleusercontent.com',
  offlineAccess:false
});

export default function LoginScreen({navigation}:any){
  const{login,loginWithGoogle}=useAuth();
  const[e,setE]=useState('');
  const[p,setP]=useState('');
  const[busy,setBusy]=useState<'email'|'google'|null>(null);

  const go=async()=>{
    try{setBusy('email');await login(e.trim(),p)}
    catch(x:any){Alert.alert('Sign in failed',x.message)}
    finally{setBusy(null)}
  };

  const google=async()=>{
    try{
      setBusy('google');
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
      <Image
        source={require('../../assets/integres-blacklist-logo.png')}
        style={{width:190,height:190}}
        resizeMode="contain"
      />
    </View>

    <H>Integres Blacklist</H>
    <P>Check. Report. Respond. Resolve. Sign in to submit reports, track status, dispute records and manage resolution requests.</P>

    <Card>
      <Button title={busy==='google'?'Connecting to Google…':'Continue with Google'} onPress={google} disabled={!!busy}/>

      <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
        <View style={{flex:1,height:1,backgroundColor:'#E4E7EC'}}/>
        <Text style={{fontSize:12,color:'#667085'}}>or use email</Text>
        <View style={{flex:1,height:1,backgroundColor:'#E4E7EC'}}/>
      </View>

      <Field autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={e} onChangeText={setE}/>
      <Field secureTextEntry placeholder="Password" value={p} onChangeText={setP}/>
      <Button title={busy==='email'?'Signing in…':'Sign in with email'} onPress={go} disabled={!!busy}/>
      <Button title="Create account" kind="secondary" onPress={()=>navigation.navigate('Register')} disabled={!!busy}/>
      <Button title="Run free Blacklist check" kind="secondary" onPress={()=>navigation.navigate('Check')} disabled={!!busy}/>
      <Button title="Blacklist rules & safeguards" kind="secondary" onPress={()=>navigation.navigate('Terms')} disabled={!!busy}/>
    </Card>

    <Text style={{fontSize:12,color:'#667085'}}>
      Reports are reviewed before public eligibility. User allegations are not automatically treated as proven facts.
    </Text>
  </Screen>
}
