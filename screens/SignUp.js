import { StyleSheet, Text, View, TextInput, Animated, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { animateButton, animateButton2 } from '../components/ButtonAnimations';

const auth = getAuth();

export default function SignUp() {
  const [email, setEmail] = useState('user02@gmail.com');
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('');
  const [scaleValue] = useState( new Animated.Value(1) );
  const [fadeValue] = useState( new Animated.Value(1) );

  async function signIn(){
    animateButton2(fadeValue);
    if (email === "" || password === "") {
      setError("Email and password are mandatory.");
      return;
    }
    try{
      await signInWithEmailAndPassword(auth, email, password);
      
    }catch(error){
      setError(error.message);
      console.log(error.message);
    }
  }

  async function signUp() {
    animateButton(scaleValue);
    if (email === '' || password === '') {
      setError('Email and password are mandatory.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(function(user){
          setDoc(doc(db, "users", user.user.uid),{
            email: email,
            dailies: [],
            categories: {
              family: [],
              events: [],
              hobbies: []
            },
            recordings: []
          })
        });
    } catch(error){
      setError(error.message);
      console.log(error.message);
    }
  }


   return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Remember</Text>
        <Image style={styles.logo} source={require('../assets/remember-logo2.png')} />
      </View>
      <TextInput value={email} onChangeText={(email) => {setEmail(email)}} placeholder="Email" style={styles.textBoxes}></TextInput>
      <TextInput secureTextEntry={true} value={password} onChangeText={(password) => {setPassword(password)}} placeholder="Password" style={styles.textBoxes}></TextInput>
      {error ? <Text>{error}</Text> : ''}

      <View style={styles.buttons}>
      
        <TouchableOpacity onPress={signUp}>
          <Animated.View style={[styles.button, { transform : [{ scale: scaleValue }]}]}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={signIn}>
          <Animated.View style={[styles.button, { opacity: fadeValue }]}>
           <Text style={styles.buttonText}>Sign in</Text>
          </Animated.View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 10,
    marginRight: -20,
  },
  textBoxes: {
    maxWidth: '85%',
    minWidth: '85%',
    fontSize: 18,
    padding: 12,
    borderColor: '#4D5B9E',
    borderWidth: 0.2,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    //flex: 1,
    backgroundColor: '#5B5A62',//'#4D5B9E',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 10,
    cursor: 'pointer',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    padding: 10,
    fontWeight: '600',
  },
  title: {
    color: '#4C4B52',//'#293264',
    fontSize: 50,
    letterSpacing: 2,
    fontWeight: '800',
  },
  logo: {
    width: 80,
    height: 80,
  },
  buttons: {
    flexDirection: 'row'
  }
});
