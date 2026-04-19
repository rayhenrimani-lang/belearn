import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
SafeAreaView,
ScrollView,
Alert,
ActivityIndicator
} from "react-native";

import { useRouter } from "expo-router";
import { loginUser } from "../api";
import { saveSession } from "@/src/services/authStorage";
import { useAuth } from "@/src/context/AuthContext";

export default function Login() {

const router = useRouter();
const { refreshSession } = useAuth();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState(null);

const handleLogin = async () => {

if (!email || !password) {
Alert.alert("Erreur","Email et mot de passe requis");
return;
}

setLoading(true);
setError(null);

try{

const res = await loginUser(email,password);

console.log("LOGIN RESPONSE:",res);

if(res && res.token){

await saveSession(res.token, email);
await refreshSession();
router.replace("/(tabs)");

}else{

const errorMessage = res?.message || res?.error || "Email ou mot de passe incorrect";
setError(errorMessage);
Alert.alert("Erreur",errorMessage);

}

}catch(error: any){

const errorMessage = error?.message || "Erreur serveur";
setError(errorMessage);
Alert.alert("Erreur",errorMessage);

} finally {

setLoading(false);

}

};

return(

<SafeAreaView style={{flex:1,backgroundColor:"#F8F7FF"}}>

<ScrollView contentContainerStyle={styles.container}>

<View style={styles.logoBox}>
<Text style={styles.logo}>🎓</Text>
</View>

<Text style={styles.title}>BeLearn</Text>
<Text style={styles.subtitle}>Se connecter</Text>

<TextInput
placeholder="Email"
style={styles.input}
value={email}
onChangeText={setEmail}
keyboardType="email-address"
/>

<TextInput
placeholder="Mot de passe"
style={styles.input}
value={password}
onChangeText={setPassword}
secureTextEntry
/>

<TouchableOpacity
style={[styles.button, loading && styles.buttonDisabled]}
onPress={handleLogin}
disabled={loading}
>

{loading ? (
  <ActivityIndicator color="#fff" size="small" />
) : (
  <Text style={styles.text}>Se connecter</Text>
)}

</TouchableOpacity>

<TouchableOpacity
onPress={()=>router.push("/register")}
style={{marginTop:20}}
>

<Text style={styles.registerText}>
Pas de compte ? Créer un compte
</Text>

</TouchableOpacity>

</ScrollView>

</SafeAreaView>

);

}

const styles = StyleSheet.create({

container:{
flexGrow:1,
justifyContent:"center",
alignItems:"center",
padding:20
},

logoBox:{
width:100,
height:100,
borderRadius:30,
backgroundColor:"#7B2CBF",
justifyContent:"center",
alignItems:"center",
marginBottom:20
},

logo:{
fontSize:50,
color:"#fff"
},

title:{
fontSize:32,
fontWeight:"bold",
marginBottom:5
},

subtitle:{
fontSize:16,
color:"#777",
marginBottom:30
},

input:{
width:"100%",
borderWidth:1,
borderColor:"#ddd",
padding:15,
borderRadius:25,
marginBottom:15,
backgroundColor:"#fff"
},

button:{
backgroundColor:"#7B2CBF",
padding:15,
borderRadius:25,
width:"100%",
alignItems:"center"
},

buttonDisabled: {
opacity: 0.7
},

text:{
color:"#fff",
fontWeight:"bold",
fontSize:16
},

registerText:{
color:"#7B2CBF",
fontWeight:"bold"
}

});