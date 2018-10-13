import React from 'react'
import { StyleSheet, View, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'

export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={styles.icon}/>
           <TextInput {...props} style={styles.input}/>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    formContainer: {
        backgroundColor: 'rgb(0,0,0)',
        padding: 20,
        width: '90%',
    },
    inout: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    icon: {
        color: '#333',
        marginLeft: 20,
    },
    input: {
        marginLeft: 20,
        width: '70%'
    },
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    }
})