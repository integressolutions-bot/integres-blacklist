import React,{useEffect,useState} from 'react';
import {Alert,Pressable,ScrollView,Switch,Text,View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {riskApi} from '../api/client';
import {Button,Card,Field,H,P,Screen} from '../components/UI';

const CATEGORIES=[
 {key:'FRAUD_OR_SCAM',title:'Fraud / Scam',description:'Suspected fraud, scams, deceptive dealings or serious trust-related misconduct.',backend:'SOCIAL'},
 {key:'UNPAID_OBLIGATION',title:'Unpaid Obligation',description:'Money, debt, payment or another obligation that you believe remains unpaid.',backend:'OTHER'},
 {key:'CONTRACT_NONPERFORMANCE',title:'Contract Non-Performance',description:'A service provider or contractor did not perform an agreed obligation.',backend:'COMPANY_CONTRACTOR'},
 {key:'PROPERTY_OR_ASSET_DISPUTE',title:'Property / Asset Dispute',description:'A documented dispute involving property, tenancy, possession, damage or related assets.',backend:'LANDLORD_TENANT'},
 {key:'BUSINESS_MISCONDUCT',title:'Business Misconduct',description:'Documented misconduct involving a company, contractor or business transaction.',backend:'COMPANY_CONTRACTOR'},
 {key:'EMPLOYMENT_OR_PROFESSIONAL',title:'Employment / Professional',description:'A documented employment, salary, workplace or professional-service dispute.',backend:'EMPLOYER_EMPLOYEE'},
 {key:'IMPERSONATION_OR_IDENTITY',title:'Impersonation / Identity',description:'Suspected impersonation, identity misuse or deceptive use of another person’s identity.',backend:'SOCIAL'},
 {key:'OTHER',title:'Other',description:'A documented accountability concern that does not fit another category.',backend:'OTHER'},
] as const;

type CategoryKey=(typeof CATEGORIES)[number]['key'];

export default function ReportScreen(){
 const[step,setStep]=useState<'category'|'details'>('category');
 const[selectedCategory,setSelectedCategory]=useState<CategoryKey>('OTHER');
 const[backendCategory,setBackendCategory]=useState('OTHER');
 const[n,setN]=useState(''),[reason,setReason]=useState(''),[email,setEmail]=useState(''),[consent,setConsent]=useState(false),[terms,setTerms]=useState<any>();
 const[files,setFiles]=useState<any[]>([]),[busy,setBusy]=useState(false);
 useEffect(()=>{riskApi.terms().then(setTerms).catch(()=>{})},[]);
 const selected=CATEGORIES.find(x=>x.key===selectedCategory);
 const choose=(item:(typeof CATEGORIES)[number])=>{setSelectedCategory(item.key);setBackendCategory(item.backend);setStep('details')};
 const addImage=async()=>{const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.8});if(!r.canceled)setFiles(v=>[...v,...r.assets])};
 const addDoc=async()=>{const r=await DocumentPicker.getDocumentAsync({multiple:true,copyToCacheDirectory:true});if(!r.canceled)setFiles(v=>[...v,...r.assets])};
 const submit=async()=>{
  if(!consent)return Alert.alert('Confirmation required','Confirm that the report is made in good faith and may be challenged.');
  if(!n.trim()||reason.trim().length<20)return Alert.alert('More detail required','Provide the subject and a factual summary of at least 20 characters.');
  try{
   setBusy(true);const f=new FormData();
   f.append('name',n.trim());f.append('category',backendCategory);f.append('severity','MEDIUM');f.append('reason',reason.trim());f.append('country','NG');
   f.append('termsVersion',terms?.termsVersion||'blacklist-terms-v1');f.append('publicationConsent','false');
   if(email.trim())f.append('subjectEmail',email.trim().toLowerCase());
   for(const x of files)f.append('files',{uri:x.uri,name:x.fileName||x.name||'evidence.jpg',type:x.mimeType||'image/jpeg'} as any);
   const d=await riskApi.submit(f);
   Alert.alert('Report received',`Reference: ${d.id||d._id||'created'}\n\nYour submission enters the Integres review process. Submission or payment does not automatically make it public.`);
   setN('');setReason('');setEmail('');setFiles([]);setConsent(false);setStep('category');setSelectedCategory('OTHER');setBackendCategory('OTHER');
  }catch(x:any){Alert.alert('Submission failed',x?.message||'Unable to submit the report.')}finally{setBusy(false)}
 };
 if(step==='category')return <ScrollView><Screen><H>Submit a Blacklist report</H><P>Choose the type of concern. The next step collects the factual details and evidence for that category.</P><Card><Text style={{fontWeight:'900',marginBottom:10}}>What is the report about?</Text>{CATEGORIES.map(item=><Pressable key={item.key} onPress={()=>choose(item)} style={({pressed})=>({borderWidth:1,borderColor:'#D1D5DB',borderRadius:12,padding:14,marginBottom:10,backgroundColor:pressed?'#F3F4F6':'#FFF',opacity:pressed?.85:1})}><Text style={{fontSize:16,fontWeight:'900',marginBottom:5}}>{item.title}</Text><Text style={{color:'#4B5563',lineHeight:20}}>{item.description}</Text><Text style={{marginTop:8,fontWeight:'800'}}>Continue →</Text></Pressable>)}</Card></Screen></ScrollView>;
 return <ScrollView><Screen><Button title="← Back to categories" kind="secondary" onPress={()=>setStep('category')} disabled={busy}/><H>{selected?.title||'Blacklist report'}</H><P>{selected?.description}</P>
 <Card><Text style={{fontWeight:'900'}}>Report details</Text><P>Describe what happened using facts you can support. Include dates, amounts, obligations, actions taken and relevant evidence.</P>
 <Field placeholder="Person or company being reported" value={n} onChangeText={setN}/><Field placeholder="Subject email for notice, if known" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/>
 <Field multiline style={{minHeight:140,textAlignVertical:'top'}} placeholder="What happened? Include dates, amounts, obligations, actions taken and the evidence you can support." value={reason} onChangeText={setReason}/>
 <P>Evidence attached: {files.length}</P><Button title="Add image evidence" kind="secondary" onPress={addImage} disabled={busy}/><Button title="Add document evidence" kind="secondary" onPress={addDoc} disabled={busy}/></Card>
 <Card><Text style={{fontWeight:'900'}}>What happens next</Text><P>1. Report received confidentially.{"\n"}2. Due-diligence/moderation review.{"\n"}3. Subject notice/right to respond where required.{"\n"}4. Decision on public eligibility.{"\n"}5. Dispute, correction, mediation or resolution remains available.</P></Card>
 <Card><View style={{flexDirection:'row',gap:10,alignItems:'center'}}><Switch value={consent} onValueChange={setConsent} disabled={busy}/><Text style={{flex:1}}>I am reporting in good faith. I will not use Blacklist for harassment, revenge, threats or doxxing, and I understand the subject may challenge this report.</Text></View></Card>
 <Button title={busy?'Submitting…':'Submit report for review'} disabled={busy} onPress={submit}/>
 </Screen></ScrollView>;
}
