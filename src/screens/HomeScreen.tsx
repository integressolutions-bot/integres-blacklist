import React from 'react'; import {ScrollView,Text,View} from 'react-native'; import {Button,Card,H,P,Screen} from '../components/UI'; import {useAuth} from '../context/AuthContext';
export default function HomeScreen({navigation}:any){const{user,logout}=useAuth();return <ScrollView><Screen><H>Risk Review</H><P>Welcome {user?.fullName||user?.name||''}. Reports remain allegations until reviewed. The system should support notice, response, evidence review and dispute resolution before any adverse publication.</P><Card><Text style={{fontWeight:'800'}}>Safer workflow</Text><P>1. Submit confidential report
2. Due diligence review
3. Notify subject / right to respond
4. Dispute or mediation
5. Verified resolution or closure</P></Card><Button title="Check reviewed records" onPress={()=>navigation.navigate('Check')}/><Button title="Submit confidential report" onPress={()=>navigation.navigate('Report')}/><Button title="My reports" kind="secondary" onPress={()=>navigation.navigate('MyReports')}/><Button title="Terms & safeguards" kind="secondary" onPress={()=>navigation.navigate('Terms')}/><Button title="Sign out" kind="secondary" onPress={logout}/></Screen></ScrollView>}
