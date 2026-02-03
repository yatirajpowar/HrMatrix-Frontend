import { useContext } from "react"
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { correctBorderRadius } from "framer-motion";

function Signin()
{
   
             return (
        <View style = {styles.container}>
            <View style = {styles.innerContainer}>
                <View style = {styles.logoContainer}>
                    <Text style = {styles.logoText}>HR</Text>
                    <Text style = {styles.logoSubtext}>Matrix</Text>
                </View>


                <Text style = {styles.welcomeText}>Employee Login</Text>

                <EditText
                label ='Email'
                placeholder ='e.g. john.doe@company.com'
                onChangeText ={setEmail}
                marginTop ={20}
                />

                <EditText
                isPassword ={true}
                label ='Password'
                placeholder = '.......'
                on onChangeText = {setPassword}
                marginTop = {15}
                />


                <View style = {styles.signupLinkContainer}>
                    <Text>New employee...?</Text>
                    <TouchableOpacity onPress = {() => navigation.navigate('Signup')}>
                        <Text style = {styles.signupLink}>Create Account</Text>
                    </TouchableOpacity>
                </View>


                <Button
                onPress = {onSignin}
                title = 'Sign In'
                margintop = {30}
                />
            </View>
        </View>    

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6', 
        justifyContent: 'center',
    },
    innercontainer: {
        backgroundColor: 'white',
        margin: 25,
        padding: 25,
        borderRadius: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 10,

    },
    logoContainer: {
        alignItem: 'center',
        marginBottom: 10,

    },
    LogoText: {
        fontSize: 40,
        fontWeight: '900',
        color: '2c3e50',
    },

    logoSubtext: {
        fontSize: 18,
        color: '#e67e22',
        marginTop: -10,
        fontWeight: 'bold',
        letterSpacing: 2,

    },
    welcomeText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },

    signupLinkContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    signupLink: {
        color: '#e67e22',
        fontWeight: 'bold',
    },
})

export default Signin;