import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Accueil() {

return (

<View style={styles.container}>

<ScrollView>

{/* HEADER */}
<LinearGradient
colors={["#7B2CBF","#9D4EDD","#C77DFF"]}
style={styles.header}
>

<Text style={styles.hello}>Hello Maryem 👋</Text>
<Text style={styles.subtitle}>Start learning something new</Text>

<TextInput
placeholder="Search courses..."
placeholderTextColor="#ddd"
style={styles.search}
/>

</LinearGradient>

{/* CONTINUE LEARNING */}
<Text style={styles.section}>Continue Learning</Text>

<View style={styles.progressCard}>
<Text style={styles.progressTitle}>React Native Basics</Text>
<Text style={styles.progressText}>Progress 60%</Text>
</View>

{/* COURSES */}
<Text style={styles.section}>Popular Courses</Text>

<View style={styles.coursesContainer}>

<View style={styles.courseCard}>
<Text style={styles.courseTitle}>Programming</Text>
<Text style={styles.courseLessons}>8 Lessons</Text>
</View>

<View style={styles.courseCard}>
<Text style={styles.courseTitle}>UI / UX Design</Text>
<Text style={styles.courseLessons}>5 Lessons</Text>
</View>

<View style={styles.courseCard}>
<Text style={styles.courseTitle}>Digital Marketing</Text>
<Text style={styles.courseLessons}>6 Lessons</Text>
</View>

</View>

</ScrollView>

{/* NAVBAR */}
<View style={styles.navbar}>
<Text style={styles.navItem}>🏠</Text>
<Text style={styles.navItem}>📚</Text>
<Text style={styles.navItem}>👤</Text>
</View>

</View>

);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f8f7ff"
},

header:{
padding:30,
borderBottomLeftRadius:30,
borderBottomRightRadius:30
},

hello:{
color:"white",
fontSize:26,
fontWeight:"bold"
},

subtitle:{
color:"#eee",
marginBottom:20
},

search:{
backgroundColor:"rgba(255,255,255,0.2)",
padding:15,
borderRadius:20,
color:"white"
},

section:{
fontSize:20,
fontWeight:"bold",
marginLeft:20,
marginTop:20,
marginBottom:10
},

progressCard:{
backgroundColor:"#7B2CBF",
marginHorizontal:20,
padding:25,
borderRadius:25
},

progressTitle:{
color:"white",
fontSize:18,
fontWeight:"bold"
},

progressText:{
color:"white",
marginTop:5
},

coursesContainer:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-around"
},

courseCard:{
backgroundColor:"white",
width:"40%",
padding:20,
borderRadius:20,
marginTop:15,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10
},

courseTitle:{
fontWeight:"bold",
fontSize:16
},

courseLessons:{
color:"#777",
marginTop:5
},

navbar:{
flexDirection:"row",
justifyContent:"space-around",
padding:15,
backgroundColor:"white",
borderTopWidth:1,
borderColor:"#eee"
},

navItem:{
fontSize:22
}

});