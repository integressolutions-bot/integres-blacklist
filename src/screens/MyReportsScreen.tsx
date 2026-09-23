import React,{useCallback,useState} from 'react';
import {Alert,FlatList,Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {riskApi} from '../api/client';
import {Button,Card,H,P,Screen} from '../components/UI';
export default function MyReportsScreen(){
 const[d,setD]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=useCallback(async()=>{try{setLoading(true);setError('');const data=await riskApi.myReports();setD(Array.isArray(data)?data:[])}catch(x:any){setError(x?.message||'Unable to load your reports.')}finally{setLoading(false)}},[]);
 useFocusEffect(useCallback(()=>{void load()},[load]));
 return <Screen><H>My reports</H><P>Track moderation status. Pending reports should not be represented as established facts.</P>{error?<Card><Text style={{fontWeight:'900'}}>Reports unavailable</Text><P>{error}</P><Button title="Retry" onPress={()=>void load()} disabled={loading}/></Card>:null}<FlatList data={d} keyExtractor={(x:any)=>String(x.id||x._id)} ListEmptyComponent={!loading&&!error?<Card><P>No reports yet.</P><Button title="Refresh" kind="secondary" onPress={()=>void load()} disabled={loading}/></Card>:loading?<P>Loading your reports…</P>:null} renderItem={({item}:any)=><Card><Text style={{fontWeight:'800'}}>{item.name||item.subjectName||'Blacklist report'}</Text><P>{item.status||'PENDING'} · {item.submittedAt?new Date(item.submittedAt).toLocaleDateString():item.createdAt?new Date(item.createdAt).toLocaleDateString():''}</P></Card>}/></Screen>
}
